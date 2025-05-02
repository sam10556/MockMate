import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Markdown from "react-markdown";
import { motion } from "framer-motion";

const AnalyzeResume = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysis } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-6 py-16 md:py-24 relative overflow-hidden flex items-center justify-center">
      {/* Background Blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-300 opacity-30 rounded-full blur-3xl mix-blend-multiply animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-300 opacity-30 rounded-full blur-3xl mix-blend-multiply animate-pulse delay-1000" />

      <div className="relative z-10 max-w-5xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            📄 Resume Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Here’s how your resume stands out — and where it can be improved.
          </p>
        </motion.div>

        {/* Analysis Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl prose prose-indigo prose-lg max-w-none text-gray-700 leading-relaxed"
        >
          <Markdown>{analysis}</Markdown>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex justify-center mt-12"
        >
          <button
            onClick={() => navigate("/interview/bot")}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold text-lg rounded-full shadow-md hover:bg-indigo-700 transition-all"
          >
            ← Back to Interview Options
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyzeResume;
