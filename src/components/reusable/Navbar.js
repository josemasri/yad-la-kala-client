import React, { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <nav
      style={{
        backgroundColor: "#6adad7",
      }}
    >
      <Link href="/">
        <a>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <img
                    className="block lg:hidden h-10 w-auto rounded-full"
                    src="/images/logo.png"
                    alt="Workflow"
                  />

                  <img
                    className="hidden lg:block h-10 w-auto"
                    src="/images/logo.png"
                    alt="Workflow"
                  />
                </div>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </nav>
  );
};

export default Navbar;
