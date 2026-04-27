import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../config/axiosClient";
import { toast } from "react-toastify";

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
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <div className="w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-white mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100vh] justify-between overflow-hidden bg-gradient-to-br from-black via-gray-800 to-gray-900">
      <Header handleLogout={handleLogout} />
      <div className=" text-white flex flex-col justify-center items-center py-10">
        <h2 className="text-4xl font-bold text-cyan-400 mb-4">About Us</h2>
        <p className="text-lg text-gray-300 max-w-2xl text-center">
          Welcome to{" "}
          <span className="text-cyan-300 font-semibold">REPORTIFY</span>, your
          AI-powered solution for effortless and professional report generation.
          Designed specifically for JSS STU students, our platform simplifies
          documentation for students and educators, ensuring time efficiency,
          accuracy, and structured formatting. Transform your ideas into
          well-organized reports instantly and focus on what truly matters.
        </p>

        <div className="flex flex-wrap justify-center items-center sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 w-full cursor-pointer">
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
      </div>
      <Footer handleLogout={handleLogout} />
    </div>
  );
};

const FeatureCard = ({ title, desc }) => (
  <div className="bg-gray-900 h-auto py-8 px-10 rounded-xl shadow-lg border border-gray-700 hover:scale-105 transition-transform duration-300">
    <h3 className="text-xl font-semibold text-cyan-300 mb-2">{title}</h3>
    <p className="text-gray-400 w-64">{desc}</p>
  </div>
);

export default About;
