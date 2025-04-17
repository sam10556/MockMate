import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";

export default function InterviewBot() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const resumeText = localStorage.getItem("resumeText") || "";

  const analyzeResume = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://mock-mate-api.vercel.app/analyze-resume",
        { resumeText }
      );
      if (response.data?.analysis) {
        navigate("/interview/bot/resume", {
          state: { analysis: response.data.analysis },
        });
      }
    } catch (error) {
      console.error("Error analyzing resume:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white py-20 px-8 overflow-hidden flex flex-col items-center">
      {/* Blobs for Aesthetic Background */}
      <div className="absolute -top-52 -left-40 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-52 -right-40 w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse delay-1000"></div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500 border-solid mb-4 mx-auto"></div>
            <p className="text-lg text-gray-700 font-medium">
              Analyzing your resume...
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 relative z-10"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900">
          How Would You Like to Prepare?
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
          Choose between an AI-powered mock interview or a resume analysis to
          refine your skills.
        </p>
      </motion.header>

      {/* Container for Cards */}
      <div className="relative z-10 max-w-6xl w-full flex flex-col md:flex-row gap-10">
        {/* Interview Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-blue-100 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition cursor-pointer min-h-[280px] flex flex-col justify-between"
        >
          <div>
            <h2 className="text-3xl font-semibold text-blue-900 mb-3">
              🎤 AI Mock Interview
            </h2>
            <p className="text-lg text-gray-700">
              Experience an AI-driven interview based on your resume & role.
            </p>
          </div>
          <button
            onClick={() => navigate("/interview/start")}
            className="mt-6 px-6 py-3 bg-blue-600 text-white text-lg rounded-full hover:bg-blue-700 transition"
          >
            Start Interview →
          </button>
        </motion.div>

        {/* Resume Analysis Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-purple-100 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition cursor-pointer min-h-[280px] flex flex-col justify-between"
        >
          <div>
            <h2 className="text-3xl font-semibold text-purple-900 mb-3">
              📄 Resume Analysis
            </h2>
            <p className="text-lg text-gray-700">
              Get AI-powered feedback on your resume's strengths and weaknesses.
            </p>
          </div>
          <button
            onClick={analyzeResume}
            className="mt-6 px-6 py-3 bg-purple-600 text-white text-lg rounded-full hover:bg-purple-700 transition"
          >
            Analyze Resume →
          </button>
        </motion.div>
      </div>
      <div className="relative z-10 mt-12">
        <button
          onClick={() => navigate("/selection")}
          type="button"
          class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Back
        </button>
      </div>
    </div>
  );
}
