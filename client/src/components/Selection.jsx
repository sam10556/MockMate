import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mic, BookOpen } from "lucide-react";

const features = [
  {
    title: "Interview Prep",
    description: "Face an AI-powered mock interview tailored to your resume.",
    icon: <Mic size={36} className="text-indigo-600" />,
    navigateTo: "/interview",
    color: "from-indigo-100 to-indigo-200",
    highlights: ["Resume analyzer", "Real-time feedback", "Custom questions"],
  },
  {
    title: "Exam Practice",
    description: "Upload your notes, generate quizzes and learn smarter.",
    icon: <BookOpen size={36} className="text-green-600" />,
    navigateTo: "/exam",
    color: "from-green-100 to-green-200",
    highlights: ["MCQ Generator", "Smart Notes", "Topic Explanation"],
  },
];

const Selection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white py-12 px-6 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute -top-40 -left-32 w-[400px] h-[400px] bg-purple-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-40 -right-32 w-[400px] h-[400px] bg-indigo-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse delay-1000"></div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14 relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
          How would you like to prep today?
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
          Choose a smart preparation mode and let AI do the heavy lifting.
        </p>
      </motion.div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 relative z-10">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + idx * 0.15, duration: 0.5 }}
            className={`rounded-3xl bg-gradient-to-br ${feature.color} p-8 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer`}
            onClick={() => navigate(feature.navigateTo)}
          >
            <div className="flex flex-col items-start text-left space-y-4">
              <div className="bg-white p-3 rounded-full shadow-sm">
                {feature.icon}
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {feature.title}
              </h2>
              <p className="text-gray-600">{feature.description}</p>

              {/* Highlights */}
              <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
                {feature.highlights.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>

              <button className="mt-4 px-5 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-800 transition">
                Get Started →
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Encouragement */}
      <div className="text-center mt-20 text-gray-500 text-sm z-10 relative">
        <p>More prep features coming soon. Stay tuned 👀</p>
      </div>
    </div>
  );
};

export default Selection;
