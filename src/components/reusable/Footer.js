import React, { useState } from "react";

import Link from "next/link";

const Footer = () => {
  return (
    <footer
      className="w-full"
      style={{
        backgroundColor: "#6adad7",
      }}
    >
      <div className="w-full mx-auto py-2 max-w-md flex justify-around items-center">
        <p className="text-white">Desarrollado por Jose Masri</p>
        <a className="text-white" href="tel:+525563192945">
          563192945
        </a>
      </div>
    </footer>
  );
};

export default Footer;
