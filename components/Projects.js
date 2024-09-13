"use client";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";

const projectsData = [
  {
    title: "Action Segmentation and Behavioral Analysis in Mice",
    description: "This is the code I wrote for my Computational Neuroscience Research internship in which I developed diagnostics to assess the efficacy of Temporal Convolutional Network (TCN) models in predicting behavioral states of mice.",
    image: "/assets/Diagnostics.png",
    githubLink: "https://github.com/zacharyzusin/Neuroscience-Research",
    technologies: ["Python", "Machine Learning", "Data Visualization"],
  },
  {
    title: "Exploring the Determinants of Life Expectancy",
    description: "This project develops a statistical model to examine the relationship between life expectancy and various social, economic, political, and geographic variables.",
    image: "/assets/353232171-fbefc5a0-bb55-4855-b5f2-c885bcf78dcc.png",
    githubLink: "https://github.com/zacharyzusin/Linear-Regression-Models-Project",
    technologies: ["R", "Linear Regression Models"],
  },
  {
    title: "Wikipedia Article Clustering",
    description: "This project fetches and preprocesses Wikipedia articles, converts the text into semantic embeddings using Sentence-BERT, and then applies UMAP for dimensionality reduction and K-Means clustering. It then creates an interactive scatter plot that visualizes the clustered articles, allowing users to explore their relationships based on semantic similarity.",
    image: "/assets/newplot.png",
    githubLink: "https://github.com/zacharyzusin/Wikipedia-Article-Clustering",
    technologies: ["Python", "Natural Language Processing", "Scikit-Learn"],
  },
  {
    title: "Home Cooking Helper",
    description: "This web application serves as a comprehensive platform for home cooking, where users can receive guidance on anything they would need to know to prepare food in the comfort of their own home.",
    image: "/assets/353242587-5287105b-1b64-4bfd-a44b-97717ae5a652.jpg",
    githubLink: "https://github.com/zacharyzusin/Home-Cooking-Helper",
    technologies: ["Python", "PostgreSQL", "Flask", "HTML", "CSS", "JavaScript"],
  },
  {
    title: "Wonderful Workouts",
    description: "This web application serves as a platform to teach individuals the basics of weight training, allowing users to learn new exercises and create their own custom workouts.",
    image: "/assets/353245339-bbbf3908-b6bc-4a0b-8266-de1f74e5122d.png",
    githubLink: "https://github.com/zacharyzusin/Wonderful-Workouts",
    technologies: ["HTML", "CSS", "JavaScript"],
  },
  {
    title: "Personal Portfolio",
    description: "This website! I designed and created this site from scratch using Next.js, Tailwind CSS, and Framer Motion.",
    image: "/assets/website.jpeg",
    githubLink: "https://github.com/zacharyzusin/zacharyzusin.github.io",
    technologies: ["Next.js", "Tailwind CSS", "Framer Motion"],
  },
];

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const projectsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (projectsRef.current) {
      observer.observe(projectsRef.current);
    }

    return () => {
      if (projectsRef.current) {
        observer.unobserve(projectsRef.current);
      }
    };
  }, []);

  return (
    <motion.section
      ref={projectsRef}
      id="projects"
      className="min-h-screen py-8 mx-1/10-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 3 }}
    >
      <h2 className="text-5xl font-bold mt-16 text-center">Projects</h2>
      <div className="flex flex-wrap justify-center mt-8">
        {projectsData.map((project, index) => (
          <div
            key={index}
            className="max-w-md p-4 m-4 bg-gray-700 rounded-lg shadow-md hover:shadow-glow transition-shadow duration-300 ease-in-out"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-2xl font-bold">{project.title}</h3>
              <p className="mt-2">{project.description}</p>
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                <FontAwesomeIcon icon={faGithub} className="mr-2" />
                View on GitHub
              </a>
              <div className="mt-4">
                {project.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="inline-block px-2 py-1 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full mb-2"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default Projects;
