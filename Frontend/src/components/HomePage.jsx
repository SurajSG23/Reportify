/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosClient } from "../config/axiosClient";
import { getSections } from "../constants";
import { requestWithRetry, isTransientError } from "../utils/retryRequest";
import LoadingScreen from "./LoadingScreen";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  GripVertical,
  Sparkles,
  BookOpen,
  Users,
} from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [flag2, setFlag2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [maxCredits, setMaxCredits] = useState(5);
  const [renewalDate, setRenewalDate] = useState(null);
  const [renewalDateFormatted, setRenewalDateFormatted] = useState("");
  const [flag, setFlag] = useState(false);
  const [downloadingDoc, setDownloadingDoc] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentSection, setCurrentSection] = useState("");
  const [num, setNum] = useState(0);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [warningVisible, setWarningVisible] = useState(true)
  useEffect(() => {
    const handleResize = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetchCurrentUser = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(
        "/auth/current-user"
      );
      setCurrentUser(response.data.data);

      setCreditsUsed(response.data.data.creditsUsed);
      setMaxCredits(response.data.data.maxCredits);

      const createdAt = new Date(response.data.data.creditsResetDate);

      const formattedRenewalDate = createdAt.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      setRenewalDate(createdAt);
      setRenewalDateFormatted(formattedRenewalDate);
    } catch (error) {
      if (error.status === 401) {
        toast.error("Session Expired - please login again");
        navigate("/");
      } else if (error.status === 429) {
        toast.error("Too Many Requests - please try again later");
        navigate("/");
      } else {
        toast.error("Something went wrong - please try again later");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  // Report Details
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [branch, setBranch] = useState("");
  const [sem, setSem] = useState("");
  const [professorName, setprofessorName] = useState("");
  const [designation, setDesignation] = useState("");
  const [description, setDescription] = useState("");

  // Student Information
  const [students, setStudents] = useState([
    { rollNumber: "", name: "", USN: "" },
  ]);
  const deleteStudentField = (idx) => {
    const updatedStudents = students.filter((_, i) => i !== idx);
    setStudents(updatedStudents);
  };
  const addStudentField = () => {
    if (students.length >= 10) {
      alert("Maximum 10 students allowed.");
      return;
    }
    setStudents([...students, { rollNumber: "", name: "", USN: "" }]);
  };

  // Report Sections
  const [sections, setSections] = useState([]);
  const [newSection, setNewSection] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const scrollContainerRef = useRef(null);
  const autoScrollSpeed = 10;
  const scrollIntervalRef = useRef(null);
  const addSection = () => {
    if (newSection.trim() !== "") {
      setSections([
        ...sections,
        {
          title: newSection,
          prompt: `Provide detailed content or information for the section titled \"${newSection}\" on topic: ${title}.`,
        },
      ]);
      setNewSection("");
    }
  };
  useEffect(() => {
    if (currentStep == 2) {
      const sections = getSections(title);
      setSections(sections);
    }
  }, [currentStep]);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.target.style.opacity = "0.6";
  };

  const handleDragEnd = (e) => {
    setDraggedIndex(null);
    e.target.style.opacity = "1";
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    console.log("Dragging over index:", index);

    const container = scrollContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const scrollThreshold = 60;

    const mouseY = e.clientY;
    const topTrigger = containerRect.top + scrollThreshold;
    const bottomTrigger = containerRect.bottom - scrollThreshold;

    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }

    if (mouseY < topTrigger && container.scrollTop > 0) {
      scrollIntervalRef.current = setInterval(() => {
        if (container.scrollTop > 0) {
          container.scrollTop = Math.max(
            0,
            container.scrollTop - autoScrollSpeed
          );
        } else {
          clearInterval(scrollIntervalRef.current);
          scrollIntervalRef.current = null;
        }
      }, 16);
    } else if (
      mouseY > bottomTrigger &&
      container.scrollTop < container.scrollHeight - container.clientHeight
    ) {
      scrollIntervalRef.current = setInterval(() => {
        if (
          container.scrollTop <
          container.scrollHeight - container.clientHeight
        ) {
          container.scrollTop = Math.min(
            container.scrollHeight - container.clientHeight,
            container.scrollTop + autoScrollSpeed
          );
        } else {
          clearInterval(scrollIntervalRef.current);
          scrollIntervalRef.current = null;
        }
      }, 16);
    }

    const newSections = [...sections];
    const draggedItem = newSections[draggedIndex];
    newSections.splice(draggedIndex, 1);
    newSections.splice(index, 0, draggedItem);

    setSections(newSections);
    setDraggedIndex(index);
  };

  const handleDelete = (index) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections);
  };

  const nextStep = () => {
    if (
      (!title ||
        !subject ||
        !subjectCode ||
        !branch ||
        !sem ||
        !professorName ||
        !designation ||
        !description) &&
      currentStep === 1
    ) {
      toast.info("Some fields are missing.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    if (currentStep === 2) {
      let flag = false;
      for (let i = 0; i < students.length; i++) {
        if (
          students[i].rollNumber === "" ||
          students[i].name === "" ||
          students[i].USN === ""
        ) {
          flag = true;
          break;
        }
      }
      if (flag || students.length === 0) {
        toast.info("Some fields are missing.", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }
    }
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const generateReport = async () => {
    if (
      !title ||
      !professorName ||
      !designation ||
      !branch ||
      !subject ||
      !subjectCode ||
      !sem ||
      students.length === 0 ||
      sections.length < 5
    ) {
      toast.info("Add atleast five sections", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    if (sections.length > 9) {
      toast.info("Maximum 9 sections allowed. Please remove some sections", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    setFlag2(false);
    setFlag(true);
    let content = "";
    const fallbackSections = [];
    const placeholderSections = [];

    for (const section of sections) {
      setNum((prevNum) => prevNum + 1);

      setCurrentSection(section.title);

      const payload = {
        title: section.title,
        promptContent: section.prompt,
        description: description,
        subject: subject,
        firstSection: section.title == sections[0].title,
        lastSection: section.title == sections[sections.length - 1].title,
      };

      const placeholderText = `\n\n## ${section.title}\n\nContent temporarily unavailable due to AI service issues. Please review this section manually.\n`;

      try {
        const response = await requestWithRetry({
          requestFn: ({ timeoutMs }) =>
            axiosClient.post("/content/generate", payload, {
              timeout: timeoutMs,
            }),
          maxRetries: 2,
          initialDelayMs: 1000,
          backoffMultiplier: 2,
          maxDelayMs: 4000,
          timeoutMs: 20000,
          fallbackFn: async (lastError) => {
            if (!isTransientError(lastError)) {
              throw lastError;
            }

            const simplePromptPayload = {
              ...payload,
              promptContent: `Write a concise section titled "${section.title}" for topic "${title}". Keep it clear and practical.`,
            };

            try {
              const fallbackResponse = await axiosClient.post(
                "/content/generate",
                simplePromptPayload,
                { timeout: 15000 }
              );
              fallbackSections.push(section.title);
              return fallbackResponse;
            } catch (_fallbackError) {
              placeholderSections.push(section.title);
              return {
                data: {
                  data: placeholderText,
                },
              };
            }
          },
        });

        content += response?.data?.data || placeholderText;
      } catch (error) {
        content += placeholderText;
        if (error?.status === 429 || error?.response?.status === 429) {
          toast.error("Too Many Requests - please try again later");
          navigate("/");
          return;
        }

        if (error?.status === 401 || error?.response?.status === 401) {
          toast.error("Session Expired - please login again");
          navigate("/");
          return;
        }

        toast.error(`Failed to generate section: ${section.title}`);
      }
    }

    if (fallbackSections.length > 0) {
      toast.warn(
        `Used simplified generation for ${fallbackSections.length} section(s).`
      );
    }

    if (placeholderSections.length > 0) {
      toast.warn(
        `Added placeholder text for ${placeholderSections.length} section(s) to continue report generation.`
      );
    }

    setNum(0);
    setFlag(false);
    setDownloadingDoc(true);
    const report = {
      topic: title,
      content: content,
      professorDetails: {
        name: professorName,
        designation: designation,
        department: branch,
        college: "JSS Science and Technology University",
        subject: subject,
        subjectCode: subjectCode,
        sem: sem,
      },
      submissionDetails: students,
    };

    try {
      const response = await axiosClient.post(
        "/report/generate",
        report,
        {
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${title}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      setFinalDetails(JSON.stringify(response.data, null, 2));
    } catch (error) {
      if (error.status === 429) {
        toast.error("Too Many Requests - please try again later");
        navigate("/");
      }
    } finally {
      setDownloadingDoc(false);
    }

    setTimeout(() => {
      window.location.reload();
    }, 800);
  };


  return (
    <>
      {warningVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-lg z-9">
          <div className="relative flex flex-col items-center p-6 bg-gray-900 text-white rounded-2xl shadow-xl">
            <div className="w-[90%] max-w-md rounded-xl border border-gray-800 bg-gray-900 p-8 text-center shadow-2xl">

              <button
                onClick={() => setWarningVisible(false)}
                aria-label="Close warning"
                className="absolute right-4 top-4 rounded-md p-1 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer"
              >
                ✕
              </button>

              <h2 className="mb-4 text-xl font-semibold text-yellow-400">
                ⚠️ Gemini API Overload
              </h2>

              <p className="mb-3 text-sm leading-relaxed text-zinc-300">
                The Gemini API is currently experiencing high load and intermittent issues.
              </p>

              <p className="mb-3 text-sm leading-relaxed text-zinc-300">
                You can generate the report, but some sections may be incomplete or show “content generation failed.” 
                Please review it after downloading.
              </p>

              <p className="mt-4 text-sm font-medium text-red-400">
                Please proceed with caution.
              </p>
            </div>
          </div>
        </div>
      )}
      {downloadingDoc && (
        <LoadingScreen message="Downloading your report..." />
      )}
      {loading && (
        <LoadingScreen message="Loading homepage..." />
      )}
      {flag && (
        <LoadingScreen
          message="Your report is being generated. Please wait."
          subMessage={`Generating ${currentSection}... (${num} / ${sections.length})`}
          className="px-3 sm:px-6"
        >
          <p className="text-center text-sm text-slate-300">
            Hang tight! Feel free to play a quick game while we work.
          </p>

          <div className="mt-3 flex w-full justify-center overflow-hidden">
            <iframe
              src="https://reportify-game.vercel.app/"
              className="h-[200px] w-full max-w-[600px] rounded-lg border-none bg-white sm:h-[250px]"
              title="Dino Jump Game"
            />
          </div>

          <p className="my-2 text-center text-xs text-slate-400">
            <span className="block sm:hidden">Tap the dino to start.</span>
            <span className="hidden sm:block">Tap the dino and press space to start.</span>
          </p>
        </LoadingScreen>
      )}

      {flag2 && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-lg z-9">
          <div className="bg-gray-900 text-white rounded-2xl shadow-2xl w-150 p-6 flex flex-col items-center">
            <h3 className="text-3xl  mb-2 font-bold">Important Notice</h3>
            <div className="bg-gray-900 text-white rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-2">
              <p className="text-gray-400 text-center text-lg bg-gray-800 py-2 px-1 rounded-lg">
                1. Generating this report will cost
                <span className="font-bold text-red-500"> 1 credit</span>. You{" "}
                <br /> have
                <span className="font-bold text-red-500">
                  {" "}
                  {maxCredits - creditsUsed}
                </span>
                {maxCredits - creditsUsed === 1
                  ? " credit remaining."
                  : " credits remaining."}
              </p>
              <p className="text-gray-400 text-center text-lg bg-gray-800 py-2 px-1 rounded-lg">
                2. This report is AI-generated and may contain errors. Please
                review it carefully before use.
              </p>
              <p className="text-gray-400 text-center text-lg bg-gray-800 py-2 px-1 rounded-lg">
                3. Once completed, the document will be downloaded
                automatically.
              </p>
            </div>

            <div className="flex justify-between gap-4 mt-5 w-full">
              <button
                onClick={() => {
                  setFlag2(false);
                }}
                className="w-1/2 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition cursor-pointer text-xl"
              >
                Cancel
              </button>
              <button
                onClick={generateReport}
                className="w-1/2 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition text-xl cursor-pointer"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
      <Header
        handleLogout={handleLogout}
        creditsUsed={creditsUsed}
        maxCredits={maxCredits}
        renewalDateFormatted={renewalDateFormatted}
      />
      <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#191932] via-[#000000] to-[#0F172A] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-[-10%] h-[300px] w-[300px] rounded-full bg-cyan-700/20 blur-[110px]"></div>
          <div className="absolute top-[35%] right-[-10%] h-[280px] w-[280px] rounded-full bg-blue-700/20 blur-[110px]"></div>
        </div>

        {/* Welcome Section */}
        <div className="px-4 pb-4 pt-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-4">
              <h1 className="text-balance bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text py-2 text-2xl font-semibold text-transparent sm:text-4xl md:text-5xl">
                {currentUser ? (
                  <>Hello {currentUser.name}! Welcome to Reportify</>
                ) : (
                  <>Welcome to Reportify!</>
                )}
              </h1>
              <p className="mx-auto max-w-2xl text-sm text-slate-300 sm:text-lg">
                Generate your report effortlessly in 3 simple steps.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mx-auto mb-6 max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 sm:h-11 sm:w-11 sm:text-base ${currentStep >= step
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                    : "bg-slate-700 text-slate-300"
                    }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`mx-1 h-0.5 w-8 rounded transition-all duration-300 sm:mx-2 sm:w-16 ${currentStep > step
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                      : "bg-slate-700"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-700/70 bg-slate-900/55 p-5 shadow-[0_10px_24px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:p-8">
            {creditsUsed >= maxCredits ? (
              <div className="flex items-center justify-center text-2xl h-full w-full p-4">
                <div className="text-center font-bold text-slate-300">
                  <span className="text-red-600">
                    Insufficient Credits.
                    <br />
                  </span>
                  All 5 credits have been used for this period.
                  <br />
                  Credits will be renewed on{" "}
                  <span className="text-blue-500">{renewalDateFormatted}</span>.
                </div>
              </div>
            ) : (
              <>
                {" "}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="mb-8 flex items-center gap-3">
                      <BookOpen className="h-7 w-7 text-cyan-300 sm:h-8 sm:w-8" />
                      <h2 className="text-2xl font-semibold sm:text-3xl">Report Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="mb-2 flex items-center gap-1 text-base font-medium text-slate-200 sm:text-lg">
                          Project Title <br />{" "}
                          <p className="text-xs text-slate-400 sm:text-sm">
                            (Displayed in the front page)
                          </p>
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="e.g., Reportify"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-base font-medium text-slate-200 sm:text-lg">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="e.g., Artificial Intelligence"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-base font-medium text-slate-200 sm:text-lg">
                          Subject Code
                        </label>
                        <input
                          type="text"
                          value={subjectCode}
                          onChange={(e) =>
                            setSubjectCode(e.target.value.toUpperCase())
                          }
                          className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="e.g., 22CS101"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-base font-medium text-slate-200 sm:text-lg">
                          Semester
                        </label>
                        <input
                          type="number"
                          list="sems"
                          min={1}
                          max={8}
                          value={sem}
                          onChange={(e) => setSem(e.target.value)}
                          className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="e.g., 6"
                        />
                        <datalist id="sems">
                          <option value="1" />
                          <option value="2" />
                          <option value="3" />
                          <option value="4" />
                          <option value="5" />
                          <option value="6" />
                          <option value="7" />
                          <option value="8" />
                        </datalist>
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-2 block text-base font-medium text-slate-200 sm:text-lg">
                          Branch
                        </label>

                        <input
                          type="text"
                          required
                          list="branches"
                          className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                          placeholder="e.g., Computer Science and Engineering"
                        />
                        <datalist id="branches">
                          <option value="Computer Science and Engineering" />
                          <option value="Electronics and Communication Engineering" />
                          <option value="Mechanical Engineering" />
                          <option value="Civil Engineering" />
                          <option value="Electrical and Electronics Engineering" />
                          <option value="Information Science and Engineering" />
                          <option value="Environmental Engineering" />
                          <option value="Polymer Science and Technology" />
                        </datalist>
                      </div>

                      <div>
                        <label className="mb-2 block text-base font-medium text-slate-200 sm:text-lg">
                          Professor Name
                        </label>
                        <input
                          type="text"
                          value={professorName}
                          onChange={(e) => setprofessorName(e.target.value)}
                          className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="Enter professor name"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-base font-medium text-slate-200 sm:text-lg">
                          Professor Designation
                        </label>
                        <input
                          type="text"
                          required
                          list="designations"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                            className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="e.g., Associate Professor"
                        />
                        <datalist id="designations">
                          <option value="Associate Professor" />
                          <option value="Assistant Professor" />
                        </datalist>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-base font-medium text-slate-200 sm:text-lg">
                        Describe your project
                      </label>

                      <textarea
                        rows={3}
                        cols={10}
                        maxLength={200}
                        required
                        className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g., AI-Powered Report Builder simplifies report creation by generating professional documents from user inputs using AI. It ensures speed, consistency, and minimal manual effort.
"
                      />
                    </div>

                    <div className="flex justify-end pt-6">
                      <button
                        onClick={nextStep}
                        className="group rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3 font-semibold text-white transition-all duration-300 hover:from-cyan-600 hover:to-blue-700 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          Next
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                      </button>
                    </div>
                  </div>
                )}
                {/* Step 2: Student Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="mb-8 flex items-center gap-3">
                      <Users className="h-7 w-7 text-cyan-300 sm:h-8 sm:w-8" />
                      <h2 className="text-2xl font-semibold sm:text-3xl">
                        Student Information
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {students.map((student, index) => (
                        <div
                          key={index}
                          className="rounded-2xl border border-slate-700/70 bg-slate-900/65 p-5 transition-all duration-200 hover:border-slate-500/70"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-cyan-300">
                              Student {index + 1}
                            </h3>
                            {students.length > 1 && (
                              <button
                                onClick={() => deleteStudentField(index)}
                                className="rounded-lg p-2 text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300 cursor-pointer"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="mb-2 block text-sm font-medium text-slate-300">
                                Roll Number
                              </label>
                              <input
                                type="number"
                                min={1}
                                value={student.rollNumber}
                                onChange={(e) => {
                                  const updatedStudents = [...students];
                                  updatedStudents[index].rollNumber =
                                    e.target.value;
                                  setStudents(updatedStudents);
                                }}
                                className="w-full rounded-lg border border-slate-600 bg-slate-800/70 px-4 py-3 text-slate-100 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="Enter roll number"
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-sm font-medium text-slate-300">
                                Name
                              </label>
                              <input
                                type="text"
                                value={student.name}
                                onChange={(e) => {
                                  const updatedStudents = [...students];
                                  updatedStudents[index].name = e.target.value;
                                  setStudents(updatedStudents);
                                }}
                                className="w-full rounded-lg border border-slate-600 bg-slate-800/70 px-4 py-3 text-slate-100 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="Enter student name"
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-sm font-medium text-slate-300">
                                USN
                              </label>
                              <input
                                type="text"
                                value={student.USN}
                                onChange={(e) => {
                                  const updatedStudents = [...students];
                                  updatedStudents[index].USN =
                                    e.target.value.toUpperCase();
                                  setStudents(updatedStudents);
                                }}
                                className="w-full rounded-lg border border-slate-600 bg-slate-800/70 px-4 py-3 text-slate-100 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="Enter USN"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={addStudentField}
                      className="w-full rounded-xl border border-emerald-400/35 bg-emerald-500/20 px-6 py-4 font-semibold text-emerald-100 transition-all duration-300 hover:bg-emerald-500/30 cursor-pointer"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add Student
                      </div>
                    </button>

                    <div className="flex justify-between pt-6">
                      <button
                        onClick={prevStep}
                        className="group rounded-xl border border-slate-600 bg-slate-700/80 px-7 py-3 font-semibold transition-all duration-300 hover:bg-slate-700 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                          Previous
                        </div>
                      </button>

                      <button
                        onClick={nextStep}
                        className="group rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3 font-semibold text-white transition-all duration-300 hover:from-cyan-600 hover:to-blue-700 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          Next
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                      </button>
                    </div>
                  </div>
                )}
                {/* Step 3: Report Sections */}
                {currentStep === 3 && (
                  <div className="space-y-6" ref={scrollContainerRef}>
                    <div className="mb-8 flex items-center gap-3">
                      <BookOpen className="h-7 w-7 text-cyan-300 sm:h-8 sm:w-8" />
                      <div>
                        <h2 className="text-2xl font-semibold sm:text-3xl">Report Sections</h2>
                        {innerWidth < 575 ? (
                          <p className="text-sm text-amber-300">
                            Click and hold to drag the sections, then rearrange
                            them as you like.
                          </p>
                        ) : (
                          <p className="text-amber-300">
                            Drag and rearrange the sections.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {sections.map((section, index) => (
                        <div
                          key={index}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleDragOver(e, index)}
                          className={`cursor-move rounded-xl border border-slate-700/70 bg-slate-900/65 p-4 transition-all duration-200 hover:border-slate-500/70 ${draggedIndex === index
                            ? "opacity-50 border-cyan-400"
                            : ""
                            }`}
                        >
                          <div className="flex items-center gap-4">
                            <GripVertical className="h-5 w-5 text-slate-400" />
                            <span className="flex-1 font-medium">
                              {index + 1}. {section.title}
                            </span>
                            <button
                              onClick={() => handleDelete(index)}
                              className="rounded-lg p-2 text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl border border-slate-700/70 bg-slate-900/65 p-4 sm:p-6">
                      <h3 className="mb-4 text-lg font-semibold text-cyan-300">
                        Add New Section
                      </h3>
                      <div className="flex gap-3 max-[400px]:gap-1">
                        <input
                          type="text"
                          value={newSection}
                          onChange={(e) => setNewSection(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addSection()}
                          className="flex-1 rounded-lg border border-slate-600 bg-slate-800/70 px-4 py-3 text-slate-100 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="Enter section title"
                        />
                        <button
                          onClick={addSection}
                          className="rounded-lg border border-slate-500 px-5 py-2 font-semibold transition-all max-[420px]:border-none max-[420px]:px-0 hover:border-cyan-400 cursor-pointer"
                        >
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between gap-6 pt-6">
                      <button
                        onClick={prevStep}
                        className="group rounded-xl border border-slate-600 bg-slate-700/80 px-8 py-3 font-semibold transition-all duration-300 hover:bg-slate-700 cursor-pointer max-[400px]:px-4"
                      >
                        <div className="flex items-center gap-2">
                          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                          Previous
                        </div>
                      </button>

                      <button
                        onClick={() => setFlag2(true)}
                        className="group rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 p-4 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:from-cyan-600 hover:to-blue-700 hover:shadow-cyan-500/25 cursor-pointer"
                      >
                        <div className="flex items-center gap-3 text-xl sm:text-2xl max-[542px]:text-[16px]">
                          <Sparkles className="h-7 w-7 transition-transform duration-300 group-hover:rotate-12 sm:h-8 sm:w-8 max-[542px]:h-6 max-[542px]:w-6 max-[400px]:h-8 max-[400px]:w-8" />
                          Generate Report
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
