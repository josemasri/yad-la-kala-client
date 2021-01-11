import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axiosClient from "../helpers/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import { SelectorNumeros } from "../components/rifa/SelectorNumeros";
import { Details } from "../components/rifa/Details";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";
import { Loading } from "../components/reusable/Loading";
import Swal from "sweetalert2";

const rifa = () => {
  const [rifa, setRifa] = useState();
  const router = useRouter();

  const [boleto, setBoleto] = useState({
    nombre: "",
    mail: "",
    pedido: "",
    celular: "",
    valid: false,
  });
  const [numerosSeleccionados, setNumerosSeleccionados] = useState([]);
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

  const getRifa = async (id = "5ff60ec739fb4810c05415d4") => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/rifas/${id}`);
      setRifa(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast("Ha ocurrido un error al cargar la rifa");
      router.push("/");
    }
  };

  useEffect(() => {
    // if (router.query.id) {
    // Obtener rifa
    getRifa(router.query.id);
    // }
  }, []);

  const eliminarNumero = (numeroEliminado) =>
    setNumerosSeleccionados(
      [...numerosSeleccionados].filter((numero) => numero !== numeroEliminado)
    );

  const agregarNumero = (numeroAgregado) =>
    setNumerosSeleccionados(
      [...numerosSeleccionados, numeroAgregado].sort((a, b) => a - b)
    );

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

  const pagarConUsuarioClick = async () => {
    const res = await axiosClient.get(`/rifas/${router.query.id}`);
    const duplicates = res.data.boletosComprados.some((r) =>
      numerosSeleccionados.includes(r)
    );
    if (duplicates) {
      setRifa(res.data);
      toast(
        "El número seleccionado dejo de estar disponible, por favor selecciona otro(s)",
        { type: "error" }
      );
      setNumerosSeleccionados([]);
    }
    try {
      setLoading(true);
      const res = await axiosClient.post("/boletos-usuario", {
        nombre: boleto.nombre,
        mail: boleto.mail,
        celular: boleto.celular,
        pedido: boleto.pedido,
        rifa: rifa.id,
        numerosSeleccionados,
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

  const createOrder = async (data, actions) => {
    const res = await axiosClient.get(`/rifas/${router.query.id}`);
    console.log(res);
    const duplicates = res.data.boletosComprados.some((r) =>
      numerosSeleccionados.includes(r)
    );
    if (duplicates) {
      setRifa(res.data);
      toast(
        "El número seleccionado dejo de estar disponible, por favor selecciona otro(s)",
        { type: "error" }
      );
      setNumerosSeleccionados([]);
      actions.disable();
      setLoading(false);
      return;
    }
    return actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: "Boleto Rifa",
          amount: {
            currency_code: "MXN",
            value: numerosSeleccionados.length * rifa.precio,
          },
        },
      ],
    });
  };

  const onApprove = async (data, actions) => {
    console.log("onApprove");
    // Registrar boletos en la bd
    try {
      await actions.order.capture();
      const order = await actions.order.get();
      setLoading(true);
      await axiosClient.post("/boletos", {
        nombre: boleto.nombre,
        mail: boleto.mail,
        celular: boleto.celular,
        pedido: boleto.pedido,
        rifa: rifa.id,
        numerosSeleccionados,
        order,
      });
      setLoading(false);
      router.push("/agradecimiento");
    } catch (error) {
      setLoading(false);
      console.log(error.response.data);
    }
  };

  const onError = () => {
    setLoading(false);
  };

  useEffect(() => {
    setBoleto({ ...boleto, pedido: `${pedido.option} ${pedido.nombre}` });
  }, [pedido]);

  useEffect(() => {
    if (
      boleto.nombre.trim() !== "" &&
      boleto.celular.trim() !== "" &&
      boleto.mail.trim() !== "" &&
      !boleto.valid
    ) {
      setBoleto({ ...boleto, valid: true });
    } else if (
      (boleto.nombre.trim() === "" ||
        boleto.celular.trim() === "" ||
        boleto.mail.trim() === "") &&
      boleto.valid
    ) {
      setBoleto({ ...boleto, valid: false });
    }
  }, [boleto]);

  return (
    <>
      {rifa && (
        <div
          className="min-h-screen p-5 font-bold max-w-4xl mx-auto"
          style={{
            backgroundImage: `url("images/pattern.png")`,
          }}
        >
          <div className="">
            <Details rifa={rifa} />
            <div
              className="h-1 my-5"
              style={{
                borderTop: "4px dotted #6adad7",
              }}
            ></div>
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
                  type="tel"
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
                    <option value="Refua Shelema">
                      Refua Shelema (Enfermo)
                    </option>
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
              <SelectorNumeros
                eliminarNumero={eliminarNumero}
                agregarNumero={agregarNumero}
                numerosSeleccionados={numerosSeleccionados}
                numerosComprados={rifa.boletosComprados}
              />
              <div className="p-2 text-sm font-normal">
                <p>
                  Numero(s) seleccionados:{" "}
                  {numerosSeleccionados.map(
                    (numero, i) =>
                      `${numero}${
                        i !== numerosSeleccionados.length - 1 ? ", " : ""
                      }`
                  )}
                </p>
                <p className="text-lg">
                  Total:{" "}
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  }).format(numerosSeleccionados.length * rifa.precio)}{" "}
                </p>
              </div>
              {numerosSeleccionados.length > 0 && boleto.valid ? (
                <div className="mt-2">
                  <PayPalScriptProvider
                    options={{
                      "client-id": process.env.NEXT_PUBLIC_PAYPAL_ID,
                      currency: "MXN",
                    }}
                  >
                    <PayPalButtons
                      forceReRender={[numerosSeleccionados]}
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    />
                  </PayPalScriptProvider>
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
        </div>
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
    </>
  );
};

export default rifa;
