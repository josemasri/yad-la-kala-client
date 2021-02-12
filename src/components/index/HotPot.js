import React, { useEffect, useState } from "react";

import CountUp from "react-countup";
import Link from "next/link";
import axiosClient from "../../helpers/axiosClient";

export const HotPot = () => {
  const [numeroActual, setNumeroActual] = useState(null);
  useEffect(() => {
    axiosClient
      .get("/hot-pots")
      .then((res) =>
        setNumeroActual(296000)
      );
  }, []);

  return (
    <Link href="/rifa-hot-pot" >
      <a>
        <div
          className="text-center py-5 mt-2 relative"
          style={{
            backgroundImage: "url(https://imagenes-yad.s3.us-east-2.amazonaws.com/hot-pot.png)",
            backgroundSize: "100% 100%",
            height: "400px",
          }}
        >
          <p
            className="text-3xl font-bold mb-5 px-1 absolute mx-auto"
            style={{
              bottom: "90px",
              left: "50%",
              transform: "translate(-50%, 0)",
            }}
          >
            {numeroActual && (
              <CountUp start={0} prefix="$ " separator="," end={numeroActual} />
            )}
          </p>
        </div>
      </a>
    </Link>
  );
};
