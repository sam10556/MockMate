import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Markdown from "react-markdown";

const Notes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { notes } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 to-purple-300 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl p-10 space-y-6 relative">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-indigo-800">
            📘 Important Notes
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Based on your uploaded document
          </p>
        </div>

        {/* Notes Content */}
        <div className="max-h-[500px] overflow-y-auto p-6 bg-gray-50 rounded-xl shadow-inner border border-indigo-100">
          <Markdown>
            {notes}
          </Markdown>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/exam/bot")}
            className="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 hover:scale-105 transition duration-200 ease-in-out"
          >
            Back to Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notes;
