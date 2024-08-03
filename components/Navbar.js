import React from 'react';

const handleScrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="text-lg font-bold">ZZ</div>
      <div className="space-x-4">
        <button onClick={() => handleScrollToSection('about')} className="hover:text-gray-400">
          About
        </button>
        <button onClick={() => handleScrollToSection('projects')} className="hover:text-gray-400">
          Projects
        </button>
      </div>
    </nav>
  );
}
