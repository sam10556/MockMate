import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";

export default function ExamBot() {
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

  const generateExamQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://mock-mate-api.vercel.app/generate-multiplechoice-questions",
        { resumeText }
      );

      if (!response.data || !response.data.questions) {
        throw new Error(
          "Invalid response format: 'questions' field is missing"
        );
      }

      // The response may be wrapped in a code block, so we need to clean it
      let rawText = response.data.questions.join("\n"); // Convert array back to string
      rawText = rawText.replace(/```json|```/g, "").trim(); // Remove ```json and ``` markers

      let questionsData;
      try {
        questionsData = JSON.parse(rawText); // Parse the cleaned JSON string
      } catch (error) {
        throw new Error("Failed to parse AI response as JSON.");
      }

      const extractedQuestions = questionsData.map((q) => ({
        question: q.question,
        options: q.options,
      }));

      const extractedAnswers = {};
      questionsData.forEach((q, index) => {
        extractedAnswers[index] = q.answer;
      });

      setQuestions(extractedQuestions);
      setCorrectAnswers(extractedAnswers);
      setUserResponses(Array(extractedQuestions.length).fill(""));
    } catch (error) {
      console.error("Error fetching exam questions:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const makesNotes = async () => {
    setLoading(true);
    try {
      const response = await axios.post("https://mock-mate-api.vercel.app/make-notes", {
        resumeText,
      });
      if (response.data?.notes) {
        navigate("/exam/bot/notes", {
          state: {
            notes: response.data.notes,
          },
        });
      }
    } catch (error) {
      console.error("Error Generating", error.message);
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
              onClick={() => navigate("/exam")}
              className="flex items-center gap-2 px-4 py-2 border border-gray-500 text-gray-500 font-semibold rounded-lg transition-all hover:bg-gray-500 hover:text-white hover:shadow-md"
            >
              Back to Upload
            </button>
          </motion.div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Choose Your Exam Practice Mode
          </h2>

          <div className="flex flex-col md:flex-row justify-center items-center p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
              <button
                onClick={() => navigate("/exam/bot/start")}
                className="py-4 px-6 rounded-2xl font-semibold transition-all bg-blue-500 hover:bg-blue-600 text-white shadow-md text-lg"
              >
                Take Quiz(MCQ)
              </button>
              <button
                onClick={() => makesNotes()}
                className="py-4 px-6 rounded-2xl font-semibold transition-all bg-purple-500 hover:bg-purple-600 text-white shadow-md text-lg"
              >
                Make notes from the document
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
