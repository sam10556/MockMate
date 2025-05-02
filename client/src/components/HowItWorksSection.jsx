import React from "react";
import { motion } from "framer-motion";

const StepItem = ({ number, title, description, delay }) => {
  return (
    <motion.div
      className="flex items-start gap-4 mb-6"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-xl mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      number: "1",
      title: "Upload Your Material",
      description: "Simply upload your resume or study material and let our AI analyze it."
    },
    {
      number: "2",
      title: "Smart Processing",
      description: "Our AI processes your data intelligently, identifying key points and opportunities."
    },
    {
      number: "3",
      title: "Get Actionable Results",
      description: "Receive personalized feedback, quizzes, notes, and guidance based on your material."
    }
  ];

  return (
    <section className="py-20 md:py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <img
              src="https://images.pexels.com/photos/7516363/pexels-photo-7516363.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Student working with AI"
              className="rounded-2xl shadow-lg w-full"
            />
          </motion.div>
          
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-lg text-gray-600">
                Our platform makes it easy to improve your skills with just a few simple steps.
              </p>
            </motion.div>
            
            <div>
              {steps.map((step, index) => (
                <StepItem
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;