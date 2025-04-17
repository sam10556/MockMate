import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Markdown from "react-markdown";

const AnalyzeResume = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysis } = location.state || {};

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-white flex items-center justify-center p-8 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-300 opacity-30 rounded-full blur-3xl mix-blend-multiply animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-300 opacity-30 rounded-full blur-3xl mix-blend-multiply animate-pulse delay-1000" />

      {/* Card */}
      <div className="relative z-10 max-w-5xl w-full bg-white rounded-3xl shadow-2xl p-10">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          📄Resume Analysis
        </h2>

        {/* Markdown Content */}
        <div className="prose max-w-none prose-indigo prose-lg text-gray-700 leading-relaxed">
          <Markdown>{analysis}</Markdown>
        </div>

        {/* Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/interview/bot")}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold text-lg rounded-full shadow-md hover:bg-indigo-700 transition-all"
          >
            ← Back to Interview Options
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyzeResume;
