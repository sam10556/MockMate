import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Markdown from "react-markdown";

const AnalyzeResume = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { analysis } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 to-purple-300 flex flex-col items-center p-6">
      <div className="w-full max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Resume Analysis
        </h2>
        <div>
          <Markdown>{analysis}</Markdown>
        </div>
        <button
          onClick={() => navigate("/interview/bot")}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default AnalyzeResume;
