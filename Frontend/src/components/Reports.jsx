/*eslint-disable*/
import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosClient } from "../config/axiosClient";
import LoadingScreen from "./LoadingScreen";

const getStatusCode = (error) => error?.response?.status || error?.status;

const Reports = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showDeleteOneModal, setShowDeleteOneModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState("");

  const handleApiError = (error) => {
    const statusCode = getStatusCode(error);

    if (statusCode === 429) {
      toast.error("Too Many Requests - please try again later");
      navigate("/");
      return;
    }

    if (statusCode === 401) {
      toast.error("Session Expired - please login again");
      navigate("/");
      return;
    }

    toast.error("Something went wrong - please try again later");
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        const signOutPromise = axiosClient.get("/auth/logout").then(() => {
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
        handleApiError(error);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  useEffect(() => {
    const fetchAllReports = async () => {
      try {
        const response = await axiosClient.get("/report/get-all-reports");
        setReports(response.data.data || []);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllReports();
  }, []);

  const deleteReport = async (reportId) => {
    try {
      const response = await axiosClient.delete(`/report/delete?id=${reportId}`);
      if (response.data.success) {
        setReports((prevReports) =>
          prevReports.filter((report) => report._id !== reportId)
        );
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const deleteAllReports = async () => {
    try {
      const response = await axiosClient.delete("/report/delete-all-reports");
      if (response.data.success) {
        setReports([]);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const downloadReport = async (reportId, topic) => {
    try {
      const response = await axiosClient.get(`/report/get-report?id=${reportId}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${topic}.docx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      handleApiError(error);
    }
  };

  if (loading) {
    return <LoadingScreen fullScreen message="Loading reports..." />;
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-[#191932] via-[#000000] to-[#0F172A] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-[-8%] h-[360px] w-[360px] rounded-full bg-cyan-700/20 blur-[120px]"></div>
        <div className="absolute top-[30%] right-[-8%] h-[300px] w-[300px] rounded-full bg-blue-700/20 blur-[110px]"></div>
      </div>

      <Header handleLogout={handleLogout} />

      <section className="relative mx-auto w-full max-w-7xl flex-1 px-5 pb-14 pt-8 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">My Reports</h1>
            <p className="mt-2 text-sm text-slate-300 sm:text-base">
              Manage generated reports, download DOCX files, or remove old entries.
            </p>
          </div>

          {reports.length > 0 && (
            <button
              type="button"
              onClick={() => setShowDeleteAllModal(true)}
              className="inline-flex items-center justify-center rounded-xl border border-red-500/40 bg-red-500/15 px-4 py-2 text-sm font-medium text-red-200 transition-all duration-300 hover:border-red-400/70 hover:bg-red-500/20"
            >
              Delete All Reports
            </button>
          )}
        </div>

        {reports.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {reports.map((report) => (
              <article
                key={report._id}
                className="group rounded-2xl border border-slate-700/80 bg-slate-900/55 p-5 shadow-[0_10px_24px_rgba(0,0,0,0.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_14px_28px_rgba(8,145,178,0.2)]"
              >
                <h2 className="line-clamp-2 text-lg font-semibold text-cyan-200">{report.topic}</h2>

                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  <p>
                    Professor: <span className="font-medium text-slate-100">{report.professorDetails.name}</span>
                  </p>
                  <p>
                    Subject: <span className="font-medium text-slate-100">{report.professorDetails.subject}</span>
                  </p>
                  <p>
                    Subject Code: <span className="font-medium text-slate-100">{report.professorDetails.subjectCode}</span>
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => downloadReport(report._id, report.topic)}
                    className="flex-1 rounded-lg border border-cyan-500/40 bg-cyan-500/15 px-3 py-2 text-sm font-medium text-cyan-100 transition-colors duration-300 hover:bg-cyan-500/25"
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReportToDelete(report._id);
                      setShowDeleteOneModal(true);
                    }}
                    className="flex-1 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-200 transition-colors duration-300 hover:bg-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[52vh] items-center justify-center">
            <div className="max-w-xl rounded-2xl border border-slate-700/80 bg-slate-900/55 px-8 py-10 text-center backdrop-blur-sm">
              <h3 className="text-2xl font-semibold text-cyan-200">No Reports Yet</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                Generate your first report from the homepage and it will appear here for quick download and management.
              </p>
            </div>
          </div>
        )}
      </section>

      <Footer />

      {showDeleteOneModal && (
        <ConfirmModal
          title="Delete this report?"
          description="This report will be permanently removed and cannot be recovered."
          onCancel={() => setShowDeleteOneModal(false)}
          onConfirm={() => {
            deleteReport(reportToDelete);
            setShowDeleteOneModal(false);
          }}
          confirmLabel="Delete Report"
        />
      )}

      {showDeleteAllModal && (
        <ConfirmModal
          title="Delete all reports?"
          description="All generated reports will be permanently removed from your account."
          onCancel={() => setShowDeleteAllModal(false)}
          onConfirm={() => {
            deleteAllReports();
            setShowDeleteAllModal(false);
          }}
          confirmLabel="Delete All"
        />
      )}
    </main>
  );
};

const ConfirmModal = ({ title, description, onCancel, onConfirm, confirmLabel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/85 p-6 text-white shadow-2xl">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{description}</p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-600 bg-slate-800/80 px-4 py-2 text-sm font-medium text-slate-100 transition-colors duration-300 hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg border border-red-500/60 bg-red-500/20 px-4 py-2 text-sm font-medium text-red-100 transition-colors duration-300 hover:bg-red-500/30"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
