import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";

import { BotonDonativos } from "../components/reusable/BotonDonativos";
import { ContactoEfectivo } from "../components/reusable/ContactoEfectivo";
import { Details } from "../components/rifa/Details";
import { FormularioDatos } from "../components/reusable/FormularioDatos";
import { Loading } from "../components/reusable/Loading";
import Modal from "react-modal";
import Navbar from "../components/reusable/Navbar";
import SlideShowRifas from "../components/paquete/SlideShowRifas";
import StripePayment from "../components/stripe/StripePayment";
import Swal from "sweetalert2";
import axiosClient from "../helpers/axiosClient";
import { useRouter } from "next/router";
import withReactContent from "sweetalert2-react-content";

export default function Home() {
  const MySwal = withReactContent(Swal);
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

  const validarDatos = async () => {
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
      toast(
        "El número seleccionado dejo de estar disponible, por favor selecciona otro(s)",
        { type: "error" }
      );
      return false;
    }
    return true;
  };

  const garantizarBoletos = async (res) => {
    setLoading(true);
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
          orderId: res.id,
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
          if (boletoActual.numeros.length >= 2) {
            toast(
              "No puedes seleccionar más de 2 boletos por rifa para este paquete",
              {
                type: "warning",
              }
            );
            return;
          }
        } else {
          // No más de 3 boletos por rifa
          if (boletoActual.numeros.length >= 3) {
            toast(
              "No puedes seleccionar más de 3 boleto por rifa para este paquete",
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
        const boletosComprados = await axiosClient.get("/boletosComprados");
        const rifas = res.data
          .map((rifa, i) => ({
            ...rifa,
            imgSoldout: `https://imagenes-yad.s3.us-east-2.amazonaws.com/rifa-${i + 1}-s.png`,
            soldout:
              boletosComprados.data[rifa.id].length >= rifa.numerosTotales,
          }))
          .sort((a, b) => a.soldout - b.soldout);
        setRifas(rifas);
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

  const pagarConDonativos = async () => {
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
        const res = await axiosClient.post(
          "/comprar-paquete-boletos-donativos",
          {
            boletos,
            paquete: paquete.id,
            ...boleto,
          }
        );
        setLoading(false);
        MySwal.fire({
          title: "Estas siendo redirigido a Dontivos Inteligentes",
          text:
            "Tienes hasta 48 horas para completar tu pago y garantizar tus boletos",
          icon: "success",
        });
        setTimeout(() => {
          window.location = encodeURI(
            `https://www.donativosinteligentes.com/proyectos/you-give-you-win/donacion-express/?mo=${
              paquete.precio
            }&nom=${boleto.nombre.split(" ")[0]}&ape=${
              boleto.nombre.split(" ")[1]
            }&em=${boleto.mail}&cel=${boleto.celular}&com=Paquete ${
              paquete.nombre
            }\nNumeros Seleccionados: 
          ${boletos.map(
            (boleto) =>
              `\nRifa: ${
                rifas.find((rifa) => rifa.id === boleto.rifa).nombre
              } Boleto ${boleto.boleto}, `
          )}`
          );
        }, 10000);
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
      <div className="max-w-md mx-auto">
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

                  <p className="text-center">
                    * Los boletos del JackPot se agregan automáticamente{" "}
                  </p>
                </div>
              )}
              {boletosTotalesSeleccionados.boletos300 ===
                paquete.cantidadBoletos300 &&
                boletosTotalesSeleccionados.boletos350 ===
                  paquete.cantidadBoletos350 &&
                boletosTotalesSeleccionados.boletos500 ===
                  paquete.cantidadBoletos500 && (
                  <div
                    className="rounded-lg block p-1 text-center mt-5"
                    style={{
                      border: "4px solid #6adad7",
                    }}
                  >
                    <FormularioDatos
                      boleto={boleto}
                      setBoleto={setBoleto}
                      setPedido={setPedido}
                      pedido={pedido}
                    />
                    {boleto.valid && (
                      <div className="">
                        {/* <BotonDonativos onClick={pagarConDonativos} /> */}
                        {/* <StripePayment
                          validarDatos={validarDatos}
                          garantizarBoletos={garantizarBoletos}
                          amount={parseFloat(paquete.precio)}
                        /> */}
                      </div>
                    )}
                  </div>
                )}
              {boleto.valid &&
                boletosTotalesSeleccionados.boletos300 ===
                  paquete.cantidadBoletos300 &&
                boletosTotalesSeleccionados.boletos350 ===
                  paquete.cantidadBoletos350 &&
                boletosTotalesSeleccionados.boletos500 ===
                  paquete.cantidadBoletos500 && (
                  <div className="">
                    <ContactoEfectivo />

                    <div className="mt-2">
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
                  </div>
                )}
            </div>
          </>
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
    </div>
  );
}
