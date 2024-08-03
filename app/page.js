// page.js
"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import HeaderSection from "../components/HeaderSection";
import About from "../components/About";
import Projects from "../components/Projects";
import Footer from "../components/Footer";
import ParticlesBackground from "../components/ParticlesBackground";

export default function Home() {
  const [selectedSection, setSelectedSection] = useState(null);

  return (
    <main className="flex flex-col min-h-screen relative">
      {/* Particles Background */}
      <ParticlesBackground />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <HeaderSection />
        <section id="about">
          <About />
        </section>
        <section id="projects">
          <Projects />
        </section>
        <Footer />
      </div>
    </main>
  );
}
