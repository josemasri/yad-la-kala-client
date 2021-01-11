import Link from "next/link";
import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import axiosClient from "../../helpers/axiosClient";

export const HotPot = () => {
  const [numeroActual, setNumeroActual] = useState(null);
  useEffect(() => {
    axiosClient
      .get("/hot-pots")
      .then((res) =>
        setNumeroActual((res.data[0].siguienteDisponible - 1) * 500 + 50000)
      );
  }, []);

  return (
    <Link href="/rifa-hot-pot" >
      <a>
        <div
          className="text-center py-5 mt-2 relative"
          style={{
            backgroundImage: "url(images/hot-pot.jpg)",
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
              backgroundColor: "#EFA1B9",
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
