import React from "react";

export const BoletosSeleccionados = ({ numerosSeleccionados, precio }) => {
  return (
    <div className="p-2 text-sm font-normal">
      <p>
        Boletos(s) seleccionados:{" "}
        {numerosSeleccionados.map(
          (numero, i) =>
            `${numero}${i !== numerosSeleccionados.length - 1 ? ", " : ""}`
        )}
      </p>
      <p className="text-lg">
        Total:{" "}
        {new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
        }).format(numerosSeleccionados.length * precio)}{" "}
      </p>
    </div>
  );
};
