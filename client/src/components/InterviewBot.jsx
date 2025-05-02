import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Mic, FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const InterviewBot = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-6 py-16 md:py-24 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute -top-52 -left-40 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse" />
      <div className="absolute -bottom-52 -right-40 w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse delay-1000" />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin h-16 w-16 rounded-full border-t-4 border-indigo-500 border-solid mb-4 mx-auto" />
            <p className="text-lg text-gray-700 font-medium">
              Analyzing your resume...
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Prepare Smarter, Not Harder
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you're polishing your resume or simulating interviews, our
            AI has you covered.
          </p>
        </motion.div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* AI Interview Card */}
          <div
            onClick={() => navigate("/interview/start")}
            className="group rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-8 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              🎤 AI Mock Interview
            </h2>
            <p className="text-gray-600 mb-6">
              Practice with realistic interview questions tailored to your
              resume.
            </p>
            <ul className="space-y-2 mb-8 text-gray-600">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2" />
                Real-time response simulation
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2" />
                Role-specific question sets
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2" />
                Smart feedback loop
              </li>
            </ul>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white text-gray-900 rounded-full font-medium shadow-sm group-hover:translate-x-1 transition-all duration-300">
              Start Interview
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Resume Analysis Card */}
          <div
            onClick={analyzeResume}
            className="group rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-8 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              📄 Resume Analysis
            </h2>
            <p className="text-gray-600 mb-6">
              Let our AI evaluate your resume and identify areas for
              improvement.
            </p>
            <ul className="space-y-2 mb-8 text-gray-600">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2" />
                Skill-gap detection
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2" />
                Keyword optimization
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2" />
                Personalized recommendations
              </li>
            </ul>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white text-gray-900 rounded-full font-medium shadow-sm group-hover:translate-x-1 transition-all duration-300">
              Analyze Resume
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-500">
            More AI tools for preparation are on the way 🚀
          </p>
          <button
            onClick={() => navigate("/selection")}
            className="mt-6 text-sm bg-red-300 rounded-4xl p-4 text-red-600 hover:underline cursor-pointer"
          >
            ← Back to Mode Selection
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default InterviewBot;
