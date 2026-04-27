import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-auto w-full border-t border-slate-700/70 bg-slate-950/75 text-white backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="text-center lg:text-left">
          <p className="text-sm text-slate-300 sm:text-base">
              &copy; {new Date().getFullYear()} Reportify-JSSSTU. All rights reserved.
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:justify-end">
          <Link
            to="/team"
            className="rounded-lg border border-slate-600 bg-slate-800/70 px-4 py-2 text-sm font-medium text-slate-200 transition-all duration-300 hover:border-cyan-400/40 hover:text-cyan-100"
          >
            Contact Us
          </Link>
          <Link
            to="/about"
            className="rounded-lg border border-slate-600 bg-slate-800/70 px-4 py-2 text-sm font-medium text-slate-200 transition-all duration-300 hover:border-cyan-400/40 hover:text-cyan-100"
          >
            About
          </Link>
          <a
            href="AI in Automobile Industry.docx"
            download
            className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800/70 px-4 py-2 text-sm font-medium text-slate-200 transition-all duration-300 hover:border-cyan-400/40 hover:text-cyan-100"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Sample Report
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;