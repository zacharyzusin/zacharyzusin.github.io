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
  
  const frontEndSkills = [
    { iconClass: "devicon-html5-plain", name: "HTML" },
    { iconClass: "devicon-css3-plain", name: "CSS" },
    { iconClass: "devicon-react-original", name: "React" },
    { iconClass: "devicon-nextjs-original-wordmark", name: "Next.js" },
  ];

  const backEndSkills = [
    { iconClass: "devicon-postgresql-plain", name: "PostgreSQL" },
  ];

  const machineLearningSkills = [
    { iconClass: "devicon-pytorch-original", name: "PyTorch" },
    { iconClass: "devicon-pandas-plain", name: "Pandas" },
    { iconClass: "devicon-numpy-plain", name: "NumPy" },
    { iconClass: "devicon-scikitlearn-plain", name: "Scikit-Learn" },
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
        I'm currently a senior at Columbia University studying Computer Science and competing on Columbia's Division 1 Fencing Team. I'm interested in Machine Learning and Data Science, as well as the many applications they have in all industries.
      </p>
      <div className="mt-20">
      <h3 className="text-3xl font-bold text-center mb-4">Languages</h3>
        <div className="flex flex-wrap justify-center mb-8">
          {languages.map((skill, index) => (
            <SkillIcon key={index} iconClass={skill.iconClass} name={skill.name} />
          ))}

        </div><h3 className="text-3xl font-bold text-center mb-4">Front End</h3>
        <div className="flex flex-wrap justify-center mb-8">
          {frontEndSkills.map((skill, index) => (
            <SkillIcon key={index} iconClass={skill.iconClass} name={skill.name} />
          ))}
        </div>

        <h3 className="text-3xl font-bold text-center mb-4">Back End</h3>
        <div className="flex flex-wrap justify-center mb-8">
          {backEndSkills.map((skill, index) => (
            <SkillIcon key={index} iconClass={skill.iconClass} name={skill.name} />
          ))}
        </div>

        <h3 className="text-3xl font-bold text-center mb-4">Machine Learning</h3>
        <div className="flex flex-wrap justify-center">
          {machineLearningSkills.map((skill, index) => (
            <SkillIcon key={index} iconClass={skill.iconClass} name={skill.name} />
          ))}
        </div>
      </div>
      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <ScrollDownArrow targetId="projects" />
      </div>
    </motion.section>
  );
};

export default About;
