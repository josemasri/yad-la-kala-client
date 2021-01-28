import Link from "next/link";
import React from "react";
import { Slide } from "react-slideshow-image";
import styled from "@emotion/styled";

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
                    height: "400px",
                  }}
                ></div>
              </a>
            </Link>
          </div>
        ))}
      </Slide>
    </div>
  );
};

export default SlideshowRifas;
