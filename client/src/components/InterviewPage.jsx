import { useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import { useLocation, useNavigate } from "react-router-dom";

const InterviewPage = () => {
  const [mode, setMode] = useState(null); // Track selected mode
  const [questions, setQuestions] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [resumeAnalysis, setResumeAnalysis] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isFinalSubmitted, setIsFinalSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const { resumeText } = location.state || {};

  const analyzeResume = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/analyze-resume",
        { resumeText }
      );
      console.log(object);
      setResumeAnalysis(response.data.analysis);
    } catch (error) {
      console.error("Error analyzing resume:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateInterviewQuestion = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/generate-interview-questions",
        { resumeText }
      );

      if (!response.data || !response.data.questions) {
        throw new Error(
          "Invalid response format: 'questions' field is missing"
        );
      }

      // Extract only the actual questions from the response
      const extractedQuestions = response.data.questions
        .filter(
          (q, index) => index > 0 && index < response.data.questions.length - 1
        ) // Remove first and last items
        .map((q) => q.replace(/\*\*(.*?)\*\*/, "$1")) // Remove markdown bold formatting
        .map((q) => q.split("**")[0].trim()); // Ensure only the question is kept

      setQuestions(extractedQuestions);
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error("Error fetching interview question:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getFinalFeedback = async (updatedChatHistory) => {
    setLoading(true);
    setIsFinalSubmitted(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/final-feedback",
        {
          chatHistory: updatedChatHistory, // Ensure latest history is sent
        }
      );

      if (!response.data || !response.data.feedback) {
        throw new Error("Invalid response format: 'feedback' field is missing");
      }

      if (response.data?.feedback) {
        navigate("/feedback", {
          state: {
            chatHistory: updatedChatHistory,
            feedback: response.data.feedback,
          },
        });
      }
    } catch (error) {
      console.error("Error getting final feedback:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
          <h1 className="text-3xl font-extrabold text-white">
            AI Interview & Exam Bot
          </h1>
          <p className="mt-2 text-lg text-indigo-200">
            Choose an option to begin.
          </p>
        </div>

        <div className="p-8 space-y-6">
          {!mode ? (
            <div className="grid gap-4">
              <button
                onClick={() => {
                  setMode("interview");
                  generateInterviewQuestion();
                }}
                className="w-full py-3 px-6 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold"
              >
                Take Interview
              </button>
              <button
                onClick={() => {
                  setMode("exam");
                  generateExamQuestions();
                }}
                className="w-full py-3 px-6 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold"
              >
                Take Exam
              </button>
              <button
                onClick={() => {
                  setMode("resume");
                  analyzeResume();
                }}
                className="w-full py-3 px-6 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-semibold"
              >
                Tell Me About My Resume
              </button>
            </div>
          ) : mode === "resume" ? (
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Resume Analysis
              </h2>
              <div className="text-gray-800 text-lg leading-relaxed">
                <Markdown>
                  {resumeAnalysis || "Analyzing your resume..."}
                </Markdown>
              </div>
              <button
                onClick={() => setMode(null)}
                className="mt-4 w-full py-2 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold"
              >
                Back
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 shadow-md max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Question {currentQuestionIndex + 1}
              </h2>
              <Markdown>{questions[currentQuestionIndex]}</Markdown>
              <textarea
                placeholder="Type your response..."
                className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-400 min-h-[120px] text-lg mt-4 disabled:bg-gray-200"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                disabled={isFinalSubmitted}
              />

              <button
                onClick={handleAnswerSubmit}
                disabled={!currentAnswer.trim() || isFinalSubmitted}
                className={`mt-4 w-full py-3 px-4 rounded-xl font-semibold text-lg transition-all ${
                  isFinalSubmitted
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {currentQuestionIndex < questions.length - 1
                  ? "Next Question"
                  : "Finish"}
              </button>

              {isFinalSubmitted && feedback && (
                <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-600 rounded-xl p-6">
                  <p className="font-bold text-xl mb-3">Final Feedback:</p>
                  <Markdown>{feedback}</Markdown>
                </div>
              )}

              <button
                onClick={() => setMode(null)}
                className="mt-6 w-full py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white text-lg font-semibold"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
