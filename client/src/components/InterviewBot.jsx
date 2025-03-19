import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";

export default function InterviewBot() {
  const [mode, setMode] = useState(null);
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
  const resumeText = localStorage.getItem("resumeText") || "";

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

  const analyzeResume = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/analyze-resume",
        { resumeText }
      );
      if (response.data?.analysis) {
        navigate("/interview/bot/resume", {
          state: {
            analysis: response.data.analysis,
          },
        });
      }
    } catch (error) {
      console.error("Error analyzing resume:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (index, answer) => {
    if (!answer.trim() || loading) return; // Prevent empty submissions & multiple requests

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/evaluate-answer",
        {
          question: questions[index],
          answer,
        }
      );

      if (!response.data || !response.data.evaluation) {
        throw new Error("Invalid response format: 'evaluation' field missing");
      }

      // Store evaluation feedback
      setAnswers((prev) => ({ ...prev, [index]: response.data.evaluation }));

      // Update chat history
      const updatedChatHistory = [
        ...chatHistory,
        { question: questions[index], answer },
      ];
      setChatHistory(updatedChatHistory);

      // Move to the next question or finish
      if (index < questions.length - 1) {
        setCurrentQuestionIndex(index + 1);
        setCurrentAnswer(""); // Clear input for the next question
      } else {
        // Ensure the last answer is stored before submitting
        setTimeout(() => getFinalFeedback(updatedChatHistory), 500);
      }
    } catch (error) {
      console.error(
        "Error evaluating answer:",
        error.response?.data || error.message
      );
      setAnswers((prev) => ({
        ...prev,
        [index]: "Error evaluating answer. Please try again.",
      }));
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
        navigate("/interview/feedback", {
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
          {/* Back Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-start mb-6"
          >
            <button
              onClick={() => navigate("/interview")}
              className="flex items-center gap-2 px-4 py-2 border border-gray-500 text-gray-500 font-semibold rounded-lg transition-all hover:bg-gray-500 hover:text-white hover:shadow-md"
            >
              Back to Upload
            </button>
          </motion.div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Choose Your Interview Practice Mode
          </h2>

          <div className="flex flex-col md:flex-row justify-center items-center p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
              <button
                onClick={() => navigate("/interview/start")}
                className="py-4 px-6 rounded-2xl font-semibold transition-all bg-blue-500 hover:bg-blue-600 text-white shadow-md text-lg"
              >
                Take Interview
              </button>
              <button
                onClick={() => analyzeResume()}
                className="py-4 px-6 rounded-2xl font-semibold transition-all bg-purple-500 hover:bg-purple-600 text-white shadow-md text-lg"
              >
                Tell Me About My Resume
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
