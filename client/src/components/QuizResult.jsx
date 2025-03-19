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
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-blue-200 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Results</h2>
        <p className="text-lg font-semibold text-green-700">
          You scored {totalScore} out of {results.length}
        </p>

        <div className="mt-4 text-left">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-4 my-2 rounded-xl ${
                result.isCorrect ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <p className="font-semibold">
                {index + 1}. {result.question}
              </p>
              <p>
                Your Answer:{" "}
                <span className="font-bold">{result.userAnswer}</span>
              </p>
              <p>
                Correct Answer:{" "}
                <span className="font-bold">{result.correctAnswer}</span>
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/exam/bot")}
          className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default QuizResults;
