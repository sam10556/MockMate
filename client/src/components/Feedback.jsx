import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Markdown from "react-markdown";

const Feedback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { chatHistory, feedback } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex flex-col items-center py-8">
      <div className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-3xl space-y-6">
        <h1 className="text-3xl font-bold text-yellow-600 text-center mb-8">
          Final Feedback
        </h1>

        {/* Chat History Display */}
        <div className="space-y-4">
          {chatHistory?.map((entry, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-xl shadow-md">
              <p className="font-semibold text-lg text-gray-800 mb-2">
                Q{index + 1}: {entry.question}
              </p>
              <p className="text-gray-700 text-lg">{entry.answer}</p>
            </div>
          ))}
        </div>

        {/* Feedback */}
        <div className="bg-yellow-50 p-6 border-l-4 border-yellow-500 rounded-lg shadow-md mt-6">
          <p className="text-xl font-semibold text-gray-800 mb-4">
            Your Feedback:
          </p>
          <Markdown>{feedback}</Markdown>
        </div>

        {/* Button to go back */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/interview/bot")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all"
          >
            Go Back to Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
