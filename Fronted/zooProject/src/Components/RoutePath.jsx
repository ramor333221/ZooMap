import React from 'react';
import { motion } from 'framer-motion';

const RoutePath = ({ route, isHighlighted, isDimmed }) => {
  if (!route.bodyPoints || route.bodyPoints.length < 2) return null;

  const pathData = route.bodyPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <g>
      {/* קו רקע שקוף למחצה - עוזר לראות את הנתיב הכללי */}
      <path
        d={pathData}
        fill="none"
        stroke={isHighlighted ? "#007AFF" : "#e0e0e0"}
        strokeWidth={isHighlighted ? "3" : "4"}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={isHighlighted ? 0.3 : (isDimmed ? 0.1 : 0.4)}
        style={{ transition: 'all 0.3s' }}
      />

      {/* הקו האקטיבי/המודגש */}
      <motion.path
        d={pathData}
        fill="none"
        stroke={isHighlighted ? "#007AFF" : "#4CAF50"} // כחול למסלול נבחר, ירוק לרגיל
        strokeWidth={isHighlighted ? "2.5" : "2"}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={isHighlighted ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 0.6 }}
        animate={{ 
            pathLength: 1, 
            opacity: isHighlighted ? 1 : (isDimmed ? 0.2 : 0.6) 
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </g>
  );
};

export default RoutePath;