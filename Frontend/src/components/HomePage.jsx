/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getSections } from "../constants";
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
      const response = await axios.get(
        "https://reportify-backend.vercel.app/api/auth/current-user",
        {
          headers: {
            Authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : ''
          },
          withCredentials: true,
        }
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
        const signOutPromise = axios
          .get("https://reportify-backend.vercel.app/api/auth/logout", {
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

    for (const section of sections) {
      setNum((prevNum) => prevNum + 1);

      setCurrentSection(section.title);
      try {
        const response = await axios.post(
          "https://reportify-backend.vercel.app/api/content/generate",
          {
            title: section.title,
            promptContent: section.prompt,
            description: description,
            subject: subject,
            firstSection: section.title == sections[0].title,
            lastSection: section.title == sections[sections.length - 1].title,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : ''
            },
            withCredentials: true,
          }
        );
        content += response.data.data;
      } catch (error) {
        if (error.status === 429) {
          toast.error("Too Many Requests - please try again later");
          navigate("/");
        }
      }
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
      const response = await axios.post(
        "https://reportify-backend.vercel.app/api/report/generate",
        report,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : ''
          },
          withCredentials: true,
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
  // if (warningVisible) {
  //   return (
  //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

  //     </div>
  //   );
  // }


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
                You may proceed to generate the report, but results could be delayed,
                incomplete, or fail unexpectedly.
              </p>

              <p className="mt-4 text-sm font-medium text-red-400">
                Please proceed with caution.
              </p>
            </div>
          </div>
        </div>
      )}
      {downloadingDoc && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-lg z-9">
          <div className="flex flex-col items-center p-6 bg-gray-900 text-white rounded-2xl shadow-xl">
            <div className="w-10 h-10 border-4 border-t-transparent border-blue-400 rounded-full animate-spin"></div>
            <p className="mt-4 text-2xl font-medium text-gray-300 text-center">
              Downloading your report...
            </p>
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-lg z-9">
          <div className="flex flex-col items-center p-6 bg-gray-900 text-white rounded-2xl shadow-xl">
            <div className="w-10 h-10 border-4 border-t-transparent border-blue-400 rounded-full animate-spin"></div>
            <p className="mt-4 text-2xl font-medium text-gray-300 text-center">
              Loading Homepage...
            </p>
          </div>
        </div>
      )}
      {flag && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-lg z-9">
          <div className="flex flex-col items-center p-6 bg-gray-900 text-white rounded-2xl shadow-xl">
            <div className="w-10 h-10 border-4 border-t-transparent border-blue-400 rounded-full animate-spin"></div>
            <p className="mt-4 text-2xl font-medium text-gray-300 text-center">
              Your report is being generated. Please wait.
            </p>
            <span className="mt-2 text-md font-semibold text-blue-400 animate-pulse">
              Generating {currentSection}... ( {num} / {sections.length} )
            </span>
            <p className="text-sm text-gray-400 text-center mt-2">
              Hang tight! Feel free to play a quick game while we work.😀
            </p>

            <div className="w-full flex justify-center">
              <iframe
                src="https://reportify-game.vercel.app/"
                width="600"
                height="250"
                className="border-none rounded-lg bg-white"
                title="Dino Jump Game"
              />
            </div>

            <p className="text-xs text-gray-500 text-center">
              Tap the screen and press space to jump.
            </p>
          </div>
        </div>
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
      <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-black via-zinc-900 to-black text-white">
        {/* Welcome Section */}
        <div className="pb-2 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-4">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 py-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {currentUser ? (
                  <>Hello {currentUser.name}! Welcome to Reportify</>
                ) : (
                  <>Welcome to Reportify!</>
                )}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-4">
                Generate your report effortlessly in 3 simple steps.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto px-4 mb-8">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${currentStep >= step
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "bg-gray-700 text-gray-400"
                    }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 rounded transition-all duration-300 ${currentStep > step
                      ? "bg-gradient-to-r from-blue-500 to-purple-500"
                      : "bg-gray-700"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 pb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/50 p-8">
            {creditsUsed >= maxCredits ? (
              <div className="flex items-center justify-center text-2xl h-full w-full p-4">
                <div className="text-center text-gray-600 font-bold">
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
                    <div className="flex items-center gap-3 mb-8">
                      <BookOpen className="w-8 h-8 text-blue-400" />
                      <h2 className="text-3xl font-bold">Report Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center gap-1 text-lg font-medium text-gray-300 mb-2">
                          Project Title <br />{" "}
                          <p className="text-sm">
                            (Displayed in the front page)
                          </p>
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          placeholder="e.g., Reportify"
                        />
                      </div>

                      <div>
                        <label className="block text-lg font-medium text-gray-300 mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          placeholder="e.g., Artificial Intelligence"
                        />
                      </div>

                      <div>
                        <label className="block text-lg font-medium text-gray-300 mb-2">
                          Subject Code
                        </label>
                        <input
                          type="text"
                          value={subjectCode}
                          onChange={(e) =>
                            setSubjectCode(e.target.value.toUpperCase())
                          }
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          placeholder="e.g., 22CS101"
                        />
                      </div>

                      <div>
                        <label className="block text-lg font-medium text-gray-300 mb-2">
                          Semester
                        </label>
                        <input
                          type="number"
                          list="sems"
                          min={1}
                          max={8}
                          value={sem}
                          onChange={(e) => setSem(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
                        <label className="block text-lg font-medium text-gray-300 mb-2">
                          Branch
                        </label>

                        <input
                          type="text"
                          required
                          list="branches"
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
                        <label className="block text-lg font-medium text-gray-300 mb-2">
                          Professor Name
                        </label>
                        <input
                          type="text"
                          value={professorName}
                          onChange={(e) => setprofessorName(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          placeholder="Enter professor name"
                        />
                      </div>

                      <div>
                        <label className="block text-lg font-medium text-gray-300 mb-2">
                          Professor Designation
                        </label>
                        <input
                          type="text"
                          required
                          list="designations"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700/50 border
                    border-gray-600 rounded-xl focus:outline-none focus:ring-2
                    focus:ring-blue-500 transition-all duration-200"
                          placeholder="e.g., Associate Professor"
                        />
                        <datalist id="designations">
                          <option value="Associate Professor" />
                          <option value="Assistant Professor" />
                        </datalist>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-lg font-medium text-gray-300 mb-2">
                        Describe your project
                      </label>

                      <textarea
                        rows={3}
                        cols={10}
                        maxLength={200}
                        required
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g., AI-Powered Report Builder simplifies report creation by generating professional documents from user inputs using AI. It ensures speed, consistency, and minimal manual effort.
"
                      />
                    </div>

                    <div className="flex justify-end pt-6">
                      <button
                        onClick={nextStep}
                        className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer"
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
                    <div className="flex items-center gap-3 mb-8">
                      <Users className="w-8 h-8 text-blue-400" />
                      <h2 className="text-3xl font-bold">
                        Student Information
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {students.map((student, index) => (
                        <div
                          key={index}
                          className="bg-gray-700/30 border border-gray-600/50 rounded-2xl p-6 hover:bg-gray-700/50 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-blue-300">
                              Student {index + 1}
                            </h3>
                            {students.length > 1 && (
                              <button
                                onClick={() => deleteStudentField(index)}
                                className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/20 rounded-lg transition-all duration-200 cursor-pointer"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
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
                                className="w-full px-4 py-3 bg-gray-600/50 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                placeholder="Enter roll number"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
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
                                className="w-full px-4 py-3 bg-gray-600/50 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                placeholder="Enter student name"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
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
                                className="w-full px-4 py-3 bg-gray-600/50 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                placeholder="Enter USN"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={addStudentField}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add Student
                      </div>
                    </button>

                    <div className="flex justify-between pt-6">
                      <button
                        onClick={prevStep}
                        className="group bg-gray-600 hover:bg-gray-700 px-8 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                          Previous
                        </div>
                      </button>

                      <button
                        onClick={nextStep}
                        className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer"
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
                    <div className="flex items-center gap-3 mb-8">
                      <BookOpen className="w-8 h-8 text-blue-400" />
                      <div>
                        <h2 className="text-3xl font-bold">Report Sections</h2>
                        {innerWidth < 575 ? (
                          <p className="text-red-400 text-sm">
                            Click and hold to drag the sections, then rearrange
                            them as you like.
                          </p>
                        ) : (
                          <p className="text-red-400 ">
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
                          className={`bg-gray-700/30 border border-gray-600/50 rounded-xl p-4 transition-all duration-200 cursor-move hover:bg-gray-700/50 ${draggedIndex === index
                            ? "opacity-50 border-blue-400"
                            : ""
                            }`}
                        >
                          <div className="flex items-center gap-4">
                            <GripVertical className="w-5 h-5 text-gray-400" />
                            <span className="flex-1 font-medium">
                              {index + 1}. {section.title}
                            </span>
                            <button
                              onClick={() => handleDelete(index)}
                              className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gray-700/30 border border-gray-600/50 rounded-xl p-6 max-[400px]:p-2">
                      <h3 className="text-lg font-semibold mb-4 text-blue-300">
                        Add New Section
                      </h3>
                      <div className="flex gap-3 max-[400px]:gap-1">
                        <input
                          type="text"
                          value={newSection}
                          onChange={(e) => setNewSection(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addSection()}
                          className="flex-1 px-4 py-3 bg-gray-600/50 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 "
                          placeholder="Enter section title"
                        />
                        <button
                          onClick={addSection}
                          className="px-5 py-2 border-gray-500 border-1 rounded-lg font-semibold transition-all transform max-[420px]:border-none max-[420px]:px-0 hover:scale-105 cursor-pointer"
                        >
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between gap-6 pt-6">
                      <button
                        onClick={prevStep}
                        className="group bg-gray-600 hover:bg-gray-700 px-8 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer max-[400px]:px-4 "
                      >
                        <div className="flex items-center gap-2">
                          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                          Previous
                        </div>
                      </button>

                      <button
                        onClick={() => setFlag2(true)}
                        className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 cursor-pointer"
                      >
                        <div className="flex items-center gap-3 text-2xl max-[542px]:text-[16px]">
                          <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300 max-[542px]:w-6 max-[542px]:h-6 max-[400px]:w-8 max-[400px]:h-8" />
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
