import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";

const QuizSession = () => {
  const [questions, setQuestions] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [userResponses, setUserResponses] = useState([]);
  const navigate = useNavigate();
  const resumeText = localStorage.getItem("resumeText") || "";

  const generateExamQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/generate-multiplechoice-questions",
        { resumeText }
      );

      if (!response.data || !response.data.questions) {
        throw new Error(
          "Invalid response format: 'questions' field is missing"
        );
      }

      let rawText = response.data.questions.join("\n");
      rawText = rawText.replace(/```json|```/g, "").trim();

      let questionsData;
      try {
        questionsData = JSON.parse(rawText);
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
      setIsStarted(true);
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
      const isCorrect = userAnswer === correctAnswer;

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
        {!isStarted ? (
          <button
            onClick={generateExamQuestions}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Start Quiz
          </button>
        ) : (
          <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Exam Questions
            </h2>

            {loading ? (
              <p>Loading questions...</p>
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
              disabled={userResponses.includes("")} // Prevents submission if any question is unanswered
              className={`mt-4 w-full py-2 px-4 rounded-xl font-semibold text-white ${
                userResponses.includes("")
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              Submit Exam
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSession;
