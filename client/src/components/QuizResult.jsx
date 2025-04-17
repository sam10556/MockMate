import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const QuizResults = () => {
  const [results, setResults] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedResults = JSON.parse(localStorage.getItem("quizResults")) || [];
    const storedScore = localStorage.getItem("totalScore") || 0;
    setResults(storedResults);
    setTotalScore(storedScore);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-300 to-blue-300 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-3xl text-center">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Quiz Results</h2>
        <p className="text-lg font-semibold text-green-700 mb-6">
          You scored {totalScore} out of {results.length}
        </p>

        <div className="mt-6 space-y-6">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl shadow-md ${
                result.isCorrect ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <p className="font-semibold text-xl text-gray-800">
                {index + 1}. <span className="text-indigo-600">{result.question}</span>
              </p>
              <div className="mt-4 text-gray-700">
                <p className="font-medium">
                  Your Answer: <span className="font-semibold">{result.userAnswer}</span>
                </p>
                <p className="font-medium">
                  Correct Answer: <span className="font-semibold">{result.correctAnswer}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={() => navigate("/exam/bot")}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Back to Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
