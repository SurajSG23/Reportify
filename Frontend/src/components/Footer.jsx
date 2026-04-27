import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white border-t border-gray-800 mt-auto">
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="text-center lg:text-left">
            <p className="text-gray-400 text-lg">
              &copy; {new Date().getFullYear()} Reportify-JSSSTU. All rights reserved.
            </p>
          </div>

          <nav className="flex flex-wrap justify-center lg:justify-end gap-8">
            <Link 
              to="/team" 
              className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline underline-offset-4 decoration-2 decoration-blue-500"
            >
              Contact Us
            </Link>
            <Link 
              to="/about" 
              className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline underline-offset-4 decoration-2 decoration-blue-500"
            >
              About
            </Link>
            <a 
              href="AI in Automobile Industry.docx" 
              download
              className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline underline-offset-4 decoration-2 decoration-blue-500 flex items-center"
            >
              <svg 
                className="w-4 h-4" 
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
      </div>

      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm -z-10"></div>
    </footer>
  );
};

export default Footer;