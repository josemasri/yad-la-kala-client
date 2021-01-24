import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axiosClient from "../helpers/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import { Details } from "../components/rifa/Details";
import { FormularioDatos } from "../components/reusable/FormularioDatos";
import { RifaPaquete } from "../components/paquete/RifaPaquete";
import { RifaPaqueteRestriccion } from "../components/paquete/RifaPaqueteRestriccion";
import { countOccurrences } from "../helpers/countOcurrences";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Modal from "react-modal";
import { Loading } from "../components/reusable/Loading";
import { ContactoEfectivo } from "../components/reusable/ContactoEfectivo";
import Navbar from "../components/reusable/Navbar";
import { InstruccionesPaquete } from "../components/reusable/InstruccionesPaquete";

const paquetePage = () => {
  const MySwal = withReactContent(Swal);

  const [paquete, setPaquete] = useState(null);
  const [rifas300, setRifas300] = useState([]);
  const [rifas350, setRifas350] = useState([]);
  const [rifas500, setRifas500] = useState([]);

  const [boletos, setBoletos] = useState({
    boletos300: [],
    boletos350: [],
    boletos500: [],
  });

  const router = useRouter();

  const [boleto, setBoleto] = useState({
    nombre: "",
    mail: "",
    pedido: "",
    celular: "",
    valid: false,
  });
  const [pedido, setPedido] = useState({
    option: "Leiluy Nishmat",
    nombre: "",
  });

  const [loading, setLoading] = useState(false);

  const [pagarConUsuario, setPagarConUsuario] = useState(false);

  const [usuario, setUsuario] = useState({
    usuario: "",
    password: "",
  });

  const getPaquete = async (id = "5fef865f274d7e33fcb14ff2") => {
    try {
      const res = await axiosClient.get(`/paquete-boletos/${id}`);
      setPaquete(res.data);
      const { data } = await axiosClient.get(`/rifas`);
      setBoletos({
        boletos300: Array.from(
          { length: res.data.cantidadBoletos300 },
          (item, idx) => {
            if (res.data.cantidadBoletos300 > 9) {
              return {
                idx,
                id: uuid(),
                boleto: 0,
                rifa: data.filter((rifa) => rifa.precio === 300)[
                  Math.floor(idx / 2)
                ].id,
              };
            } else {
              return {
                idx,
                id: uuid(),
                boleto: 0,
                rifa: data.filter((rifa) => rifa.precio === 300)[idx].id,
              };
            }
          }
        ),
        boletos350: Array.from(
          { length: res.data.cantidadBoletos350 },
          (item, idx) => {
            if (res.data.cantidadBoletos350 > 8) {
              return {
                idx,
                id: uuid(),
                boleto: 0,
                rifa: data.filter((rifa) => rifa.precio === 350)[
                  Math.floor(idx / 2)
                ].id,
              };
            } else {
              return {
                idx,
                id: uuid(),
                boleto: 0,
                rifa: data.filter((rifa) => rifa.precio === 350)[idx].id,
              };
            }
          }
        ),
        boletos500: Array.from(
          { length: res.data.cantidadBoletos500 },
          (item, idx) => ({
            idx,
            id: uuid(),
            boleto: 0,
            rifa: data.filter((rifa) => rifa.precio === 500)[0].id,
          })
        ),
      });
      setRifas300(data.filter((rifa) => rifa.precio === 300));
      setRifas350(data.filter((rifa) => rifa.precio === 350));
      setRifas500(data.filter((rifa) => rifa.precio === 500));
    } catch (error) {
      MySwal.fire({
        title: "Lo sentimos",
        icon: "error",
        text: "Ha ocurrido un error al cargar las rifas, Intentalo de nuevo",
      });
      router.push("/");
    }
  };

  useEffect(() => {
    // if (router.query.id) {
    // Obtener rifa
    getPaquete(router.query.id);
    // }
  }, []);

  const validarBoleto = () => {
    if (boleto.nombre.trim() === "") {
      toast("Ingresa tu nombre", { type: "error" });
      return;
    }
    if (boleto.nombre.trim() === "") {
      toast("Ingresa tu nombre", { type: "error" });
      return;
    }
  };

  const createOrder = async (data, actions) => {
    setLoading(true);
    // Obtener boletos comprados
    const resBoletosActual = await axiosClient.get(`/boletosComprados`);
    // Todo check duplicates
    let ocurrenciaRifas = {};
    [
      ...boletos.boletos300,
      ...boletos.boletos350,
      ...boletos.boletos500,
    ].forEach((boletoState) => {
      if (ocurrenciaRifas[boletoState.rifa]) {
        ocurrenciaRifas[boletoState.rifa].push(boletoState.boleto);
      } else {
        ocurrenciaRifas[boletoState.rifa] = [boletoState.boleto];
      }
    });
    for (const [key, value] of Object.entries(ocurrenciaRifas)) {
      // No el mismo boleto
      for (const [key2, value2] of Object.entries(countOccurrences(value))) {
        if (value2 > 1) {
          console.log("Error");
          MySwal.fire({
            title: "Lo sentimos",
            icon: "error",
            text: `No puedes seleccionar el número "${key2}" más de una vez para la rifa ${
              [...rifas300, ...rifas350, ...rifas500].find(
                (rifa) => rifa.id === key
              ).nombre
            }`,
          });
          setLoading(false);
          actions.disable();
          return;
        }
      }
      // Revisar con respuesta
      if (value.some((r) => resBoletosActual.data[key].includes(r))) {
        // Obtener la rifa
        MySwal.fire({
          title: "Lo sentimos",
          icon: "error",
          text: `Uno de los boletos seleccionados de la rifa ${
            [...rifas300, ...rifas350, ...rifas500].find(
              (rifa) => rifa.id === key
            ).nombre
          } dejo de estar disponible, vuelve a intentarlo`,
        });
        getPaquete(router.query.id);
        setLoading(false);
        actions.disable();
        return;
      }
      // Si hay restriccion
      if (paquete.restriccion) {
        if (paquete.cantidadBoletos300 === 18) {
          if (value.length >= 3) {
            MySwal.fire({
              title: "Lo sentimos",
              icon: "error",
              text: `No puedes seleccionar más de 2 veces la rifa ${
                [...rifas300, ...rifas350, ...rifas500].find(
                  (rifa) => rifa.id === key
                ).nombre
              } para este paquete`,
            });
            setLoading(false);
            actions.disable();
            return;
          }
        } else {
          if (value.length >= 2) {
            MySwal.fire({
              title: "Lo sentimos",
              icon: "error",
              text: `No puedes seleccionar más de una ves la rifa ${
                [...rifas300, ...rifas350, ...rifas500].find(
                  (rifa) => rifa.id === key
                ).nombre
              } para este paquete`,
            });
            setLoading(false);

            actions.disable();
            return;
          }
        }
      }
    }

    return actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: `Paquete ${paquete.nombre} (Yad La Kala)`,
          amount: {
            currency_code: "MXN",
            value: paquete.precio,
          },
        },
      ],
    });
  };

  const onApprove = async (data, actions) => {
    setLoading(true);
    await actions.order.capture();
    const order = await actions.order.get();
    console.log(order);
    console.log(boletos);
    try {
      // Registrar boletos en la bd
      await axiosClient.post("/comprar-paquete-boletos", {
        boletos: [
          ...boletos.boletos300,
          ...boletos.boletos350,
          ...boletos.boletos500,
        ],
        paquete: paquete.id,
        ...boleto,
        orderId: order.id,
      });
      setLoading(false);
      router.push("/agradecimiento");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const onError = () => {};

  const pagarConUsuarioClick = async () => {
    setLoading(true);
    // Obtener boletos comprados
    const resBoletosActual = await axiosClient.get(`/boletosComprados`);
    // Todo check duplicates
    let ocurrenciaRifas = {};
    [
      ...boletos.boletos300,
      ...boletos.boletos350,
      ...boletos.boletos500,
    ].forEach((boletoState) => {
      if (ocurrenciaRifas[boletoState.rifa]) {
        ocurrenciaRifas[boletoState.rifa].push(boletoState.boleto);
      } else {
        ocurrenciaRifas[boletoState.rifa] = [boletoState.boleto];
      }
    });
    for (const [key, value] of Object.entries(ocurrenciaRifas)) {
      // No el mismo boleto
      for (const [key2, value2] of Object.entries(countOccurrences(value))) {
        if (value2 > 1) {
          console.log("Error");
          MySwal.fire({
            title: "Lo sentimos",
            icon: "error",
            text: `No puedes seleccionar el número "${key2}" más de una vez para la rifa ${
              [...rifas300, ...rifas350, ...rifas500].find(
                (rifa) => rifa.id === key
              ).nombre
            }`,
          });
          setLoading(false);
          return;
        }
      }
      // Revisar con respuesta
      if (value.some((r) => resBoletosActual.data[key].includes(r))) {
        // Obtener la rifa
        MySwal.fire({
          title: "Lo sentimos",
          icon: "error",
          text: `Uno de los boletos seleccionados de la rifa ${
            [...rifas300, ...rifas350, ...rifas500].find(
              (rifa) => rifa.id === key
            ).nombre
          } dejo de estar disponible, vuelve a intentarlo`,
        });
        getPaquete(router.query.id);
        setLoading(false);
        return;
      }
      // Si hay restriccion
      if (paquete.restriccion) {
        if (paquete.cantidadBoletos300 === 18) {
          if (value.length >= 3) {
            MySwal.fire({
              title: "Lo sentimos",
              icon: "error",
              text: `No puedes seleccionar más de 2 veces la rifa ${
                [...rifas300, ...rifas350, ...rifas500].find(
                  (rifa) => rifa.id === key
                ).nombre
              } para este paquete`,
            });
            setLoading(false);
            return;
          }
        } else {
          if (value.length >= 2) {
            MySwal.fire({
              title: "Lo sentimos",
              icon: "error",
              text: `No puedes seleccionar más de una ves la rifa ${
                [...rifas300, ...rifas350, ...rifas500].find(
                  (rifa) => rifa.id === key
                ).nombre
              } para este paquete`,
            });
            setLoading(false);
            return;
          }
        }
      }
    }
    try {
      setLoading(true);
      const res = await axiosClient.post("/comprar-paquete-boletos-usuario", {
        boletos: [
          ...boletos.boletos300,
          ...boletos.boletos350,
          ...boletos.boletos500,
        ],
        paquete: paquete.id,
        ...boleto,
        ...usuario,
      });
      setLoading(false);
      router.push("/agradecimiento");
    } catch (error) {
      toast("Usuario o contraseña incorrecta", {
        type: "error",
      });
      setLoading(false);
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    setBoleto({ ...boleto, pedido: `${pedido.option} ${pedido.nombre}` });
  }, [pedido]);

  useEffect(() => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (
      boleto.nombre.trim() !== "" &&
      boleto.celular.trim() !== "" &&
      boleto.mail.trim() !== "" &&
      re.test(boleto.mail.toLowerCase()) &&
      !boleto.valid
    ) {
      setBoleto({ ...boleto, valid: true });
    } else if (
      (boleto.nombre.trim() === "" ||
        boleto.celular.trim() === "" ||
        boleto.mail.trim() === "" ||
        !re.test(boleto.mail.toLowerCase())) &&
      boleto.valid
    ) {
      setBoleto({ ...boleto, valid: false });
    }
  }, [boleto]);

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto">
        {paquete && (
          <div className="min-h-screen p-5 font-bold max-w-4xl mx-auto">
            <div className="">
              <Details rifa={paquete} />

              <InstruccionesPaquete />
              <div
                className="h-1 my-5"
                style={{
                  borderTop: "4px dotted #6adad7",
                }}
              ></div>
              <FormularioDatos
                boleto={boleto}
                setBoleto={setBoleto}
                setPedido={setPedido}
                pedido={pedido}
              />
            </div>
            {paquete && (
              <div>
                <div>
                  {paquete.cantidadBoletos300 > 0 && (
                    <div className="text-center my-2 text-xl bg-yellow-300 rounded">
                      Escoge tus boletos de $300
                    </div>
                  )}
                  {Array.from(
                    { length: paquete.cantidadBoletos300 },
                    (variable, k) => (
                      <Fragment key={k}>
                        {rifas300.length > 0 &&
                          boletos.boletos300.length > 0 && (
                            <RifaPaquete
                              boletoState={boletos.boletos300[k]}
                              setBoletos={setBoletos}
                              rifas={rifas300}
                              precioBoletos="boletos300"
                            />
                          )}
                      </Fragment>
                    )
                  )}
                </div>
                <div>
                  {paquete.cantidadBoletos350 > 0 && (
                    <div className="text-center my-2 text-xl bg-yellow-300 rounded">
                      Escoge tus boletos de $350
                    </div>
                  )}
                  {Array.from(
                    { length: paquete.cantidadBoletos350 },
                    (variable, k) => (
                      <Fragment key={k}>
                        {rifas350.length > 0 &&
                          boletos.boletos350.length > 0 && (
                            <RifaPaquete
                              boletoState={boletos.boletos350[k]}
                              setBoletos={setBoletos}
                              rifas={rifas350}
                              precioBoletos="boletos350"
                            />
                          )}
                      </Fragment>
                    )
                  )}
                </div>
                <div>
                  {paquete.cantidadBoletos500 > 0 && (
                    <div className="text-center my-2 text-xl bg-yellow-500 rounded">
                      Escoge tus boletos de $500
                    </div>
                  )}
                  {Array.from(
                    { length: paquete.cantidadBoletos500 },
                    (variable, k) => (
                      <Fragment key={k}>
                        {rifas500.length > 0 &&
                          boletos.boletos500.length > 0 && (
                            <RifaPaquete
                              boletoState={boletos.boletos500[k]}
                              setBoletos={setBoletos}
                              rifas={rifas500}
                              precioBoletos="boletos500"
                            />
                          )}
                      </Fragment>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        )}
        {paquete?.boletosHotPot > 0 && (
          <div className="text-center my-2 text-xl bg-yellow-500 rounded">
            {paquete.boletosHotPot} Boletos de Hot Pot
          </div>
        )}
        {boleto.valid &&
          [
            ...boletos.boletos300,
            ...boletos.boletos350,
            ...boletos.boletos500,
          ].every((boleto) => {
            console.log(boleto.boleto);
            return !(boleto.boleto == null);
          }) && (
            <div className="mt-2">
              <PayPalScriptProvider
                options={{
                  "client-id": process.env.NEXT_PUBLIC_PAYPAL_ID,
                  currency: "MXN",
                }}
              >
                <PayPalButtons
                  forceReRender={boletos}
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                />
              </PayPalScriptProvider>
              <ContactoEfectivo />
              {!pagarConUsuario && (
                <button
                  className="text-white py-2 block rounded-lg w-full text-base mb-2"
                  style={{
                    backgroundColor: "#6adad7",
                  }}
                  onClick={() => setPagarConUsuario(!pagarConUsuario)}
                >
                  Pagar con usuario
                </button>
              )}
              {pagarConUsuario && (
                <div className="">
                  <input
                    placeholder="Nombre de Usuario"
                    className="block w-full bg-transparent text-center border-b border-gray-500 p-1"
                    type="text"
                    value={usuario.usuario}
                    onChange={({ target: { value } }) =>
                      setUsuario({ ...usuario, usuario: value })
                    }
                  />
                  <input
                    placeholder="Contraseña"
                    className="block w-full bg-transparent text-center border-b border-gray-500 p-1"
                    type="password"
                    value={usuario.password}
                    onChange={({ target: { value } }) =>
                      setUsuario({ ...usuario, password: value })
                    }
                  />
                  <button
                    className="text-white py-2 block rounded-lg w-full text-base mt-2"
                    style={{
                      backgroundColor: "#6adad7",
                    }}
                    onClick={pagarConUsuarioClick}
                  >
                    Pagar con usuario
                  </button>
                </div>
              )}
            </div>
          )}
      </div>
      <Modal
        isOpen={loading}
        ariaHideApp={false}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <div className="text-center">
          <p className="mb-2">Por favor espere...</p>
          <Loading />
        </div>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default paquetePage;
