import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Markdown from "react-markdown";

const Feedback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { chatHistory, feedback } = location.state || {};

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
      <h1 className="text-2xl font-bold text-yellow-600 mb-4">
        Final Feedback
      </h1>

      <div className="mb-4">
        {chatHistory?.map((entry, index) => (
          <div key={index} className="mb-3">
            <p className="font-semibold text-lg">
              Q{index + 1}: {entry.question}
            </p>
            <p className="text-gray-700 text-lg">A: {entry.answer}</p>
          </div>
        ))}
      </div>

      <div className="text-lg bg-yellow-50 p-4 border-l-4 border-yellow-500 rounded-lg">
        <Markdown>{feedback}</Markdown>
      </div>

      <button
        onClick={() => navigate("/interview/bot")}
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
      >
        Back
      </button>
    </div>
  );
};

export default Feedback;
