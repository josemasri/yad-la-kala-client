import { ToastContainer, toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";

import { Contact } from "../components/contact/Contact";
import Footer from "../components/reusable/Footer";
import { HotPot } from "../components/index/HotPot";
import Navbar from "../components/reusable/Navbar";
import { RifasWellcome } from "../components/index/Rifas";
import SlideShowPaqutes from "../components/index/SlideShowPaqutes";
import SlideShowRifas from "../components/index/SlideShowRifas";
import axiosClient from "../helpers/axiosClient";

export default function Home() {
  const [rifas, setRifas] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  useEffect(() => {
    const getRifas = async () => {
      try {
        const res = await axiosClient.get("/rifas");
        const boletosComprados = await axiosClient.get("/boletosComprados");
        const rifas = res.data.map((rifa, i) => ({
          ...rifa,
          imgSoldout: `https://imagenes-yad.s3.us-east-2.amazonaws.com/rifa-${i+1}-s.png`,
          soldout: boletosComprados.data[rifa.id].length >= rifa.numerosTotales
        }));
        setRifas(rifas);
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
      <div className="max-w-md mx-auto">
        <RifasWellcome wellcomeRef={wellcomeRef} />
        <SlideShowPaqutes paquetes={paquetes} />
        <SlideShowRifas rifas={rifas} />
        <HotPot />
        <Contact />
        <ToastContainer />
      </div>
      <Footer />
    </div>
  );
}
