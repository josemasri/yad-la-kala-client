import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axiosClient from "../helpers/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import { HotPot } from "../components/index/HotPot";
import { ContactoEfectivo } from "../components/reusable/ContactoEfectivo";

const RifaHotPotPage = () => {
  const [numeroActual, setNumeroActual] = useState();
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

  const [pagarConUsuario, setPagarConUsuario] = useState(false);

  const [usuario, setUsuario] = useState({
    usuario: "",
    password: "",
  });

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
    return actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: "Boleto Rifa Hot Pot",
          amount: {
            currency_code: "MXN",
            value: 500,
          },
        },
      ],
    });
  };

  const onApprove = async (data, actions) => {
    await actions.order.capture();
    const order = await actions.order.get();
    // Registrar boletos en la bd
    try {
      await axiosClient.post("/boletos-hot-pots", {
        nombre: boleto.nombre,
        mail: boleto.mail,
        celular: boleto.celular,
        pedido: boleto.pedido,
        orderId: order.id,
      });
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const onError = () => {};

  const pagarConUsuarioClick = async () => {
    // Registrar boletos en la bd
    try {
      await axiosClient.post("/boletos-hot-pot-usuario", {
        nombre: boleto.nombre,
        mail: boleto.mail,
        celular: boleto.celular,
        pedido: boleto.pedido,
        usuario: usuario.usuario,
        password: usuario.password,
      });
      router.push("/agradecimiento");
    } catch (error) {
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

  useEffect(() => {
    setBoleto({ ...boleto, pedido: `${pedido.option} ${pedido.nombre}` });
  }, [pedido]);

  return (
    <>
      <div className="min-h-screen p-5 font-bold max-w-4xl mx-auto">
        <div className="">
          <div
            className="rounded-lg block p-1 text-center text-xl"
            style={{
              border: "4px solid #6adad7",
            }}
          >
            <h3>Ingresa tus datos</h3>
            <div className="mt-2">
              <label htmlFor="nombre">Nombre</label>
              <input
                autoFocus
                id="nombre"
                className="block w-full bg-transparent text-center border-b border-gray-500 p-1"
                type="text"
                name="nombre"
                value={boleto.nombre}
                onChange={({ target: { value } }) =>
                  setBoleto({ ...boleto, nombre: value })
                }
              />
            </div>
            <div className="mt-2">
              <label htmlFor="celular">Celular</label>
              <input
                id="celular"
                className="block w-full bg-transparent text-center border-b border-gray-500 p-1"
                type="text"
                name="celular"
                value={boleto.celular}
                onChange={({ target: { value } }) =>
                  setBoleto({ ...boleto, celular: value })
                }
              />
            </div>
            <div className="mt-2">
              <label htmlFor="correo">Mail</label>

              <input
                id="correo"
                className="block w-full bg-transparent text-center border-b border-gray-500 p-1"
                type="mail"
                name="correo"
                value={boleto.mail}
                onChange={({ target: { value } }) =>
                  setBoleto({ ...boleto, mail: value })
                }
              />
            </div>
            <div className="mt-2 text-base">
              <div className="flex items-center justify-center">
                <h5 className="text-center mr-2">Ingresa tu Pedido</h5>
              </div>

              <div className="lg:flex text-center">
                <select
                  className="w-full bg-transparent text-center border-b border-gray-500 p-1 placeholder-gray-600"
                  style={{
                    textAlignLast: "center",
                  }}
                  onChange={(e) =>
                    setPedido({ ...pedido, option: e.target.value })
                  }
                  value={pedido.option}
                >
                  <option value="Leiluy Nishmat">
                    Leiluy Nishmat (Fallecido)
                  </option>
                  <option value="Refua Shelema">Refua Shelema (Enfermo)</option>
                  <option value="Beraja y Hatzlaja">
                    Beraja y Hatzlaja (Bendiciones y éxito)
                  </option>
                  <option value="Zibug Hagun">
                    Zibug Hagun (Conseguir Pareja)
                  </option>
                  <option value="Zera Shel Kayama">
                    Zera Shel Kayama (Tener Hijos)
                  </option>
                </select>
                <input
                  className="w-full bg-transparent text-center border-b border-gray-500 p-1 mb-2"
                  type="text"
                  placeholder="Nombre (ej. Yosef Ben Sara)"
                  onChange={(e) =>
                    setPedido({ ...pedido, nombre: e.target.value })
                  }
                  value={pedido.nombre}
                />
              </div>
            </div>
            <div className="p-2 text-sm font-normal">
              <p className="text-lg">
                Total:{" "}
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                }).format(500)}{" "}
              </p>
            </div>
            {boleto.valid ? (
              <div className="mt-2">
                <PayPalScriptProvider
                  options={{
                    "client-id": process.env.NEXT_PUBLIC_PAYPAL_ID,
                    currency: "MXN",
                  }}
                >
                  <PayPalButtons
                    forceReRender={boleto}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  />
                </PayPalScriptProvider>
                <ContactoEfectivo />
                {!pagarConUsuario && (
                  <button
                    className="text-white py-2 block rounded-lg w-full text-base"
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
            ) : (
              <button
                onClick={() =>
                  toast("Completa los campos para realizar tu donativo", {
                    type: "warning",
                  })
                }
                className="bg-gray-300 px-2 py-1 text-white rounded"
              >
                Donar
              </button>
            )}
          </div>
        </div>
        <div
          className="rounded-lg my-2"
          style={{
            border: "4px solid #6adad7",
          }}
        >
          <HotPot />
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default RifaHotPotPage;
