import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative text-center py-24 px-6 bg-gradient-to-br from-blue-100 via-white to-purple-100 overflow-hidden">
        {/* SVG blob background */}
        <svg
          className="absolute top-[-50px] left-[-100px] w-[300px] opacity-30"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#a5b4fc"
            d="M44.8,-61.1C57.2,-52.7,65.2,-38.2,69.2,-23.7C73.1,-9.2,73,5.3,66.9,17.8C60.9,30.4,48.8,41,35.2,51.3C21.6,61.7,6.5,71.9,-8.5,74.1C-23.4,76.3,-37.9,70.6,-49.1,60.1C-60.2,49.6,-68,34.3,-71.6,18.5C-75.2,2.8,-74.6,-13.4,-68.2,-27.7C-61.9,-42.1,-49.8,-54.6,-35.3,-63.4C-20.7,-72.3,-3.9,-77.6,11.7,-77.5C27.3,-77.5,41.6,-72.5,44.8,-61.1Z"
            transform="translate(100 100)"
          />
        </svg>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 z-10 relative">
            Ace Interviews. Level Up Studies.
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-700">
            Your personal AI assistant to crack interviews, analyze resumes,
            study smarter & test better.
          </p>
          <div className="flex justify-center gap-4 z-10 relative">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
            <Link to={'/selection'}>
              Get Started
            </Link>
            </button>
            {/* <button className="bg-white border border-gray-400 px-6 py-3 rounded-xl hover:bg-gray-100 transition">
              Try Demo
            </button> */}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-white via-indigo-50 to-blue-50 overflow-hidden">

        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-semibold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto relative z-10">
            {[
              ["🧠", "AI Interviews", "Simulate real interview scenarios"],
              ["📄", "Resume Analyzer", "Get smart feedback instantly"],
              ["📚", "Study with AI", "Turn PDFs into quizzes & summaries"],
              ["✍️", "Auto Notes", "Make clean, sharable notes easily"],
            ].map(([emoji, title, desc]) => (
              <motion.div
                key={title}
                className="p-6 border bg-white/80 backdrop-blur rounded-2xl shadow-md hover:shadow-lg transition"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-4">{emoji}</div>
                <h3 className="font-semibold text-xl mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-indigo-50 to-purple-100 overflow-hidden">
        {/* Blob Background */}
        <svg
          className="absolute -bottom-10 -right-10 w-[300px] opacity-20"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#8b5cf6"
            d="M42.2,-73.2C56.2,-67.1,70.6,-56.3,77.5,-42.1C84.3,-27.9,83.5,-10.3,78.4,5.3C73.4,20.9,64.2,34.5,52.8,45.2C41.4,55.9,27.7,63.7,13.4,67.8C-0.9,71.9,-15.9,72.4,-28.1,66.6C-40.3,60.9,-49.8,48.9,-57.6,36.1C-65.5,23.3,-71.6,9.6,-72.8,-5.1C-74,-19.9,-70.3,-35.6,-61.3,-47.1C-52.4,-58.6,-38.3,-65.9,-23.4,-70.7C-8.5,-75.5,7.2,-77.9,22.8,-76.5C38.4,-75.1,54,-70,42.2,-73.2Z"
            transform="translate(100 100)"
          />
        </svg>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 relative z-10">
          <img
            src="/illustration.svg" // You can replace this with another from undraw.co
            alt="Illustration"
            className="w-full md:w-1/2"
          />
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h2 className="text-3xl font-semibold mb-6">How It Works</h2>
            <ul className="space-y-4 text-gray-700 text-lg">
              <li>
                📁 <strong>Upload</strong> your resume or study material
              </li>
              <li>
                🤖 <strong>Let AI process</strong> your data smartly
              </li>
              <li>
                📊 <strong>Get results</strong> – feedback, quizzes, notes
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-center py-20 px-6 bg-blue-50"
      >
        <h2 className="text-3xl font-semibold mb-4">Start Your Prep Journey</h2>
        <p className="text-gray-700 mb-6 max-w-xl mx-auto">
          Join hundreds of students preparing smarter and better with AI.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
          <Link to={'/selection'}>
          Get Started
          </Link>
        </button>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Prep Nest. Built with 💙 by your team.
      </footer>
    </div>
  );
}
