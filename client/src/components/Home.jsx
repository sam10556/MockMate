import { useState } from "react";
import PDFUploader from "./PDFuploader";
import ChatBot from "./Chatbot";
import { ArrowLeftCircleIcon } from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
  const [resumeText, setResumeText] = useState("");
  const [uploaded, setUploaded] = useState(false);
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

      {/* Conditional Rendering for Uploader & Chatbot */}
      <div className="w-full max-w-5xl">
        {!uploaded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-2xl rounded-3xl p-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
              Upload Your File Here
            </h2>
            <PDFUploader
              onExtractedText={(text) => {
                setResumeText(text);
                setUploaded(true);
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-2xl rounded-3xl p-8"
          >
            {/* Back Button (Top Left Corner) */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex justify-start mb-6"
            >
              <button
                onClick={() => {
                  setUploaded(false);
                  setResumeText("");
                }}
                className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 font-semibold rounded-lg transition-all hover:bg-red-500 hover:text-white hover:shadow-md"
              >
                <ArrowLeftCircleIcon className="w-5 h-5" />
                Back to Upload
              </button>
            </motion.div>

            {/* Chatbot */}
            <ChatBot resumeText={resumeText} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
