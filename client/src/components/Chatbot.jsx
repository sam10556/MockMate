import { useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import { useNavigate } from "react-router-dom";

const ChatBot = ({ resumeText }) => {
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

  // Fetch questions based on mode
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

  const generateExamQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/generate-multiplechoice-questions",
        { resumeText }
      );
  
      if (!response.data || !response.data.questions) {
        throw new Error("Invalid response format: 'questions' field is missing");
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

  const mcqFeedBack = () => {
    let score = 0;
    userResponses.forEach((response, index) => {
      if (
        response.slice(0, 1).toLowerCase() ===
        correctAnswers[index].trim().toLowerCase()
      ) {
        score++;
      }
    });

    setFeedback(`You scored ${score} out of ${questions.length}.`);
  };

  // Fetch resume analysis
  const analyzeResume = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/analyze-resume",
        { resumeText }
      );
      setResumeAnalysis(response.data.analysis);
    } catch (error) {
      console.error("Error analyzing resume:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle user answer submission
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
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            AI Interview & Exam Bot
          </h1>
          <p className="mt-2 text-lg text-indigo-200">
            Choose an option to begin.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center p-10">
          {!mode ? (
            // Mode Selection
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
              <button
                onClick={() => {
                  setMode("interview");
                  generateInterviewQuestion();
                }}
                className="py-4 px-6 rounded-2xl font-semibold transition-all bg-blue-500 hover:bg-blue-600 text-white shadow-md text-lg"
              >
                Take Interview
              </button>
              <button
                onClick={() => {
                  setMode("exam");
                  generateExamQuestions();
                }}
                className="py-4 px-6 rounded-2xl font-semibold transition-all bg-green-500 hover:bg-green-600 text-white shadow-md text-lg"
              >
                Take Exam
              </button>
              <button
                onClick={() => {
                  setMode("resume");
                  analyzeResume();
                }}
                className="py-4 px-6 rounded-2xl font-semibold transition-all bg-purple-500 hover:bg-purple-600 text-white shadow-md text-lg"
              >
                Analyze Resume
              </button>
            </div>
          ) : mode === "resume" ? (
            // Resume Analysis Mode
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Resume Analysis
              </h2>
              <div className="text-gray-800 text-lg text-justify leading-relaxed">
                <Markdown>
                  {resumeAnalysis || "Analyzing your resume..."}
                </Markdown>
              </div>
              <button
                onClick={() => setMode(null)}
                className="mt-4 w-full py-2 px-4 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white"
              >
                Back
              </button>
            </div>
          ) : mode === "interview" ? (
            // Interview Mode - One Question at a Time
            <div className="bg-gray-50 rounded-xl p-6 shadow-md w-full max-w-2xl mx-auto">
              {/* Question Section */}
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Question {currentQuestionIndex + 1}
              </h2>
              <Markdown>{questions[currentQuestionIndex]}</Markdown>

              {/* Answer Input */}
              <textarea
                placeholder="Type your response..."
                className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-400 outline-none resize-none min-h-[120px] text-lg mt-4 disabled:bg-gray-200"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                disabled={isFinalSubmitted}
              />

              {/* Navigation Button - Disabled after final submission */}
              <button
                onClick={() =>
                  handleAnswerSubmit(currentQuestionIndex, currentAnswer)
                }
                disabled={!currentAnswer.trim() || loading || isFinalSubmitted}
                className={`mt-4 w-full py-3 px-4 rounded-xl font-semibold transition-all text-lg ${
                  loading || isFinalSubmitted
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {currentQuestionIndex < questions.length - 1
                  ? "Next Question"
                  : "Finish"}
              </button>

              {/* Answer Evaluation */}
              {/* {answers[currentQuestionIndex] && (
                <div className="mt-4 bg-green-50 border-l-4 border-green-500 text-green-600 rounded-xl p-4">
                  <p className="font-semibold">Evaluation:</p>
                  <Markdown>
                    {answers[currentQuestionIndex]}
                  </Markdown>
                </div>
              )} */}

              {/* Final Feedback */}
              {/* {feedback && (
                <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-600 rounded-xl p-6">
                  <p className="font-bold text-xl mb-3">Final Feedback:</p>
                  <div className="mb-4">
                    {chatHistory.map((entry, index) => (
                      <div key={index} className="mb-3">
                        <p className="font-semibold text-lg">
                          Q{index + 1}: {entry.question}
                        </p>
                        <p className="text-gray-700 text-lg">
                          A: {entry.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="text-lg">
                    <Markdown>{feedback}</Markdown>
                  </div>
                </div>
              )} */}

              {/* Back Button */}
              <button
                onClick={() => setMode(null)}
                className="mt-6 w-full py-3 px-4 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white text-lg"
              >
                Back
              </button>
            </div>
          ) : (
            // Exam Mode - Show All Questions
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Exam Questions
              </h2>

              {loading ? (
                <p>Loading questions...</p>
              ) : (
                questions.map((q, index) => (
                  <div key={index} className="bg-gray-100 p-3 rounded-lg my-2">
                    <div className="font-semibold">
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
                onClick={mcqFeedBack}
                className="mt-4 w-full py-2 px-4 rounded-xl font-semibold bg-green-500 hover:bg-green-600 text-white"
              >
                Submit Exam
              </button>

              {feedback && (
                <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-600 rounded-xl p-4">
                  <p className="font-semibold">Final Feedback:</p>
                  <p>{feedback}</p>
                </div>
              )}

              <button
                onClick={() => setMode(null)}
                className="mt-4 w-full py-2 px-4 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white"
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

export default ChatBot;
