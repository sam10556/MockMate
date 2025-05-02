import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { BookOpenCheck, FileText, ArrowRight } from "lucide-react";

const ExamBot = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const resumeText = localStorage.getItem("resumeText") || "";

  const makeNotes = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://mock-mate-api.vercel.app/make-notes",
        {
          resumeText,
        }
      );
      if (response.data?.notes) {
        navigate("/exam/bot/notes", {
          state: {
            notes: response.data.notes,
          },
        });
      }
    } catch (error) {
      console.error("Error Generating Notes", error.message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      title: "Take Exam (MCQ)",
      description:
        "Test your understanding with AI-generated multiple-choice quizzes based on your content.",
      icon: <BookOpenCheck className="text-blue-600" size={32} />,
      action: () => navigate("/exam/bot/start"),
      color: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      highlights: [
        "Adaptive question generation",
        "Topic-based quiz sets",
        "Instant scoring",
      ],
    },
    {
      title: "Generate Notes",
      description:
        "Turn lengthy documents into crisp, structured notes using AI-powered summarization.",
      icon: <FileText className="text-purple-600" size={32} />,
      action: makeNotes,
      color: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      highlights: [
        "Smart content parsing",
        "Section-wise summaries",
        "Easy revision format",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-6 py-16 md:py-24 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute -top-52 -left-40 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse" />
      <div className="absolute -bottom-52 -right-40 w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse delay-1000" />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin h-16 w-16 rounded-full border-t-4 border-purple-500 border-solid mb-4 mx-auto" />
            <p className="text-lg text-gray-700 font-medium">
              Generating your notes...
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Exam Assistant
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select how you'd like to prepare — test your knowledge or simplify
            your study material.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              onClick={feature.action}
              className={`group rounded-2xl bg-gradient-to-br ${feature.color} border ${feature.borderColor} p-8 hover:shadow-lg transition-all duration-300 cursor-pointer`}
            >
              {/* Icon */}
              {/* <div className="bg-white rounded-xl p-3 w-fit shadow-sm mb-6">
                {feature.icon}
              </div> */}

              {/* Content */}
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h2>
              <p className="text-gray-600 mb-6">{feature.description}</p>

              {/* Highlights */}
              <ul className="space-y-2 mb-8 text-gray-600">
                {feature.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2" />
                    {highlight}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button className="flex items-center gap-2 px-6 py-2.5 bg-white text-gray-900 rounded-full font-medium shadow-sm group-hover:translate-x-1 transition-all duration-300">
                Get Started
                <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-500">
            More intelligent learning tools are on the way 🎓
          </p>
          <button
            onClick={() => navigate("/selection")}
            className="mt-6 text-sm p-4 rounded-4xl bg-red-300 cursor-pointer text-red-600 hover:underline"
          >
            ← Back to Mode Selection
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ExamBot;
