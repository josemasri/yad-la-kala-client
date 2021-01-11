import React from "react";

export const Inicio = ({ wellcomeRef }) => {
  return (
    <div
      className="mx-auto relative w-full flex flex-col items-center justify-center text-center"
      style={{
        height: " calc(100vh - 64px)",
        background: "url('images/background.png')",
        backgroundPosition: "center center",
        backgroundSize: "cover",
      }}
    >
      <h2 className="w-5/12 md:text-4xl" style={{ color: "#868686" }}>
        "You Give, You Win" <br></br> 
        Participa, gana y ayuda a una novia hacer su sueño
        realidad.
      </h2>
      <img
        className="block w-20 sm:w-28 md:w-40 lg:w-56"
        src="images/7.svg"
        alt=""
      />
      <button
        onClick={() =>
          wellcomeRef.current.scrollIntoView({ behavior: "smooth" })
        }
        className="rounded absolute px-4 md:px-8 py-2 md:py-4 md:text-xl font-bold"
        style={{
          border: "2px solid #69dbd8",
          bottom: "10%",
          right: "10%",
          backgroundColor: "#fff",
          color: "#868686",
        }}
      >
        Ver más
      </button>
    </div>
  );
};
