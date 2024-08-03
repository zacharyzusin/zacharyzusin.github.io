import React, { useState } from "react";

const SkillIcon = ({ iconClass, name }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center m-2">
        <i className={`${iconClass} colored text-5xl`} />
      </div>
      {isHovered && (
        <span className="absolute mt-2 bg-gray-700 text-white text-sm rounded px-2 py-1">
          {name}
        </span>
      )}
    </div>
  );
};

export default SkillIcon;
