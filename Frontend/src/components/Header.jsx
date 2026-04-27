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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const pageSwitchLabel =
    location.pathname === "/homepage" ? "My Reports" : "Home Page";

  return (
    <header className="relative z-40 border-b border-slate-700/70 bg-slate-950/75 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/homepage"
          className="rounded-lg border border-transparent transition-all duration-300 hover:border-slate-700/60 hover:bg-slate-900/60"
        >
          <img src="Reportify-logo.png" alt="Logo" className="h-12 w-auto sm:h-14" />
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to={location.pathname === "/homepage" ? "/reports" : "/homepage"}
            className="rounded-lg border border-slate-500/70 bg-slate-800/60 px-4 py-2 text-sm font-medium text-slate-100 transition-all duration-300 hover:border-cyan-400/50 hover:text-cyan-100"
          >
            {pageSwitchLabel}
          </Link>

          {location.pathname === "/homepage" && (
            <div className="relative group">
              <div className="rounded-lg border border-slate-600 bg-slate-800/70 px-4 py-2 text-sm font-medium text-slate-200 transition-all duration-300 hover:border-cyan-400/40 hover:text-cyan-100">
                Credits Left: {maxCredits - creditsUsed}
                <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-xs text-slate-300 opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
                  Credits will renew on{" "}
                  <span className="text-cyan-300">{renewalDateFormatted}</span>{" "}
                  if exhausted.
                </div>
              </div>
            </div>
          )}

          <button
            className="rounded-lg border border-red-500/60 bg-red-500/15 px-3 py-2 text-sm font-semibold text-red-100 transition-all duration-300 hover:border-red-400 hover:bg-red-500/25"
            onClick={() => {
              handleLogout();
            }}
          >
            Log Out
          </button>
        </div>

        <button
          onClick={toggleMenu}
          className="rounded-lg border border-slate-600 bg-slate-900/60 p-2 text-white transition-colors duration-300 hover:border-cyan-400/40 md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            className="h-7 w-7"
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
      </div>

      {isMenuOpen && (
        <div className="border-t border-slate-700/70 bg-slate-950/95 px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            <Link
              to={location.pathname === "/homepage" ? "/reports" : "/homepage"}
              className="rounded-lg border border-slate-600 bg-slate-800/70 px-4 py-2 text-center text-sm font-medium text-slate-100"
              onClick={() => setIsMenuOpen(false)}
            >
              {pageSwitchLabel}
            </Link>

            {location.pathname === "/homepage" && (
              <div className="rounded-lg border border-slate-600 bg-slate-800/70 px-4 py-2 text-center text-sm text-slate-200">
                Credits Left: {maxCredits - creditsUsed}
                <p className="mt-1 text-xs text-slate-400">
                  Renews on <span className="text-cyan-300">{renewalDateFormatted}</span>
                </p>
              </div>
            )}

            <button
              className="rounded-lg border border-red-500/60 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-100"
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;