import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../config/axiosClient";
import { toast } from "react-toastify";
import LoadingScreen from "./LoadingScreen";

const About = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        const signOutPromise = axiosClient
          .get("/auth/logout")
          .then(() => {
            localStorage.removeItem("token");
            navigate("/");
          });
        toast.promise(signOutPromise, {
          pending: "Signing out...",
          success: "Signed out successfully!",
          error: "Failed to sign out. Please try again.",
        });
      })
      .catch((error) => {
        if (error.status === 429) {
          toast.error("Too Many Requests - please try again later");
          navigate("/");
        }
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) navigate("/");
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  if (loading) {
    return <LoadingScreen fullScreen message="Loading about page..." />;
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-[#191932] via-[#000000] to-[#0F172A] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-[-8%] h-[360px] w-[360px] rounded-full bg-cyan-700/20 blur-[120px]"></div>
        <div className="absolute top-[36%] right-[-8%] h-[310px] w-[310px] rounded-full bg-blue-700/20 blur-[110px]"></div>
      </div>

      <Header handleLogout={handleLogout} />

      <section className="relative mx-auto w-full max-w-7xl flex-1 px-5 pb-14 pt-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">About REPORTIFY</p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-5xl">Built to make academic reporting effortless</h1>
          <p className="mt-5 text-sm leading-relaxed text-slate-300 sm:text-lg">
            Welcome to <span className="font-semibold text-cyan-200">REPORTIFY</span>, your AI-powered solution for faster, cleaner,
            and more professional report generation. Designed for JSS STU students, REPORTIFY streamlines documentation
            with structured sections, better consistency, and practical submission-ready output so you can focus on learning and building.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <MetricCard label="Built For" value="JSS STU Students" />
          <MetricCard label="Output" value="Structured DOCX Reports" />
          <MetricCard label="Goal" value="Speed + Clarity + Consistency" />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="AI-Powered"
            desc="Generate structured, context-aware reports with AI in just seconds—no manual effort required."
          />
          <FeatureCard
            title="Accuracy & Clarity"
            desc="Ensure every report is professional, polished, and precise—ideal for academic or official use."
          />
          <FeatureCard
            title="Effortless Workflow"
            desc="Automate your reporting process end-to-end, saving time and boosting productivity."
          />
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-slate-700/80 bg-slate-900/55 p-6 text-center shadow-[0_10px_24px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:p-8">
          <h2 className="text-2xl font-semibold text-cyan-200">Why this project exists</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            Traditional report writing is repetitive and time-consuming. REPORTIFY reduces that overhead while maintaining
            structure and readability, so students can spend less time formatting and more time improving project quality.
          </p>
        </div>
      </section>

      <Footer handleLogout={handleLogout} />
    </main>
  );
};

const MetricCard = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-700/80 bg-slate-900/55 px-4 py-5 text-center shadow-[0_10px_24px_rgba(0,0,0,0.25)] backdrop-blur-sm">
    <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">{label}</p>
    <p className="mt-2 text-sm font-semibold text-slate-100 sm:text-base">{value}</p>
  </div>
);

const FeatureCard = ({ title, desc }) => (
  <div className="rounded-2xl border border-slate-700/80 bg-slate-900/55 p-6 shadow-[0_10px_24px_rgba(0,0,0,0.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_14px_28px_rgba(8,145,178,0.2)]">
    <h3 className="text-xl font-semibold text-cyan-200">{title}</h3>
    <p className="mt-3 text-sm leading-relaxed text-slate-300">{desc}</p>
  </div>
);

export default About;
