import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export function BotonDonativos({ onClick }) {
  const MySwal = withReactContent(Swal);

  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "#6adad7",
      }}
      className="rounded-lg w-full text-white font-bold flex items-center justify-around"
    >
      <span className="w-2/3">Pagar con donativos Inteligentes</span>
      <img className="w-1/3" src="/images/logo_donativos.png" alt="" />
    </button>
  );
}
