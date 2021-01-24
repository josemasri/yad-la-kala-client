import React, { useState } from "react";

import Link from "next/link";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <nav
      className="w-full"
      style={{
        backgroundColor: "#6adad7",
      }}
    >
      <Link href="/">
        <a>
          <div className="w-full mx-auto py-2">        
                <div className="flex items-center justify-center ">
                  <img
                    className="text-center h-10 w-auto rounded-full"
                    src="/images/logo.png"
                    alt="Workflow"
                  />
              </div>
            </div>
        </a>
      </Link>
    </nav>
  );
};

export default Navbar;
