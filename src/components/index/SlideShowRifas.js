import styled from "@emotion/styled";
import React from "react";
import Link from "next/link";
import { Slide } from "react-slideshow-image";

const SlideshowRifas = ({ rifas }) => {
  return (
    <div className="mx-auto">
      <Slide>
        {rifas.map((rifa) => (
          <div key={rifa.id}>
            <Link href={`/rifa?id=${rifa.id}`}>
              <a>
                <div
                  style={{
                    backgroundImage: `url(${rifa.imagen})`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% 100%",
                    height: "40vh",
                  }}
                ></div>
              </a>
            </Link>
            <Link href={`/rifa?id=${rifa.id}`}>
              <a
                className="py-2 px-5 mt-2 block w-1/2 mx-auto text-center text-xl rounded font-semibold text-white shadow-lg"
                style={{
                  backgroundColor: "#6adad7",
                }}
              >
                Entrar a la rifa
              </a>
            </Link>
          </div>
        ))}
      </Slide>
    </div>
  );
};

export default SlideshowRifas;
