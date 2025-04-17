import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import { Bouncy } from "ldrs/react";
import "ldrs/react/Bouncy.css";

const InterviewSession = () => {
  const [questions, setQuestions] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinalSubmitted, setIsFinalSubmitted] = useState(false);
  const navigate = useNavigate();
  const resumeText = localStorage.getItem("resumeText") || "";

  const generateInterviewQuestion = async () => {
    setIsStarted(true);
    setLoading(true);
    try {
      const response = await axios.post(
        "https://mock-mate-api.vercel.app/generate-interview-questions",
        { resumeText }
      );

      if (!response.data || !response.data.questions) {
        throw new Error(
          "Invalid response format: 'questions' field is missing"
        );
      }
      let rawText = response.data.questions.join("\n"); // Convert array back to string
      rawText = rawText.replace(/```json|```/g, "").trim();

      let questionsData;
      try {
        questionsData = JSON.parse(rawText); // Parse the cleaned JSON string
      } catch (error) {
        throw new Error("Failed to parse AI response as JSON.");
      }

      const extractedQuestions = questionsData.map((q) => q.questions);

      setQuestions(extractedQuestions);
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error("Error fetching interview questions:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!currentAnswer.trim() || loading) return;
    try {
      const response = await axios.post(
        "https://mock-mate-api.vercel.app/evaluate-answer",
        {
          question: questions[currentQuestionIndex],
          answer: currentAnswer,
        }
      );

      if (!response.data || !response.data.evaluation) {
        throw new Error("Invalid response format: 'evaluation' field missing");
      }

      const updatedChatHistory = [
        ...chatHistory,
        {
          question: questions[currentQuestionIndex],
          answer: currentAnswer,
          feedback: response.data.evaluation,
        },
      ];

      setChatHistory(updatedChatHistory);
      setAnswers((prev) => ({
        ...prev,
        [currentQuestionIndex]: response.data.evaluation,
      }));
      setCurrentAnswer("");

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setTimeout(() => getFinalFeedback(updatedChatHistory), 500);
      }
    } catch (error) {
      console.error("Error evaluating answer:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getFinalFeedback = async (updatedChatHistory) => {
    setIsFinalSubmitted(true);
    try {
      const response = await axios.post(
        "https://mock-mate-api.vercel.app/final-feedback",
        {
          chatHistory: updatedChatHistory,
        }
      );

      if (!response.data || !response.data.feedback) {
        throw new Error("Invalid response format: 'feedback' field is missing");
      }

      navigate("/interview/feedback", {
        state: {
          chatHistory: updatedChatHistory,
          feedback: response.data.feedback,
        },
      });
    } catch (error) {
      console.error("Error getting final feedback:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex flex-col items-center p-6 relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/interview-background.jpg')" }}
      />

      {/* Interview Card */}
      <div className="relative z-10 w-full max-w-4xl mx-auto p-12 bg-white rounded-3xl shadow-lg text-center space-y-6">
        {/* Illustration or Text above Start Button */}
        {!isStarted && (
          <div className="flex flex-col items-center space-y-6 mb-8">
            <img
              src="/illustration1.svg"
              alt="Interview Illustration"
              className="w-40 h-40 mb-6"
            />
            <h2 className="text-3xl font-semibold text-gray-800">
              Ready for your mock interview? Let's get started!
            </h2>
            <p className="text-lg text-gray-600">
              Get personalized interview questions based on your resume and
              practice your answers.
            </p>
          </div>
        )}

        {/* Start Button */}
        {!isStarted ? (
          <button
            onClick={generateInterviewQuestion}
            className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all mt-8 text-lg"
          >
            Start Interview
          </button>
        ) : loading ? (
          <div className="flex items-center justify-center gap-4 p-8 my-12 rounded-2xl">
            <h1 className="text-2xl font-semibold text-gray-700">
              Generating Interview Questions
            </h1>
            <Bouncy size="60" speed="1.75" color="black" />
          </div>
        ) : isFinalSubmitted ? (
          <p className="text-lg font-semibold text-green-600">
            Final feedback is being generated...
          </p>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Question {currentQuestionIndex + 1}
              </h2>
              <img
                src="/illustration1.svg"
                alt="Interview Icon"
                className="w-16 h-16"
              />
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl shadow-md mb-8 text-left text-lg text-gray-800 font-semibold">
              <Markdown>{questions[currentQuestionIndex]}</Markdown>
            </div>

            <textarea
              placeholder="Type your response..."
              className="w-full border border-gray-300 rounded-lg p-6 mt-4 text-lg min-h-[160px] bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              disabled={loading}
            />

            <button
              onClick={handleAnswerSubmit}
              disabled={!currentAnswer.trim() || loading}
              className={`mt-6 w-full py-4 px-6 rounded-lg font-semibold text-lg ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {currentQuestionIndex < questions.length - 1
                ? "Next Question"
                : "Finish"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSession;
