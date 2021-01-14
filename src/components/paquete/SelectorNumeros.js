import { faCheck, faMask } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment } from "react";

export const SelectorNumeros = ({
  numerosTotales = 200,
  numerosComprados = [1, 2],
  numerosSeleccionados = [5],
  agregarNumero,
  eliminarNumero,
}) => {
  return (
    <>
      <h5 className="mt-2 text-center">Escoge tu(s) boleto(s)</h5>
      <div className="grid grid-cols-5 gap-3 text-center h-52 overflow-scroll p-5 text-white">
        {Array.from({ length: numerosTotales }, (_, i) => i + 1).map(
          (numero) => (
            <Fragment key={numero}>
              {!numerosComprados.includes(numero) && (
                <>
                  {!numerosSeleccionados.includes(numero) && (
                    <button
                      style={{
                        backgroundColor: "#DC337D",
                      }}
                      className="rounded-lg shadow-lg"
                      key={numero}
                      onClick={() => agregarNumero(numero)}
                    >
                      {numero}
                    </button>
                  )}
                  {numerosSeleccionados.includes(numero) && (
                    <button
                      onClick={() => eliminarNumero(numero)}
                      style={{
                        backgroundImage: "url(images/pattern2.png)",
                        backgroundPosition: "center center",
                        backgroundSize: "cover",
                      }}
                      className="rounded-lg shadow-lg relative text-black border-2 border-red-500"
                      key={numero}
                    >
                      {numero}
                      <FontAwesomeIcon
                        className="absolute text-sm right-0 bottom-0"
                        icon={faMask}
                      />
                    </button>
                  )}
                </>
              )}
              {numerosComprados.includes(numero) && (
                <button
                  disabled={true}
                  className="bg-gray-300 rounded-lg shadow-lg"
                  key={numero}
                >
                  {numero}
                </button>
              )}
            </Fragment>
          )
        )}
      </div>
    </>
  );
};
