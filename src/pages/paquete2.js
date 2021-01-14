import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import SlideShowRifas from "../components/paquete/SlideShowRifas";

import Navbar from "../components/reusable/Navbar";
import axiosClient from "../helpers/axiosClient";
import { useRouter } from "next/router";
import { Details } from "../components/rifa/Details";
import { InstruccionesPaquete } from "../components/reusable/InstruccionesPaquete";
import { FormularioDatos } from "../components/reusable/FormularioDatos";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ContactoEfectivo } from "../components/reusable/ContactoEfectivo";
import { Loading } from "../components/reusable/Loading";
import Modal from "react-modal";

export default function Home() {
  const [rifas, setRifas] = useState([]);
  const [boletosSeleccionados, setBoletosSeleccionados] = useState([]);
  const [boletosComprados, setBoletosComprados] = useState([]);
  const [paquete, setPaquete] = useState();
  const [
    boletosTotalesSeleccionados,
    setBoletosTotalesSeleccionados,
  ] = useState({
    boletos300: 0,
    boletos350: 0,
    boletos500: 0,
  });
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

  const router = useRouter();

  const getPaquete = async () => {
    try {
      const res = await axiosClient.get(
        `/paquete-boletos/${router.query.id || "5ffdf294768230040243acad"}`
      );
      setPaquete(res.data);
    } catch (error) {
      router.push("/");
    }
  };

  const getBoletosComprados = async () => {
    try {
      const res = await axiosClient.get("/boletosComprados");
      setBoletosComprados(res.data);
    } catch (error) {
      router.push("/");
    }
  };

  const agregarBoleto = (numero, rifaId) => {
    // Encontrar rifa
    const rifa = rifas.find((rifa) => rifa.id === rifaId);

    // Considerar Restricciones
    if (
      rifa.precio === 300 &&
      boletosTotalesSeleccionados.boletos300 >= paquete.cantidadBoletos300
    ) {
      toast("Ya selecionaste todos tus boletos de 300", {
        type: "warning",
      });
      return;
    }
    if (
      rifa.precio === 350 &&
      boletosTotalesSeleccionados.boletos350 >= paquete.cantidadBoletos350
    ) {
      toast("Ya selecionaste todos tus boletos de 350", {
        type: "warning",
      });
      return;
    }
    if (
      rifa.precio === 500 &&
      boletosTotalesSeleccionados.boletos500 >= paquete.cantidadBoletos500
    ) {
      toast("Ya selecionaste todos tus boletos de 500", {
        type: "warning",
      });
      return;
    }

    // Restriccion de rifa
    if (paquete.restriccion) {
      // Ver si existe la rifa
      const boletoActual = boletosSeleccionados.find(
        (boletosSeleccionado) => boletosSeleccionado.rifa === rifaId
      );

      if (boletoActual) {
        // Ver tamaño
        if (paquete.cantidadBoletos300 < 10) {
          if (boletoActual.numeros.length >= 1) {
            toast(
              "No puedes seleccionar más de 1 boletos por rifa para este paquete",
              {
                type: "warning",
              }
            );
            return;
          }
        } else {
          // No más de 2 boletos por rifa
          if (boletoActual.numeros.length >= 2) {
            toast(
              "No puedes seleccionar más de 2 boleto por rifa para este paquete",
              {
                type: "warning",
              }
            );
            return;
          }
        }
      }
    }

    if (
      boletosSeleccionados.find(
        (boletoSeleccionado) => rifaId === boletoSeleccionado.rifa
      )
    ) {
      const idx = boletosSeleccionados.findIndex(
        (boletoSeleccionado) => rifaId === boletoSeleccionado.rifa
      );
      const boletosNuevos = [...boletosSeleccionados];
      boletosNuevos[idx].numeros.push(numero);
      setBoletosSeleccionados(boletosNuevos);
    } else {
      setBoletosSeleccionados([
        ...boletosSeleccionados,
        {
          rifa: rifaId,
          numeros: [numero],
        },
      ]);
    }

    if (rifa.precio === 300) {
      setBoletosTotalesSeleccionados({
        ...boletosTotalesSeleccionados,
        boletos300: boletosTotalesSeleccionados.boletos300 + 1,
      });
    } else if (rifa.precio === 350) {
      setBoletosTotalesSeleccionados({
        ...boletosTotalesSeleccionados,
        boletos350: boletosTotalesSeleccionados.boletos350 + 1,
      });
    } else {
      setBoletosTotalesSeleccionados({
        ...boletosTotalesSeleccionados,
        boletos500: boletosTotalesSeleccionados.boletos500 + 1,
      });
    }
  };

  const eliminarBoleto = (numero, rifaId) => {
    const rifa = rifas.find((rifa) => rifa.id === rifaId);
    const boletosNuevos = [...boletosSeleccionados];
    const idx = boletosNuevos.findIndex(
      (boletoSeleccionado) => rifaId === boletoSeleccionado.rifa
    );

    boletosNuevos[idx].numeros = boletosNuevos[idx].numeros.filter(
      (numeroSeleccionado) => numeroSeleccionado !== numero
    );
    setBoletosSeleccionados(boletosNuevos);

    if (rifa.precio === 300) {
      setBoletosTotalesSeleccionados({
        ...boletosTotalesSeleccionados,
        boletos300: boletosTotalesSeleccionados.boletos300 - 1,
      });
    } else if (rifa.precio === 350) {
      setBoletosTotalesSeleccionados({
        ...boletosTotalesSeleccionados,
        boletos350: boletosTotalesSeleccionados.boletos350 - 1,
      });
    } else {
      setBoletosTotalesSeleccionados({
        ...boletosTotalesSeleccionados,
        boletos500: boletosTotalesSeleccionados.boletos500 - 1,
      });
    }
  };

  useEffect(() => {
    getBoletosComprados();
    const getRifas = async () => {
      try {
        const res = await axiosClient.get("/rifas");
        setRifas(res.data);
        console.log(res.data);
      } catch (error) {
        router.push("/");
      }
    };
    getPaquete();
    getRifas();
  }, []);

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

  // Paypal
  const createOrder = async (data, actions) => {
    // Obtener boletos comprados
    try {
      const resBoletosActual = await axiosClient.get(`/boletosComprados`);
      let duplicates = false;
      // Todo check duplicates
      Object.keys(resBoletosActual.data).forEach((rifaId) => {
        // Encontrar Boleto
        const boletoActual = boletosSeleccionados.find(
          (boletosSeleccionado) => boletosSeleccionado.rifa === rifaId
        );
        if (boletoActual) {
          if (
            boletoActual.numeros.some((r) =>
              resBoletosActual.data[rifaId].includes(r)
            )
          ) {
            toast(
              `Uno de tus boletos de la rifa ${
                rifas.find((rifa) => rifa.id === rifaId).nombre
              } fue comprado, por favor cambialo antes de continuar`,
              {
                type: "error",
              }
            );
            duplicates = true;
          }
        }
      });
      if (duplicates) {
        actions.disable();
        return;
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
    } catch (error) {
      router.push("/");
    }
  };

  const onApprove = async (data, actions) => {
    setLoading(true);
    await actions.order.capture();
    const order = await actions.order.get();
    try {
      const boletos = [];
      boletosSeleccionados.forEach((boletosSeleccionado) => {
        boletosSeleccionado.numeros.forEach((numero) =>
          boletos.push({
            boleto: numero,
            rifa: boletosSeleccionado.rifa,
          })
        );
      });
      try {
        // Registrar boletos en la bd
        await axiosClient.post("/comprar-paquete-boletos", {
          boletos,
          paquete: paquete.id,
          ...boleto,
          orderId: order.id,
        });
        setLoading(false);
        router.push("/agradecimiento");
      } catch (error) {
        toast(
          "Ha ocurrido un error al registrar tus boletos, favor de comunicarte a 5563192945 con Jose Masri",
          { type: "error" }
        );
      }
    } catch (error) {
      setLoading(false);
      toast(
        "Ha ocurrido un error al registrar tus boletos, favor de comunicarte a 5563192945 con Jose Masri",
        { type: "error" }
      );
    }
  };

  const onError = () => {
    toast("Ha ocurrido un error al procesar el pago", {
      type: "error",
    });
    setLoading(false);
  };

  // Pago en efectivo
  const pagarConUsuarioClick = async () => {
    try {
      setLoading(true);
      // Obtener boletos comprados
      const resBoletosActual = await axiosClient.get(`/boletosComprados`);
      let duplicates = false;
      // Todo check duplicates
      Object.keys(resBoletosActual.data).forEach((rifaId) => {
        // Encontrar Boleto
        const boletoActual = boletosSeleccionados.find(
          (boletosSeleccionado) => boletosSeleccionado.rifa === rifaId
        );
        if (boletoActual) {
          if (
            boletoActual.numeros.some((r) =>
              resBoletosActual.data[rifaId].includes(r)
            )
          ) {
            toast(
              `Uno de tus boletos de la rifa ${
                rifas.find((rifa) => rifa.id === rifaId).nombre
              } fue comprado, por favor cambialo antes de continuar`,
              {
                type: "error",
              }
            );
            duplicates = true;
          }
        }
      });
      if (duplicates) {
        setLoading(false);
        return;
      }

      // Agregar cuenta
      try {
        setLoading(true);
        const boletos = [];
        boletosSeleccionados.forEach((boletosSeleccionado) => {
          boletosSeleccionado.numeros.forEach((numero) =>
            boletos.push({
              boleto: numero,
              rifa: boletosSeleccionado.rifa,
            })
          );
        });
        const res = await axiosClient.post("/comprar-paquete-boletos-usuario", {
          boletos,
          paquete: paquete.id,
          ...boleto,
          ...usuario,
        });
        setLoading(false);
        router.push("/agradecimiento");
      } catch (error) {
        setLoading(false);
        toast("Usuario o contraseña incorrecta", {
          type: "error",
        });
      }
    } catch (error) {
      setLoading(false);
      toast("Ha ocurrido un error", {
        type: "error",
      });
    }
  };

  return (
    <div>
      <Navbar />
      {paquete && (
        <>
          <div className="p-2">
            <Details rifa={paquete} />
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

            {boletosComprados && (
              <SlideShowRifas
                boletosComprados={boletosComprados}
                boletosSeleccionados={boletosSeleccionados}
                agregarBoleto={agregarBoleto}
                eliminarBoleto={eliminarBoleto}
                rifas={rifas}
              />
            )}
            {(boletosTotalesSeleccionados.boletos300 <
              paquete.cantidadBoletos300 ||
              boletosTotalesSeleccionados.boletos350 <
                paquete.cantidadBoletos350 ||
              boletosTotalesSeleccionados.boletos500 <
                paquete.cantidadBoletos500) && (
              <div className="px-5 mt-2">
                <p className="text-center">Boletos Restantes:</p>
                <div className="flex items-center justify-around">
                  <p className="text-right border border-green-300 rounded-lg p-2">
                    <span className="text-green-300 font-bold">
                      {paquete.cantidadBoletos300 -
                        boletosTotalesSeleccionados.boletos300}
                    </span>{" "}
                    de $300
                  </p>
                  <p className="text-right border border-green-300 rounded-lg p-2">
                    <span className="text-green-300 font-bold">
                      {paquete.cantidadBoletos350 -
                        boletosTotalesSeleccionados.boletos350}{" "}
                    </span>{" "}
                    de $350
                  </p>
                  <p className="text-right border border-green-300 rounded-lg p-2">
                    <span className="text-green-300 font-bold">
                      {paquete.cantidadBoletos500 -
                        boletosTotalesSeleccionados.boletos500}{" "}
                    </span>{" "}
                    de $500
                  </p>
                </div>
                {paquete?.boletosHotPot > 10 && (
                  <p className="text-center">
                    * Los boletos del Hot Pot se agregan automáticamente{" "}
                  </p>
                )}
              </div>
            )}
            {boleto.valid &&
              boletosTotalesSeleccionados.boletos300 ===
                paquete.cantidadBoletos300 &&
              boletosTotalesSeleccionados.boletos350 ===
                paquete.cantidadBoletos350 &&
              boletosTotalesSeleccionados.boletos500 ===
                paquete.cantidadBoletos500 &&
              boleto.valid && (
                <div className="mt-2">
                  <PayPalScriptProvider
                    options={{
                      "client-id": process.env.NEXT_PUBLIC_PAYPAL_ID,
                      currency: "MXN",
                    }}
                  >
                    <PayPalButtons
                      forceReRender={boletosSeleccionados}
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
        </>
      )}
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
    </div>
  );
}
