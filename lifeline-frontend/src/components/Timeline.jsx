"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";

const Timeline = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2010;

  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Generate years array
  const years = useMemo(() => {
    return Array.from(
      { length: currentYear - startYear + 1 },
      (_, i) => startYear + i
    );
  }, [startYear, currentYear]);
  console.log(years);

  // Calculate progress percentage
  const progress = useMemo(() => {
    return ((selectedYear - startYear) / (currentYear - startYear)) * 100;
  }, [selectedYear, startYear, currentYear]);

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };

  return (
    <div className="w-full mb-4">
      <div className="relative w-full">
        {/* Timeline Background */}
        <div className="bg-gray-700 rounded-full h-2 absolute w-full top-1/2 transform -translate-y-1/2" />

        {/* Progress Indicator */}
        <motion.div
          className="bg-blue-500 rounded-full h-2 absolute top-1/2 transform -translate-y-1/2"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />

        {/* Year Slider */}
        <input
          type="range"
          min={startYear}
          max={currentYear}
          value={selectedYear}
          onChange={handleYearChange}
          className="w-full h-2 bg-transparent appearance-none cursor-pointer z-10 relative"
          style={{
            WebkitAppearance: "none",
            background: "transparent",
          }}
        />

        {/* Year Display */}
        <div className="flex justify-between text-sm text-gray-400 mt-4">
          <span>{startYear}</span>
          <span className="text-blue-400 font-bold">{selectedYear}</span>
          <span>{currentYear}</span>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
