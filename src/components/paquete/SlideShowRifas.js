import styled from "@emotion/styled";
import React from "react";
import Link from "next/link";
import { Slide } from "react-slideshow-image";
import { SelectorNumeros } from "./SelectorNumeros";

const SlideshowRifas = ({
  rifas,
  boletosSeleccionados,
  agregarBoleto,
  eliminarBoleto,
  boletosComprados,
}) => {
  return (
    <div className="mx-auto">
      <Slide autoplay={false} defaultIndex={0} canSwipe={false}>
        {rifas.map((rifa) => (
          <div key={rifa.id} className="mx-auto">
            <div
              className="mx-auto"
              style={{
                backgroundImage: `url(${rifa.imagen})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%",
                height: "300px",
                width: "300px",
              }}
            ></div>
            <SelectorNumeros
              numerosSeleccionados={
                boletosSeleccionados.find(
                  (boletosSeleccionado) => boletosSeleccionado.rifa === rifa.id
                )?.numeros || []
              }
              agregarNumero={(numero) => agregarBoleto(numero, rifa.id)}
              eliminarNumero={(numero) => eliminarBoleto(numero, rifa.id)}
              numerosComprados={boletosComprados[rifa.id]}
              numerosTotales={rifa.numerosTotales}
            />
          </div>
        ))}
      </Slide>
    </div>
  );
};

export default SlideshowRifas;
