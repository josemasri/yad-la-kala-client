import { faCheck, faMask } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, useEffect } from "react";

export const SelectorNumeros = ({
  numerosTotales,
  numerosComprados,
  numeroSeleccionado,
  setNumeroSeleccionado,
}) => {
  return (
    <>
      <h5 className="mt-2 text-center">Escoge tu número</h5>
      <div className="grid grid-cols-5 gap-3 text-center h-52 overflow-scroll p-5 text-white">
        {Array.from({ length: numerosTotales }, (_, i) => i + 1).map(
          (numero) => (
            <Fragment key={numero}>
              {numerosComprados.includes(numero) ? (
                <button
                  disabled={true}
                  className="bg-gray-300 rounded-lg shadow-lg"
                  key={numero}
                >
                  {numero}
                </button>
              ) : (
                <>
                  {numeroSeleccionado === numero ? (
                    <button
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
                  ) : (
                    <button
                      style={{
                        backgroundColor: "#DC337D",
                      }}
                      className="rounded-lg shadow-lg"
                      key={numero}
                      onClick={() => setNumeroSeleccionado(numero)}
                    >
                      {numero}
                    </button>
                  )}
                </>
              )}
            </Fragment>
          )
        )}
      </div>
    </>
  );
};
