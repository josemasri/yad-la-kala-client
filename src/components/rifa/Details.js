import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export const Details = ({ rifa }) => {
  return (
    <div
      className="rounded-lg block p-1 h-56"
      style={{
        border: "4px solid #6adad7",
        backgroundImage: `url(${rifa.imagen})`,
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      }}
    ></div>
  );
};
