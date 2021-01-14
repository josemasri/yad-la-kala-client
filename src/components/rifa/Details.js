import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export const Details = ({ rifa }) => {
  return (
    <div
      className="rounded-lg block p-1 h-auto"
      style={{
        border: "4px solid #6adad7",
      }}
    >
      <img src={rifa.imagen} alt=""/>
    </div>
  );
};
