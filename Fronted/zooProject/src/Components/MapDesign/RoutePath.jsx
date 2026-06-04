import React from 'react';
import { motion } from 'framer-motion';
import StatusDisplay from '.././ErrorDisplay/StatusDisplay';

const RoutePath = ({ route, isHighlighted, isDimmed, isOptimized = false }) => {
  if (!route || !route.bodyPoints || route.bodyPoints.length < 2) {
    return <StatusDisplay type="error" message="Route path data is missing or invalid." />;
  }

  const pathData = route.bodyPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  // Styling configuration
  const baseBeige = "#F5F5DC";
  const borderBeige = "#D2B48C";
  const highlightColor = "#E6C9A8";

  // If optimized, use a distinct color, otherwise use standard styling
  const strokeColor = isOptimized ? "#c09063ff" : (isHighlighted ? highlightColor : borderBeige);

  return (
    <g className={`map-path-group ${isOptimized ? 'optimized' : ''} ${isHighlighted ? 'highlighted' : ''} ${isDimmed ? 'dimmed' : ''}`}>
      <path
        className="path-main" // הוספנו את הקלאס החדש
        d={pathData}
        fill="none"
        stroke={strokeColor}
        opacity={isDimmed ? 0.2 : 0.8}
      />
      <motion.path
        className="path-motion" // הוספנו את הקלאס החדש
        d={pathData}
        fill="none"
        stroke={isOptimized ? "#d8c5b0ff" : baseBeige}
        initial={isHighlighted || isOptimized ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
        animate={{ pathLength: 1, opacity: isDimmed ? 0.3 : 1 }}
        transition={{ duration: 1.5, ease: "linear" }}
      />
    </g>
  );
};

export default RoutePath;