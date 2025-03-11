import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Feedback from "./components/Feedback";
import InterviewPage from "./components/InterviewPage";
import QuizPage from "./components/QuizPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

/**
 * MockMate 🎤
 *
 * MockMate is an AI-powered interview preparation tool that helps users practice job interviews using their resumes.
 * Users can upload their resume as a PDF, and the AI chatbot generates mock interview questions based on their experience.
 * This interactive tool provides a personalized way to refine interview skills and boost confidence.
 *
 * Features:
 * - Resume-based AI interview questions
 * - PDF upload and text extraction
 * - Interactive chatbot experience
 * - Smooth animations for a seamless UI
 */
