import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { BoletosSeleccionados } from "../components/reusable/BoletosSeleccionados";
import { BotonDonativos } from "../components/reusable/BotonDonativos";
import { ContactoEfectivo } from "../components/reusable/ContactoEfectivo";
import { Details } from "../components/rifa/Details";
import { FormularioDatos } from "../components/reusable/FormularioDatos";
import { Loading } from "../components/reusable/Loading";
import Modal from "react-modal";
import { SelectorNumeros } from "../components/rifa/SelectorNumeros";
import StripePayment from "../components/stripe/StripePayment";
import Swal from "sweetalert2";
import axiosClient from "../helpers/axiosClient";
import { useRouter } from "next/router";
import withReactContent from "sweetalert2-react-content";

const rifa = () => {
  const MySwal = withReactContent(Swal);
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

  const getRifa = async (id) => {
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
    if (router.query.id) {
      try {
        getRifa(router.query.id);
      } catch (err) {
        console.log(err);
      }
    } else {
      router.push("/");
    }
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

  const validarDatos = async () => {
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
      return false;
    }
    return true;
  };

  const garantizarBoletos = async (res) => {
    console.log(res);
    try {
      setLoading(true);
      await axiosClient.post("/boletos", {
        nombre: boleto.nombre,
        mail: boleto.mail,
        celular: boleto.celular,
        pedido: boleto.pedido,
        rifa: rifa.id,
        numerosSeleccionados,
        ...usuario,
        order: res,
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

  const pagarConDonativos = async () => {
    if (!boleto.nombre.split(" ")[1]) {
      toast('Por favor ingresa tu nombre completo', {
        type: 'warning'
      });
      return;
    }

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
      return;
    }
    try {
      setLoading(true);
      const res = await axiosClient.post("/boletos-donativos", {
        nombre: boleto.nombre,
        mail: boleto.mail,
        celular: boleto.celular,
        pedido: boleto.pedido,
        rifa: rifa.id,
        numerosSeleccionados,
      });
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
            numerosSeleccionados.length * rifa.precio
          }&nom=${boleto.nombre.split(" ")[0]}&ape=${
            boleto.nombre.split(" ")[1]
          }&em=${boleto.mail}&cel=${boleto.celular}&com=Rifa ${
            rifa.nombre
          }\nNumeros Seleccionados: 
          ${numerosSeleccionados.map(
            (numero) => `${numero}, `
          )}`
        );
      }, 10000);
    } catch (error) {
      toast("Usuario o contraseña incorrecta", {
        type: "error",
      });
      setLoading(false);
      console.log(error.response.data);
    }
  };

  return (
    <>
      {rifa && (
        <div className="pt-5 px-5 max-w-4xl mx-auto">
          <div className="">
            <Details rifa={rifa} />
            <div
              className="h-1 my-5"
              style={{
                borderTop: "4px dotted #6adad7",
              }}
            ></div>
            <div
              className="rounded-lg block p-1 text-center"
              style={{
                border: "4px solid #6adad7",
              }}
            >
              <SelectorNumeros
                eliminarNumero={eliminarNumero}
                agregarNumero={agregarNumero}
                numerosSeleccionados={numerosSeleccionados}
                numerosComprados={rifa.boletosComprados}
                numerosTotales={rifa.numerosTotales}
              />
              <BoletosSeleccionados
                numerosSeleccionados={numerosSeleccionados}
                precio={rifa.precio}
              />

              {numerosSeleccionados.length > 0 && (
                <>
                  <FormularioDatos
                    boleto={boleto}
                    setBoleto={setBoleto}
                    pedido={pedido}
                    setPedido={setPedido}
                  />
                  <BoletosSeleccionados
                    numerosSeleccionados={numerosSeleccionados}
                    precio={rifa.precio}
                  />
                </>
              )}

              {numerosSeleccionados.length > 0 && boleto.valid ? (
                <div className="my-2">
                  <div className="">
                    <BotonDonativos onClick={pagarConDonativos} />
                    {/* <StripePayment
                      validarDatos={validarDatos}
                      garantizarBoletos={garantizarBoletos}
                      amount={parseFloat(
                        numerosSeleccionados.length * rifa.precio
                      )}
                    /> */}
                  </div>
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

      {!pagarConUsuario && (
        <div
          className="rounded-lg block m-5 p-2 text-center"
          style={{
            border: "4px solid #6adad7",
          }}
        >
          <ContactoEfectivo />
          <button
            className="text-white py-2 block rounded-lg w-full text-base"
            style={{
              backgroundColor: "#6adad7",
            }}
            onClick={() => setPagarConUsuario(!pagarConUsuario)}
          >
            Pagar con usuario
          </button>
        </div>
      )}
      {pagarConUsuario && (
        <div
          className="rounded-lg block m-5 p-2 text-center"
          style={{
            border: "4px solid #6adad7",
          }}
        >
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

      <ToastContainer />
    </>
  );
};

export default rifa;
