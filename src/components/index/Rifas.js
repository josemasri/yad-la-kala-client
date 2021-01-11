import React from "react";

export const RifasWellcome = ({ wellcomeRef }) => {
  return (
    <div
      ref={wellcomeRef}
      className="flex items-center justify-center"
      style={{
        backgroundImage: `url(https://apwpbsbly4myceibufb3bq-on.drv.tw/images/catalogo%20final.png)`,
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        height: "50vh",
        backgroundSize: "100% 100%",
      }}
    ></div>
  );
};
