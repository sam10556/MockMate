import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftCircleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PDFUploader from "./PDFuploader"; // Custom upload component

export default function InterviewPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white py-16 px-6 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute -top-32 -left-40 w-[400px] h-[400px] bg-purple-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-32 -right-40 w-[400px] h-[400px] bg-indigo-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse delay-1000"></div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14 relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
          Resume-Based Interview Prep
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
          Upload your resume and let AI simulate a real interview experience.
        </p>
      </motion.header>

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl p-8"
        >
          {/* Back Button */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex justify-start mb-6"
          >
            <button
              onClick={() => navigate("/selection")}
              className="flex items-center gap-2 px-4 py-2 border border-gray-400 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-all"
            >
              <ArrowLeftCircleIcon className="w-5 h-5" />
              Back
            </button>
          </motion.div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Upload your resume below
          </h2>

          {/* PDF Upload Component */}
          <PDFUploader
            onExtractedText={(text) => {
              localStorage.setItem("resumeText", text);
              navigate("/interview/bot");
            }}
          />

          {/* Mini tips / assurance */}
          <div className="mt-6 text-sm text-center text-gray-500">
            <p>
              ✨ We do not store your resume. Your data stays in your browser.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
