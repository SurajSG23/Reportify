/* eslint-disable */
import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";

const Header = ({
  handleLogout,
  creditsUsed,
  maxCredits,
  renewalDateFormatted,
}) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Assuming 768px as breakpoint for mobile

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full bg-gray-900 border-b border-gray-700 p-2">
      <div className="flex items-center justify-between mx-auto">
        <Link
          to="/homepage"
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300 transition-all duration-300"
        >
          <img src="Reportify-logo.png" alt="Logo" width={250} />
        </Link>

        {isMobile && (
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none focus:text-white"
            aria-label="Toggle menu"
          >
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        )}

        <div
          className={`${
            isMobile
              ? isMenuOpen
                ? "flex flex-col absolute top-12 right-4 w-65 text-center gap-2 bg-gray-900 border-b border-gray-700 py-4 z-20"
                : "hidden"
              : "flex items-center gap-4 h-[7vh]"
          } `}
        >
          <Link
            to={location.pathname === "/homepage" ? "/reports" : "/homepage"}
            className="group relative  border-1 border-white text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg overflow-hidden"
            onClick={() => isMobile && setIsMenuOpen(false)} // Close menu on link click
          >
            <span className="relative z-10 flex justify-center items-center gap-2">
              <span className="relative w-4 h-4 overflow-hidden">
                <svg
                  viewBox="0 0 14 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0 w-full h-full transition-transform duration-300 group-hover:translate-x-full group-hover:-translate-y-full"
                  width="14"
                >
                  <path
                    d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                    fill="currentColor"
                  />
                </svg>

                <svg
                  viewBox="0 0 14 15"
                  fill="none"
                  width="14"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0 w-full h-full transition-transform duration-300 -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0"
                >
                  <path
                    d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              {location.pathname === "/homepage" ? "My Reports" : "Home Page"}
            </span>
          </Link>

          {location.pathname === "/homepage" && (
            <div className="relative group">
              <div className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-md text-gray-300 hover:bg-gray-700 transition-all duration-300 cursor-pointer">
                Credits Left: {maxCredits - creditsUsed}
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-xs text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                  Credits will renew on{" "}
                  <span className="text-blue-400">{renewalDateFormatted}</span>{" "}
                  if exhausted.
                  <div className="absolute bottom-full left-1/2 transform rotate-180 translate-x-1/2 border-4 border-transparent border-t-gray-700"></div>
                </div>
              </div>
            </div>
          )}

          <button
            className={`${
              isMobile ? "w-fit mx-auto mt-4" : "max-[584px]:hidden"
            } hover:bg-red-700 text-white p-1 rounded-lg font-semibold text-[14px] transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-red-500 hover:border-red-400 cursor-pointer`}
            onClick={() => {
              handleLogout();
              isMobile && setIsMenuOpen(false);
            }}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;