import styled from "@emotion/styled";
import React from "react";
import Link from "next/link";
import { Slide } from "react-slideshow-image";

const SlideShowPaquetes = ({ paquetes }) => {
  return (
    <div className="mx-auto">
      <Slide
        duration={10000}
      >
        {paquetes.map((paquete) => (
          <div key={paquete.id}>
            <Link href={`/paquete2?id=${paquete.id}`}>
              <a>
                <div
                  style={{
                    backgroundImage: `url(${paquete.imagen})`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% 100%",
                    height: "400px",
                  }}
                ></div>
              </a>
            </Link>
            <Link href={`/paquete2?id=${paquete.id}`}>
              <a
                className="py-2 px-5 block my-2 w-1/2 mx-auto text-center text-xl rounded font-semibold text-white shadow-lg"
                style={{
                  backgroundColor: "#6adad7",
                }}
              >
                Ver Paquete
              </a>
            </Link>
          </div>
        ))}
      </Slide>
    </div>
  );
};

export default SlideShowPaquetes;
