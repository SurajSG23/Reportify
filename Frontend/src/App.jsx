/* eslint-disable */
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosClient } from "./config/axiosClient";

const provider = new GoogleAuthProvider();
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

export default function App() {
  const [text] = useTypewriter({
    words: [
      "Effortlessly generate AI-powered college reports for JSS STU students with just a title.",
      "Save time, enhance accuracy, and streamline your documentation process in seconds!",
      "Transform your ideas into well-structured reports instantly.",
      "Ensure clarity, professionalism, and efficiency all at your fingertips.",
      "Unlock the power of AI for smoother report generation.",
      "Spend less time writing and more time focusing on what matters.",
      "Get accurate and professional reports, instantly.",
      "Your ideas, transformed into polished documents, in seconds.",
    ],
    loop: true,
    typeSpeed: 70,
    deleteSpeed: 30,
  });

  const navigate = useNavigate();

  const statCards = [
    { value: "2 min", label: "Average first draft time" },
    { value: "9", label: "Structured sections supported" },
    { value: "100%", label: "Academic-ready DOCX output" },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Set Report Context",
      description:
        "Choose your topic, academic details, and student inputs to frame the report precisely.",
    },
    {
      step: "02",
      title: "Generate Smart Sections",
      description:
        "AI builds coherent sections with technical flow, clarity, and submission-focused structure.",
    },
    {
      step: "03",
      title: "Download Instantly",
      description:
        "Export polished report output as DOCX and submit directly without manual formatting work.",
    },
  ];

  const highlightCards = [
    {
      title: "Context-Aware Content",
      description:
        "Sections stay aligned with your subject and project scope instead of generic filler text.",
    },
    {
      title: "Built for Submission",
      description:
        "From heading flow to section quality, the output is tuned for practical academic use.",
    },
    {
      title: "Faster Iteration",
      description:
        "Update topic or sections and regenerate in moments to refine your report quickly.",
    },
  ];

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userData = {
        idtoken: await user.getIdToken(),
      };
      const signInPromise = axiosClient
        .post(
          "/auth/google-login",
          userData
        )
        .then((response) => {
          localStorage.setItem("token", response.data.data.token);
          navigate("/homepage");
        });

      toast.promise(signInPromise, {
        pending: "Signing in...",
        success: "Signed in successfully!",
        error: "Failed to sign in. Please try again.",
      });
    } catch (error) {
      if (error.status === 429) {
        toast.error("Too Many Requests - please try again later");
        navigate("/");
      }
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#191932] via-[#000000] to-[#0F172A] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-24 h-[520px] w-[520px] rounded-full bg-cyan-700/20 blur-[120px]"></div>
        <div className="absolute top-[20%] -right-24 h-[440px] w-[440px] rounded-full bg-blue-700/20 blur-[120px]"></div>
        <div className="absolute bottom-0 left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-slate-600/20 blur-[120px]"></div>
      </div>

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-5 pb-14 pt-10 sm:px-8 lg:px-12">
        
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="flex w-full items-center gap-3 sm:gap-5">
              <img
                src="favicon.png"
                alt="Reportify logo"
                className="h-14 w-14 shrink-0 rounded-xl border border-cyan-200/20 bg-slate-900/60 p-2.5 shadow-[0_14px_35px_rgba(0,0,0,0.45)] sm:h-16 sm:w-16 sm:rounded-2xl sm:p-3"
              />
              <h1 className="text-balance text-2xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                Welcome to REPORTIFY
              </h1>
            </div>

            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300 sm:text-xl">
              <span className="text-slate-100">{text}</span>
              <Cursor cursorColor="#67E8F9" />
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3 text-xl font-semibold text-white shadow-[0_12px_30px_rgba(8,145,178,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(37,99,235,0.45)]"
              >
                Get Started
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>

            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {statCards.map((card) => (
                <article
                  key={card.label}
                  className="rounded-2xl border border-slate-700/70 bg-slate-900/55 px-4 py-5 shadow-[0_10px_24px_rgba(0,0,0,0.25)]"
                >
                  <p className="text-2xl font-semibold text-cyan-300">{card.value}</p>
                  <p className="mt-1 text-sm text-slate-300">{card.label}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="relative rounded-3xl border border-slate-700/70 bg-slate-900/60 p-6 backdrop-blur-md">
            <div className="absolute -top-14 right-6 h-28 w-28 rounded-full bg-cyan-500/20 blur-2xl"></div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">Preview</p>
            <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
              Structured. Fast. Submission-ready.
            </h2>

            <div className="mt-6 space-y-4">
              {highlightCards.map((item) => (
                <article
                  key={item.title}
                  className="rounded-xl border border-slate-700/80 bg-black/25 p-4 transition-all duration-300 hover:border-cyan-400/40"
                >
                  <h3 className="text-lg font-semibold text-cyan-200">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-300">{item.description}</p>
                </article>
              ))}
            </div>

          </aside>
        </div>
      </section>

      <section id="workflow" className="relative border-t border-slate-800/80 bg-[#0C111F]/75 py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-semibold text-white sm:text-5xl">How It Works</h2>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              A clean 3-step pipeline designed for speed and predictable report quality.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {workflowSteps.map((step) => (
              <article
                key={step.step}
                className="group relative overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-b from-slate-900/85 to-slate-950/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_14px_28px_rgba(8,145,178,0.2)]"
              >
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-cyan-500/10 blur-xl transition-all duration-300 group-hover:bg-cyan-400/20"></div>
                <p className="text-sm font-medium tracking-[0.2em] text-cyan-300/80">{step.step}</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{step.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
