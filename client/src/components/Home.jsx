import { useState } from "react";
import PDFUploader from "./PDFuploader";
import ChatBot from "./Chatbot";
import { ArrowLeftCircleIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
  const [resumeText, setResumeText] = useState("");
  const [uploaded, setUploaded] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 to-purple-300 flex flex-col items-center p-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mt-10 mb-8 max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 tracking-tight">
          MockMate 🎤
        </h1>
        <p className="mt-2 text-2xl text-gray-600">
          Elevate your interview and exam preparation with AI-powered
          assistance.
        </p>
        <p className="mt-4 text-xl text-left text-gray-700 max-w-2xl mx-auto">
          Upload your resume or study materials, and let our AI-powered chatbot
          simulate real-world interview or exam scenarios. Gain confidence,
          improve your responses, and get constructive feedback to help you
          succeed.
        </p>
        <div className="mt-4 text-lg md:text-xl text-gray-700 max-w-2xl mx-auto space-y-3 text-justify">
          <p>With MockMate, you can:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Upload your resume or study materials for personalized guidance.
            </li>
            <li>Simulate real-world interview and exam scenarios with AI.</li>
            <li>
              Receive instant, constructive feedback to refine your responses.
            </li>
            <li>Build confidence and improve your performance effortlessly.</li>
          </ul>
        </div>
      </motion.header>

      {/* Conditional Rendering for Uploader & Chatbot */}
      <div className="mt-6">
        <Link
          to="/selection"
          className="px-6 py-3 text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Let's Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;
