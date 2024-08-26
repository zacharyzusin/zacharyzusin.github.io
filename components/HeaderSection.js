"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import ScrollDownArrow from "./ScrollDownArrow";
import { motion } from "framer-motion";

const HeaderSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={headerRef}
      className="flex flex-col items-center justify-center h-screen mx-1/10-screen relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 3 }}
    >
      <div className="flex flex-col md:flex-row w-full items-center justify-between h-full">
        <div className="flex flex-col items-center md:items-start w-full md:w-1/2 mt-16 md:mt-0">
          <h1 className="text-6xl md:text-8xl font-bold text-center md:text-left">
            Zachary Zusin
          </h1>
          <div className="mt-8 flex space-x-6 justify-center md:justify-start">
            <a
              href="https://github.com/zacharyzusin"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-16 h-16 bg-gray-800 text-white rounded-full hover:bg-gray-700 shadow-glow"
            >
              <FontAwesomeIcon icon={faGithub} size="2x" />
            </a>
            <a
              href="https://linkedin.com/in/zachary-zusin"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-16 h-16 bg-gray-800 text-white rounded-full hover:bg-gray-700 shadow-glow"
            >
              <FontAwesomeIcon icon={faLinkedin} size="2x" />
            </a>
            <a
              href="mailto:zacharyzusin@gmail.com"
              className="flex items-center justify-center w-16 h-16 bg-gray-800 text-white rounded-full hover:bg-gray-700 shadow-glow"
            >
              <FontAwesomeIcon icon={faEnvelope} size="2x" />
            </a>
          </div>
        </div>
        <div className="flex items-center justify-center w-full md:w-1/2 mt-8">
          <Image
            src="/assets/zacharyzusin2.jpeg"
            alt="Zachary Zusin"
            className="rounded-full border-4 border-gray-600 shadow-glow"
            width={400}
            height={400}
            priority
          />
        </div>
      </div>
    </motion.div>
  );
};

export default HeaderSection;
