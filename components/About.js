"use client";

import React, { useEffect, useRef, useState } from "react";
import SkillIcon from "./SkillIcon";
import { motion } from "framer-motion";
import ScrollDownArrow from "./ScrollDownArrow";
import "devicon/devicon.min.css";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const aboutRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      if (aboutRef.current) {
        observer.unobserve(aboutRef.current);
      }
    };
  }, []);

  const languages = [
    { iconClass: "devicon-python-plain", name: "Python" },
    { iconClass: "devicon-javascript-plain", name: "JavaScript" },
    { iconClass: "devicon-java-plain", name: "Java" },
    { iconClass: "devicon-c-plain", name: "C" },
  ];
  
  const frontAndBackEndSkills = [
    { iconClass: "devicon-html5-plain", name: "HTML" },
    { iconClass: "devicon-css3-plain", name: "CSS" },
    { iconClass: "devicon-react-original", name: "React" },
    { iconClass: "devicon-nextjs-original-wordmark", name: "Next.js" },
    { iconClass: "devicon-postgresql-plain", name: "PostgreSQL" },
  ];

  const dataSkills = [
    { iconClass: "devicon-pytorch-original", name: "PyTorch" },
    { iconClass: "devicon-scikitlearn-plain", name: "Scikit-Learn" },
    { iconClass: "devicon-pandas-plain", name: "Pandas" },
    { iconClass: "devicon-numpy-plain", name: "NumPy" },
  ];

  return (
    <motion.section
      ref={aboutRef}
      id="about"
      className="relative h-screen py-16 mx-1/10-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 3 }}
    >
      <h2 className="text-5xl font-bold text-center">About Me</h2>
      <p className="mt-20 text-center text-xl">
        I am a recent Computer Science graduate from Columbia University with a strong foundation in full-stack development, data science, and machine learning. I’ve held several machine learning research and software engineering roles and have experience applying my knowledge in software and statistics to domains ranging from computational neuroscience to automatic speech recognition. Please feel free to reach out with any opportunities or simply to connect!
      </p>
      <div className="mt-20">
      <h3 className="text-3xl font-bold text-center mb-4">Languages</h3>
        <div className="flex flex-wrap justify-center mb-8">
          {languages.map((skill, index) => (
            <SkillIcon key={index} iconClass={skill.iconClass} name={skill.name} />
          ))}

        </div><h3 className="text-3xl font-bold text-center mb-4">Front and Back End</h3>
        <div className="flex flex-wrap justify-center mb-8">
          {frontAndBackEndSkills.map((skill, index) => (
            <SkillIcon key={index} iconClass={skill.iconClass} name={skill.name} />
          ))}
        </div>

        <h3 className="text-3xl font-bold text-center mb-4">Data Analysis and Machine Learning</h3>
        <div className="flex flex-wrap justify-center">
          {dataSkills.map((skill, index) => (
            <SkillIcon key={index} iconClass={skill.iconClass} name={skill.name} />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default About;
