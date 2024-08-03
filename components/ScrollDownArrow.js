"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const ScrollDownArrow = ({ targetId }) => {
  const handleScroll = () => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={handleScroll}
      className="flex items-center justify-center w-16 h-16 bg-gray-800 text-white rounded-full hover:bg-gray-700"
    >
      <FontAwesomeIcon icon={faChevronDown} size="2x" />
    </button>
  );
};

export default ScrollDownArrow;
