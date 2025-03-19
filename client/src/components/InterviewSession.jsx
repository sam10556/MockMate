import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";

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
      let rawText = response.data.questions.join("\n"); // Convert array back to string
      rawText = rawText.replace(/```json|```/g, "").trim();

      let questionsData;
      try {
        questionsData = JSON.parse(rawText); // Parse the cleaned JSON string
      } catch (error) {
        throw new Error("Failed to parse AI response as JSON.");
      }
      console.log(questionsData);

      const extractedQuestions = questionsData.map((q) => q.questions);

      setQuestions(extractedQuestions);
      setCurrentQuestionIndex(0);
      setIsStarted(true);
    } catch (error) {
      console.error("Error fetching interview questions:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!currentAnswer.trim() || loading) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/evaluate-answer",
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
    setLoading(true);
    setIsFinalSubmitted(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/final-feedback",
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 to-purple-300 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl text-center">
        {!isStarted ? (
          <button
            onClick={generateInterviewQuestion}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Start Interview
          </button>
        ) : isFinalSubmitted ? (
          <p className="text-lg font-semibold text-green-600">
            Final feedback is being generated...
          </p>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Question {currentQuestionIndex + 1}
            </h2>
            <Markdown>{questions[currentQuestionIndex]}</Markdown>

            <textarea
              placeholder="Type your response..."
              className="w-full border border-gray-300 rounded-lg p-4 mt-4 text-lg min-h-[120px]"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              disabled={loading}
            />

            <button
              onClick={handleAnswerSubmit}
              disabled={!currentAnswer.trim() || loading}
              className={`mt-4 w-full py-3 px-4 rounded-lg font-semibold text-lg ${
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
