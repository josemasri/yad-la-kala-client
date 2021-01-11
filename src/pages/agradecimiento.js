import Link from "next/link";
import React from "react";
import Navbar from "../components/reusable/Navbar";

const AgradecimientoPage = () => {
  return (
    <div>
      <Navbar />
      <div className="py-5 bg-green-300 px-5">
        <h1 className="text-center text-white font-bold text-3xl mt-10">
          You gave you won
        </h1>
        <p className="text-center text-white font-bold text-xl mt-10">
          Ya eres un ganador por el simple hecho de participar y ayudar a una
          novia hacer su sueño realidad.. GRACIAS!!!
        </p>
        <p className="text-center text-white font-bold mt-10">
          Recibiras un correo de confirmacion con tu donativo
        </p>
        <div className="flex items-center justify-center mt-5">

        <img className="text-center" src="/images/logo.png" alt=""/>
        </div>
      </div>
      <div className="">
        <Link href="/">
          <a className="bg-green-300 text-white rounded-lg mt-5 text-xl mx-auto py-2 px-2 font-bold flex w-1/2 text-center items-center justify-center">
            Inicio
          </a>
        </Link>
      </div>
    </div>
  );
};

export default AgradecimientoPage;
