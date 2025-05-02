import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <motion.div 
        className="max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Prep Journey Today</h2>
        <p className="text-lg md:text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
          Join hundreds of students preparing smarter and performing better with our AI-powered tools.
        </p>
        <Link to="/selection">
          <motion.button 
            className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
};

export default CTASection;