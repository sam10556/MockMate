import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mic, BookOpen, ArrowRight } from "lucide-react";

const features = [
  {
    title: "Interview Preparation",
    description:
      "Master your interviews with AI-powered mock sessions tailored to your experience.",
    icon: <Mic className="text-blue-600" size={32} />,
    navigateTo: "/interview",
    color: "from-blue-50 to-blue-100",
    borderColor: "border-blue-200",
    highlights: [
      "Smart resume analysis",
      "Personalized questions",
      "Real-time feedback",
    ],
  },
  {
    title: "Study Assistant",
    description:
      "Transform your study materials into interactive learning experiences.",
    icon: <BookOpen className="text-emerald-600" size={32} />,
    navigateTo: "/exam",
    color: "from-emerald-50 to-emerald-100",
    borderColor: "border-emerald-200",
    highlights: [
      "AI-powered quizzes",
      "Smart note generation",
      "Topic explanations",
    ],
  },
];

const Selection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Learning Path
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a preparation mode and let our AI assist you in achieving
            your goals.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              onClick={() => navigate(feature.navigateTo)}
              className={`relative group rounded-2xl bg-gradient-to-br ${feature.color} border ${feature.borderColor} p-8 hover:shadow-lg transition-all duration-300 cursor-pointer`}
            >
              {/* Icon */}
              <div className="bg-white rounded-xl p-3 w-fit shadow-sm mb-6">
                {feature.icon}
              </div>

              {/* Content */}
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h2>
              <p className="text-gray-600 mb-6">{feature.description}</p>

              {/* Highlights */}
              <ul className="space-y-2 mb-8">
                {feature.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-center text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2" />
                    {highlight}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button className="flex items-center gap-2 px-6 py-2.5 bg-white text-gray-900 rounded-full font-medium shadow-sm group-hover:shadow group-hover:translate-x-1 transition-all duration-300">
                Get Started
                <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-500">
            More learning features coming soon. Stay tuned! ✨
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Selection;
