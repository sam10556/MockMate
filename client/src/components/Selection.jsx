import { useState } from "react";
import PDFUploader from "./PDFuploader";
import ChatBot from "./Chatbot";
import { ArrowLeftCircleIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Selection = () => {
  const [resumeText, setResumeText] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 to-purple-300 flex flex-col items-center p-6">
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Select Your Preparation Mode
        </h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/interview")}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition"
          >
            Interview Preparation
          </button>
          <button
            onClick={() => navigate("/exam")}
            className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition"
          >
            Exam Preparation
          </button>
        </div>
      </motion.div>
    </div>
    </div>
  );
};

export default Selection;
