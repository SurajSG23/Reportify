import React from "react";

const LoadingScreen = ({
  message = "Loading...",
  subMessage,
  fullScreen = false,
  className = "",
  children,
}) => {
  const containerClass = fullScreen
    ? "flex min-h-screen items-center justify-center bg-gradient-to-b from-[#191932] via-[#000000] to-[#0F172A] text-white"
    : "fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-lg";

  return (
    <div className={`${containerClass} ${className}`.trim()}>
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/85 p-6 text-white shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-300/30 border-t-cyan-300"></div>
          <p className="mt-4 text-lg font-semibold text-slate-100 sm:text-xl">{message}</p>
          {subMessage ? (
            <p className="mt-2 text-sm text-slate-300 sm:text-base">{subMessage}</p>
          ) : null}
        </div>

        {children ? <div className="mt-5">{children}</div> : null}
      </div>
    </div>
  );
};

export default LoadingScreen;
