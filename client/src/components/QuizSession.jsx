import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import { Bouncy } from "ldrs/react";
import "ldrs/react/Bouncy.css";

const QuizSession = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [userResponses, setUserResponses] = useState([]);
  const navigate = useNavigate();
  const resumeText = localStorage.getItem("resumeText") || "";

  useEffect(() => {
    generateExamQuestions();
  }, []);

  const generateExamQuestions = async () => {
    setLoading(true);
    setIsStarted(true);
    try {
      const response = await axios.post(
        "https://mock-mate-api.vercel.app/generate-multiplechoice-questions",
        {
          resumeText,
        }
      );

      const questionsData = response.data.questions;

      if (!Array.isArray(questionsData)) {
        throw new Error(
          "Invalid response format: 'questions' should be an array"
        );
      }

      const extractedQuestions = questionsData.map((q) => ({
        question: q.question,
        options: q.options,
      }));

      const extractedAnswers = {};
      questionsData.forEach((q, index) => {
        const answerLetter = q.answer?.toLowerCase(); // like "a"
        const optionIndex = answerLetter.charCodeAt(0) - 97; // "a" = 0, "b" = 1, etc.
        const fullAnswer = q.options[optionIndex];

        extractedAnswers[index] = fullAnswer || q.answer; // fallback in case
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

  const handleSubmit = () => {
    let score = 0;
    const results = questions.map((q, index) => {
      const userAnswer = userResponses[index]?.trim().toLowerCase();
      const correctAnswer = correctAnswers[index]?.trim().toLowerCase();
      const isCorrect = userAnswer.slice(0, 1) === correctAnswer.slice(0, 1);
      if (isCorrect) {
        score++;
      }

      return {
        question: q.question,
        options: q.options,
        userAnswer,
        correctAnswer,
        isCorrect,
      };
    });

    localStorage.setItem("quizResults", JSON.stringify(results));
    localStorage.setItem("totalScore", score);
    navigate("/exam/result");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 to-purple-300 flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-900 mb-4">
            Exam Questions
          </h2>
          <p className="text-lg text-indigo-600">
            Answer the following questions based on your document.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-6 p-8 my-12 rounded-2xl bg-gray-50 shadow-lg">
            <h1 className="text-2xl font-semibold text-gray-700">
              Generating Questions
            </h1>
            <Bouncy size="60" speed="1.75" color="black" />
          </div>
        ) : (
          // Question Cards
          <div>
            {questions.map((q, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6 shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="text-left mb-4">
                  <div className="flex items-start font-semibold text-xl text-indigo-900">
                    <p className="mr-2">{index + 1}.</p>
                    <Markdown>{q.question}</Markdown>
                  </div>
                </div>

                {q.options.map((option, optIndex) => (
                  <label
                    key={optIndex}
                    className="flex items-center space-x-3 cursor-pointer text-lg hover:bg-indigo-100 rounded-lg p-3 mb-2 transition-all"
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={userResponses[index] === option}
                      onChange={(e) => {
                        let newResponses = [...userResponses];
                        newResponses[index] = e.target.value;
                        setUserResponses(newResponses);
                      }}
                      className="form-radio h-5 w-5 text-indigo-600"
                    />
                    <span className="text-indigo-800">{option}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-8">
          <button
            onClick={handleSubmit}
            disabled={userResponses.includes("") || loading}
            className={`w-full py-3 rounded-xl font-semibold text-lg text-white ${
              userResponses.includes("")
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-br from-green-400 to-teal-400 hover:bg-gradient-to-br hover:from-green-500 hover:to-teal-500"
            }`}
          >
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizSession;
