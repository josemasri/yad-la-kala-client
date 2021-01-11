import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Contact } from "../components/contact/Contact";
import { RifasWellcome } from "../components/index/Rifas";
import SlideShowRifas from "../components/index/SlideShowRifas";
import SlideShowPaqutes from "../components/index/SlideShowPaqutes";

import { Inicio } from "../components/inicio/Inicio";
import Navbar from "../components/reusable/Navbar";
import axiosClient from "../helpers/axiosClient";
import { HotPot } from "../components/index/HotPot";

export default function Home() {
  const [rifas, setRifas] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  useEffect(() => {
    const getRifas = async () => {
      try {
        const res = await axiosClient.get("/rifas");
        setRifas(res.data);
      } catch (error) {
        toast("Ha ocurrido un error al cargar las rifas", {
          type: "error",
        });
      }
    };
    const getPaquetes = async () => {
      try {
        const res = await axiosClient.get("/paquete-boletos");
        setPaquetes(res.data);
      } catch (error) {
        toast("Ha ocurrido un error al cargar los paquetes", {
          type: "error",
        });
      }
    };

    getRifas();
    getPaquetes();
  }, []);
  const wellcomeRef = useRef(null);
  return (
    <div>
      <Navbar />
      {/* <Inicio wellcomeRef={wellcomeRef} /> */}
      <RifasWellcome wellcomeRef={wellcomeRef} />
      <SlideShowPaqutes paquetes={paquetes} />
      <SlideShowRifas rifas={rifas} />
      <HotPot />
      <Contact />
      <ToastContainer />
    </div>
  );
}
