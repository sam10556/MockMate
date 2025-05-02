import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, FileText, BookOpen, PenLine } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, index }) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg p-8 transition-all duration-300 border border-gray-100 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-12 -mt-12 transition-all duration-300 group-hover:bg-blue-100"></div>

      <div className="relative">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 text-blue-600 mb-5 transition-all duration-300 group-hover:bg-blue-100">
          <Icon size={24} strokeWidth={1.5} />
        </div>

        <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: BrainCircuit,
      title: "AI Interviews",
      description:
        "Simulate real interview scenarios with AI-powered feedback.",
    },
    {
      icon: FileText,
      title: "Resume Analyzer",
      description: "Get smart feedback on your resume instantly.",
    },
    {
      icon: BookOpen,
      title: "Study with AI",
      description: "Turn PDFs into interactive quizzes & concise summaries.",
    },
    {
      icon: PenLine,
      title: "Auto Notes",
      description: "Create clean, shareable notes with minimal effort.",
    },
  ];

  return (
    <section className="py-20 md:py-28 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tools designed to help you succeed in your academic and professional
            journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
