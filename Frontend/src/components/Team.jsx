import { useEffect, useState } from "react";
import Header from "./Header";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import Footer from "./Footer";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";
import { axiosClient } from "../config/axiosClient";
import LoadingScreen from "./LoadingScreen";

const Team = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [msgSent, setMsgSent] = useState(false);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        const signOutPromise = axiosClient
          .get("/auth/logout", {
            withCredentials: true,
            headers: {
              Authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : '',
            },
          })
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
        console.error("Error signing out: ", error);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setMsgSent(true);

    const templateParams = {
      to_name: "Suraj S G",
      from_name: user ? user.displayName : "Anonymous",
      from_email: user ? user.email : "Anonymous@gmail.com",
      message: msg,
    };

    const templateParams2 = {
      to_name: "Vignesh D",
      from_name: templateParams.from_name,
      from_email: templateParams.from_email,
      message: msg,
    };

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAIL_JS_SERVICE_ID,
        import.meta.env.VITE_EMAIL_JS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAIL_JS_PUBLIC_KEY
      );

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID_1,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID_1,
        templateParams2,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY_1
      );

      toast.success("Feedback sent successfully!");
      setMsg("");
    } catch (error) {
      console.error("Error sending feedback: ", error);
      toast.error("Failed to send feedback. Please try again.");
    } finally {
      setMsgSent(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen fullScreen message="Loading team..." />;
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-[#191932] via-[#000000] to-[#0F172A] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-[-8%] h-[360px] w-[360px] rounded-full bg-cyan-700/20 blur-[120px]"></div>
        <div className="absolute top-[34%] right-[-8%] h-[310px] w-[310px] rounded-full bg-blue-700/20 blur-[110px]"></div>
      </div>

      <Header handleLogout={handleLogout} />

      <section className="relative mx-auto w-full max-w-7xl flex-1 px-5 pb-14 pt-8 sm:px-8 lg:px-12">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">About Us</p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Meet The Team</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
            The people behind REPORTIFY, building reliable AI-assisted report generation for students.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="group overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/55 p-4 shadow-[0_10px_24px_rgba(0,0,0,0.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_14px_28px_rgba(8,145,178,0.2)]">
            <div className="relative h-64 overflow-hidden rounded-xl bg-slate-950 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('vig2.png')" }}>
              <div className="absolute left-3 top-3 rounded-full border border-cyan-300/35 bg-black/50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-cyan-200">
                Backend
              </div>
            </div>

            <div className="px-2 pb-2 pt-4">
              <h2 className="text-xl font-semibold tracking-wide text-cyan-200 sm:text-2xl">VIGNESH D</h2>
              <p className="mt-1 text-sm text-slate-300">Student @ SJCE 26&apos;</p>

              <div className="mt-5 flex items-center gap-3">
                <a href="https://github.com/Vignesh9123" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-700 bg-slate-800/70 p-3 text-slate-200 transition-colors duration-300 hover:border-cyan-400/40 hover:text-cyan-200">
                  <FaGithub className="text-2xl" />
                </a>
                <a href="https://www.linkedin.com/in/vignesh-d-mys/" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-700 bg-slate-800/70 p-3 text-slate-200 transition-colors duration-300 hover:border-cyan-400/40 hover:text-cyan-200">
                  <FaLinkedin className="text-2xl" />
                </a>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=vignesh.d9123@gmail.com" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-700 bg-slate-800/70 p-3 text-slate-200 transition-colors duration-300 hover:border-cyan-400/40 hover:text-cyan-200">
                  <SiGmail className="text-2xl" />
                </a>
              </div>
            </div>
          </article>

          <article className="group overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/55 p-4 shadow-[0_10px_24px_rgba(0,0,0,0.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_14px_28px_rgba(8,145,178,0.2)]">
            <div className="relative h-64 overflow-hidden rounded-xl bg-slate-950 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('suraj2.png')" }}>
              <div className="absolute left-3 top-3 rounded-full border border-cyan-300/35 bg-black/50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-cyan-200">
                Frontend
              </div>
            </div>

            <div className="px-2 pb-2 pt-4">
              <h2 className="text-xl font-semibold tracking-wide text-cyan-200 sm:text-2xl">SURAJ S G DHANVA</h2>
              <p className="mt-1 text-sm text-slate-300">Student @ SJCE 26&apos;</p>

              <div className="mt-5 flex items-center gap-3">
                <a href="https://github.com/SurajSG23" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-700 bg-slate-800/70 p-3 text-slate-200 transition-colors duration-300 hover:border-cyan-400/40 hover:text-cyan-200">
                  <FaGithub className="text-2xl" />
                </a>
                <a href="https://www.linkedin.com/in/suraj-s-g-dhanva-995a23298/" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-700 bg-slate-800/70 p-3 text-slate-200 transition-colors duration-300 hover:border-cyan-400/40 hover:text-cyan-200">
                  <FaLinkedin className="text-2xl" />
                </a>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=surajsgd23@gmail.com" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-700 bg-slate-800/70 p-3 text-slate-200 transition-colors duration-300 hover:border-cyan-400/40 hover:text-cyan-200">
                  <SiGmail className="text-2xl" />
                </a>
              </div>
            </div>
          </article>
        </div>

        <section className="mt-10 rounded-2xl border border-slate-700/80 bg-slate-900/55 p-6 shadow-[0_10px_24px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:p-8">
          <div className="grid items-start gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
            <div className="text-center lg:pt-2 lg:text-left">
              <h2 className="text-2xl font-semibold tracking-wide text-cyan-200">We Value Your Feedback</h2>
              <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base lg:mx-0">
                Share suggestions, report issues, or tell us what worked well. Your feedback helps us improve REPORTIFY continuously.
              </p>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-5">
            <div>
              <label htmlFor="feedback" className="mb-2 block text-sm font-medium text-slate-100">
                Your Feedback *
              </label>
              <textarea
                id="feedback"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Tell us what you think... We're listening!"
                rows={6}
                className="w-full resize-none rounded-xl border border-slate-600 bg-slate-900/70 p-4 text-slate-100 placeholder-slate-400 transition-colors duration-300 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                required
              />
            </div>

            <div className="flex justify-center lg:justify-start">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(8,145,178,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(37,99,235,0.45)] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={msgSent}
              >
                {msgSent ? "Sending..." : "Submit Feedback"}
              </button>
            </div>
            </form>
          </div>
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default Team;
