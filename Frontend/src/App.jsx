/* eslint-disable */
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

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

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userData = {
        idtoken: await user.getIdToken(),
      };
      const signInPromise = axios
        .post(
          "https://reportify-backend.vercel.app/api/auth/google-login",
          userData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
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
    <div className="min-h-screen w-full bg-gradient-to-b from-[#191932] via-[#000000] to-[#0F172A] text-white font-sans">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <section className="relative min-h-screen flex gap-20 justify-center items-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 w-full h-[100vh]">
          <div className="absolute top-[-15%] left-[-10%] w-[400px] h-[400px] bg-cyan-800 opacity-10 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-800 opacity-20 blur-[150px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <img
            src="favicon.png"
            alt="Logo"
            className="w-28 md:w-38 mx-auto mb-8 animate-fade-in-up"
          />

          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Welcome to REPORTIFY
          </h1>

          <h3 className="text-2xl md:text-3xl font-medium mb-8 text-cyan-200 animate-fade-in-up delay-100">
            An AI-driven Report Generator
          </h3>
          {/* <h3 className="text-2xl md:text-3xl font-medium mb-8 text-red-500 animate-fade-in-up delay-100">
            ⚠️Reportify is currently experiencing technical difficulties and has been temporarily closed. <br/> We are working to resolve the issue as quickly as possible.
          </h3> */}

          <div className="max-w-3xl mx-auto mb-12 text-lg md:text-xl text-gray-300 leading-relaxed animate-fade-in-up delay-200">
            <span className="font-medium text-gray-100">{text}</span>
            <Cursor cursorColor="#06B6D4" />
          </div>

          <div
            className="flex items-center justify-center"
            onClick={handleGoogleSignIn}
          >
            <div className="relative group">
              <button className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-10 transition-opacity duration-500 group-hover:opacity-100"></span>

                <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
                  <div className="relative z-10 flex items-center space-x-2">
                    <span className="transition-all duration-500 group-hover:translate-x-1">
                      Get started
                    </span>
                    <svg
                      className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
                      data-slot="icon"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clip-rule="evenodd"
                        d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                        fill-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-[90vh] h-auto flex items-center justify-center py-2 bg-gradient-to-t from-[#0F172A] via-[#1E293B] to-[#0F172A]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "1. Enter Project Details",
                description:
                  "Start by providing your project information. That's all we need to begin!",
              },
              {
                title: "2. Let AI Work",
                description:
                  "Our smart AI engine analyzes your title and generates a well-structured report in minutes.",
              },
              {
                title: "3. Download & Submit",
                description:
                  "Get your polished report, ready to be submitted—saving you time and effort!",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-gradient-to-b from-gray-900/50 to-gray-900/30 bg-black backdrop-blur-lg border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h3 className="relative text-2xl font-bold mb-4 text-cyan-300">
                  {step.title}
                </h3>
                <p className="relative text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
