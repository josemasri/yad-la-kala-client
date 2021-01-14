import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import React from "react";

export const ContactoEfectivo = () => {
  return (
    <div className="text-center">
      <h4 className="font-bold">Para pago en efectivo comunicarse con:</h4>
      <ul className="font-normal border border-green-300 m-3 p-2 rounded">
        <li>
          Orly{" "}
          <a href="https://wa.me/+525620995100">
            <FontAwesomeIcon
              icon={faWhatsapp}
              className="text-green-700 mr-2"
            />{" "}
            +525620995100
          </a>{" "}
        </li>
        <li>
          Alice{" "}
          <a href="https://wa.me/+525530184940">
            <FontAwesomeIcon
              icon={faWhatsapp}
              className="text-green-700 mr-2"
            />
            +525530184940
          </a>{" "}
        </li>
      </ul>
    </div>
  );
};
