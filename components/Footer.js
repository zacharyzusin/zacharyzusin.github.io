// components/Footer.js
"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons"; 
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"; 

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center">
      <p className="text-sm mb-2">
        &copy; {new Date().getFullYear()} Zachary Zusin
      </p>
      {/* Social Media Buttons */}
      <div className="flex justify-center space-x-6 mb-2">
        <a
          href="https://github.com/zacharyzusin"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-8 h-8 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faGithub} size="lg" />
        </a>
        <a
          href="https://linkedin.com/in/zachary-zusin"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-8 h-8 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faLinkedin} size="lg" />
        </a>
        <a
          href="mailto:zacharyzusin@gmail.com"
          className="flex items-center justify-center w-8 h-8 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faEnvelope} size="lg" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
