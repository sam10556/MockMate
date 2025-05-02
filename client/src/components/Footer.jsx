import React from "react";

const Footer = () => {
  return (
    <footer className="py-12 px-6 bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Prep Nest</h3>
            <p className="text-gray-400 mb-4">
              Your AI-powered companion for academic and professional
              excellence.
            </p>
            <p className="text-gray-500">
              © {new Date().getFullYear()} Prep Nest. All rights reserved.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  AI Interviews
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  Resume Analysis
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  Study Tools
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  Auto Notes
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">support@prepnest.com</li>
              <li className="text-gray-400">Privacy Policy</li>
              <li className="text-gray-400">Terms of Service</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
