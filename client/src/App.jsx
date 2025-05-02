import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Feedback from "./components/Feedback";
import InterviewPage from "./pages/InterviewPage";
import ExamPage from "./pages/ExamPage";
import Selection from "./pages/Selection";
import InterviewBot from "./components/InterviewBot";
import AnalyzeResume from "./components/AnalyzeResume";
import InterviewSession from "./components/InterviewSession";
import Notes from "./components/Notes";
import ExamBot from "./components/ExamBot";
import QuizSession from "./components/QuizSession";
import QuizResults from "./components/QuizResult";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/selection" element={<Selection />} />
          <Route path="interview/feedback" element={<Feedback />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/interview/bot" element={<InterviewBot />} />
          <Route path="/interview/bot/resume" element={<AnalyzeResume />} />
          <Route path="/interview/start" element={<InterviewSession />} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/exam/bot" element={<ExamBot />} />
          <Route path="/exam/bot/notes" element={<Notes />} />
          <Route path="/exam/bot/start" element={<QuizSession />} />
          <Route path="/exam/result" element={<QuizResults />} />
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
