import React, { useEffect } from "react";

import Link from "next/link";
import Navbar from "../components/reusable/Navbar";
import { useRouter } from "next/router";

const AgradecimientoPage = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/");
    }, 15000);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto">
        <div
          className=""
          style={{
            backgroundImage:
              "url(https://imagenes-yad.s3.us-east-2.amazonaws.com/thanks.png)",
            backgroundSize: "100% 100%",
            height: "90vh",
          }}
        ></div>
        <img
          className="w-full"
          src="https://imagenes-yad.s3.us-east-2.amazonaws.com/restricciones.png"
          alt=""
        />
      </div>
    </div>
  );
};

export default AgradecimientoPage;
