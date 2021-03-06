import React, { useState, useEffect } from "react";
import axiosClient from "../../helpers/axiosClient";
import { SelectorNumeros } from "./SelectorNumeros";

export const RifaPaqueteRestriccion = ({
  rifas,
  boletoState,
  setBoletos,
  precioBoletos,
}) => {
  const [rifa, setRifa] = useState(null);
  const [numeroSeleccionado, setNumeroSeleccionado] = useState(null);

  const getRifa = async () => {
    const res = await axiosClient.get(`/rifas/${boletoState.rifa}`);
    setRifa(res.data);
  };
  
  useEffect(() => {
    getRifa();
  }, []);

  useEffect(() => {
    setBoletos((boletos) => {
      return {
        ...boletos,
        [precioBoletos]: [
          ...boletos[precioBoletos].filter(
            (item) => item.id !== boletoState.id
          ),
          {
            ...boletos[precioBoletos].find(
              (item2) => item2.id === boletoState.id
            ),
            boleto: numeroSeleccionado,
          },
        ]
          .concat()
          .sort((a, b) => a.idx - b.idx),
      };
    });
  }, [numeroSeleccionado]);

  return (
    <div className="border-4 border-green-300 mt-2 p-1 rounded-lg">
      {rifa ? (
        <>
          <img src={rifa.imagen} alt="" />
          <SelectorNumeros
            numeroSeleccionado={numeroSeleccionado}
            setNumeroSeleccionado={setNumeroSeleccionado}
            numerosComprados={rifa.boletosComprados}
            numerosTotales={rifa.numerosTotales}
          />
        </>
      ) : (
        <p>Cargando</p>
      )}
    </div>
  );
};
