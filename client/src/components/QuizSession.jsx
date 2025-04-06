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

  const handleSubmit = () => {
    let score = 0;
    const results = questions.map((q, index) => {
      const userAnswer = userResponses[index]?.trim().toLowerCase();
      const correctAnswer = correctAnswers[index]?.trim().toLowerCase();
      const isCorrect = userAnswer.slice(0, 1) === correctAnswer;
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 to-purple-300 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl text-center">
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Exam Questions
          </h2>

          {loading ? (
            <div className="flex items-center justify-center gap-4 p-8 my-12 rounded-2xl">
              <h1 className="text-2xl font-semibold text-gray-700">
                Generating Questions
              </h1>
              <Bouncy size="60" speed="1.75" color="black" />
            </div>
          ) : (
            questions.map((q, index) => (
              <div
                key={index}
                className="bg-gray-100 text-left p-3 rounded-lg my-2"
              >
                <div className="font-semibold flex gap-1">
                  <p>{index + 1}.</p>
                  <Markdown>{q.question}</Markdown>
                </div>
                {q.options.map((option, optIndex) => (
                  <label key={optIndex} className="block my-1">
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
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            ))
          )}

          <button
            onClick={handleSubmit}
            disabled={userResponses.includes("") || loading}
            className={`mt-4 w-full py-2 px-4 rounded-xl font-semibold text-white ${
              userResponses.includes("")
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
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
