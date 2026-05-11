import React from 'react';
import { motion } from 'framer-motion';

const RoutePath = ({ route, isHighlighted, isDimmed }) => {
  if (!route.bodyPoints || route.bodyPoints.length < 2) return null;

  const pathData = route.bodyPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  // Classic Map Palette
  const baseBeige = "#F5F5DC";      // Light Cream/Beige
  const borderBeige = "#D2B48C";    // Darker Tan for the "road" edges
  const highlightColor = "#E6C9A8"; // Warm highlight

  return (
    <g className={`map-path-group ${isHighlighted ? 'highlighted' : ''} ${isDimmed ? 'dimmed' : ''}`}>
      
      {/* 1. The Outer "Border" of the route - makes it look like a real road */}
      <path
        d={pathData}
        fill="none"
        stroke={isHighlighted ? highlightColor : borderBeige}
        strokeWidth={isHighlighted ? "6" : "5"} 
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={isDimmed ? 0.2 : 0.8}
        style={{ transition: 'all 0.4s ease' }}
      />

      {/* 2. The Main Route Body (Inner Path) */}
      <motion.path
        d={pathData}
        fill="none"
        stroke={baseBeige}
        strokeWidth={isHighlighted ? "3.5" : "3"}
        // Using "round" linecap and join is crucial for the "one route" look
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={isHighlighted ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
        animate={{ 
            pathLength: 1, 
            opacity: isDimmed ? 0.3 : 1 
        }}
        transition={{ duration: 1.5, ease: "linear" }}
      />
    </g>
  );
};

export default RoutePath;