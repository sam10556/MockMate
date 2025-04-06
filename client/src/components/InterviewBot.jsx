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
          state: {
            analysis: response.data.analysis,
          },
        });
      }
    } catch (error) {
      console.error("Error analyzing resume:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 to-purple-300 flex flex-col items-center p-6">
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
        transition={{ duration: 0.5 }}
        className="text-center mt-10 mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 tracking-tight">
          MockMate 🎤
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Ace your next interview or exam with AI-powered practice.
        </p>
      </motion.header>
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white shadow-2xl rounded-3xl p-8 text-center"
        >
          {/* Back Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-start mb-6"
          >
            <button
              onClick={() => navigate("/interview")}
              className="flex items-center gap-2 px-4 py-2 border border-gray-500 text-gray-500 font-semibold rounded-lg transition-all hover:bg-gray-500 hover:text-white hover:shadow-md"
            >
              Back to Upload
            </button>
          </motion.div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Choose Your Interview Practice Mode
          </h2>

          <div className="flex flex-col md:flex-row justify-center items-center p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
              <button
                onClick={() => navigate("/interview/start")}
                className="py-4 px-6 rounded-2xl font-semibold transition-all bg-blue-500 hover:bg-blue-600 text-white shadow-md text-lg"
              >
                Take Interview
              </button>
              <button
                onClick={() => analyzeResume()}
                className="py-4 px-6 rounded-2xl font-semibold transition-all bg-purple-500 hover:bg-purple-600 text-white shadow-md text-lg"
              >
                Tell Me About My Resume
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
