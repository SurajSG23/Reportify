/*eslint-disable*/
import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import styled, { keyframes } from "styled-components";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosClient } from "../config/axiosClient";

const Reports = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [event, setEvent] = useState(false);
  const [event2, setEvent2] = useState(false);
  const [reportDlt, setReportDlt] = useState("");

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

  useEffect(() => {
    fetchAllReports();
  }, []);

  const fetchAllReports = async () => {
    try {
      const response = await axiosClient.get(
        "/report/get-all-reports",
      );
      setReports(response.data.data || []);
    } catch (error) {
      if (error.status === 429) {
        toast.error("Too Many Requests - please try again later");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (reportId) => {
    try {
      const response = await axiosClient.delete(
        `/report/delete?id=${reportId}`
      );
      if (response.data.success) {
        setReports(reports.filter((report) => report._id !== reportId));
      }
    } catch (error) {
      if (error.status === 429) {
        toast.error("Too Many Requests - please try again later");
        navigate("/");
      }
    }
  };

  const deleteAllReports = async () => {
    try {
      const response = await axiosClient.delete(
        "/report/delete-all-reports"
      );
      if (response.data.success) {
        setReports([]);
      }
    } catch (error) {
      if (error.status === 429) {
        toast.error("Too Many Requests - please try again later");
        navigate("/");
      }
    }
  };

  const downloadReport = async (reportId, topic) => {
    try {
      const response = await axiosClient.get(
        `/report/get-report?id=${reportId}`,
        {
          responseType: "blob"
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${topic}.docx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error.status === 429) {
        toast.error("Too Many Requests - please try again later");
        navigate("/");
      }
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
        <p>Loading...</p>
      </LoadingContainer>
    );
  }

  return (
    <MainContainer>
      <div className="flex flex-col min-h-[100vh] justify-between overflow-hidden bg-gradient-to-br from-black via-gray-800 to-gray-900">
        <Header handleLogout={handleLogout} />
        <div className="body">
          {reports.length > 0 ? (
            <>
              <ReportList>
                {reports.map((report) => (
                  <ReportCard key={report._id}>
                    <h3 className="font-bold text-md text-emerald-800">
                      {report.topic}
                    </h3>
                    <p>
                      Professor: <b>{report.professorDetails.name}</b>{" "}
                    </p>
                    <p>Subject: {report.professorDetails.subject}</p>
                    <p>
                      Subject Code: <b>{report.professorDetails.subjectCode}</b>
                    </p>
                    <ButtonGroup>
                      <DownloadButton
                        onClick={() => downloadReport(report._id, report.topic)}
                      >
                        Download
                      </DownloadButton>
                      <DeleteButton
                        onClick={() => {
                          setReportDlt(report._id);
                          setEvent2(!event2);
                        }}
                      >
                        Delete
                      </DeleteButton>
                    </ButtonGroup>
                  </ReportCard>
                ))}
              </ReportList>
              <DeleteAllButton onClick={() => setEvent(!event)}>
                Delete All Reports
              </DeleteAllButton>
              {event2 ? (
                <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-md">
                  <div className="min-w-[30vw] h-[38vh] border border-gray-700 bg-black bg-opacity-70 backdrop-blur-lg text-white flex flex-col justify-center items-center rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">
                      Are you sure?
                    </h2>
                    <p className="text-gray-300 text-center mb-6">
                      This action will permanently delete <br /> this reports
                      and cannot be undone.
                    </p>
                    <div className="flex justify-center items-center space-x-4">
                      <button
                        className="bg-gray-700 hover:bg-gray-600 transition-all px-5 py-2 rounded-md text-white font-medium cursor-pointer"
                        onClick={() => setEvent2(!event2)}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-500 transition-all px-5 py-2 rounded-md text-white font-medium cursor-pointer"
                        onClick={() => {
                          deleteReport(reportDlt);
                          setEvent2(!event2);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {event ? (
                <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-md">
                  <div className="min-w-[30vw] h-[38vh] border border-gray-700 bg-black bg-opacity-70 backdrop-blur-lg text-white flex flex-col justify-center items-center rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">
                      Are you sure?
                    </h2>
                    <p className="text-gray-300 text-center mb-6">
                      This action will permanently delete <br /> all reports and
                      cannot be undone.
                    </p>
                    <div className="flex justify-center items-center space-x-4">
                      <button
                        className="bg-gray-700 hover:bg-gray-600 transition-all px-5 py-2 rounded-md text-white font-medium cursor-pointer"
                        onClick={() => setEvent(!event)}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-500 transition-all px-5 py-2 rounded-md text-white font-medium cursor-pointer"
                        onClick={() => {
                          deleteAllReports();
                          setEvent(!event);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          ) : (
            <NoReports>No Reports to Display</NoReports>
          )}
        </div>
        <Footer handleLogout={handleLogout} />
      </div>
    </MainContainer>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export default Reports;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 80vh;
  height: auto;
  position: relative;
  justify-content: space-between;
  overflow: hidden;
  ::-webkit-scrollbar {
    width: 10px;
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.227);
  }

  ::-webkit-scrollbar-thumb:hover {
    cursor: pointer;
    background-color: black;
  }
  .body {
    position: relative;
    height: auto;
    padding-top: 10vh;
    width: 100vw;
    border-radius: 10px 10px 0 0;
    animation: ${fadeIn} 1s ease-in-out,
      ${gradientAnimation} 10s infinite alternate ease-in-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
  }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #ccc;
  border-top-color: #000;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingContainer = styled.div`
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: white;
`;

const ReportList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 80%;
`;

const ReportCard = styled.div`
  background: #fff;
  padding: 20px;
  margin: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 250px;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const DownloadButton = styled.button`
  padding: 8px 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: #0056b3;
  }
`;

const DeleteButton = styled.button`
  padding: 8px 12px;
  background: #ff4d4d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: #cc0000;
  }
`;

const DeleteAllButton = styled.button`
  margin: 20px 0;
  padding: 10px 15px;
  background: #ff3333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: #cc0000;
  }
`;

const NoReports = styled.h3`
  color: white;
  font-size: 1.5rem;
`;
