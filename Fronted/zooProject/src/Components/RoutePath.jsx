import React from 'react';
import { motion } from 'framer-motion';

const RoutePath = ({ route }) => {
  if (!route.bodyPoints || route.bodyPoints.length < 2) return null;

  // הפיכת מערך הנקודות למחרוזת ש-SVG מבין (Path Data)
  // דוגמה: "M 10 20 L 30 40 L 50 60"
  const pathData = route.bodyPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <g>
      {/* הקו האחורי - משמש כ"צל" או מסילה */}
      <path
        d={pathData}
        fill="none"
        stroke="#e0e0e0"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* הקו האקטיבי - מצויר באנימציה
      <motion.path
        d={pathData}
        fill="none"
        stroke="#4CAF50" // צבע ירוק "גן חיות"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      /> */}
    </g>
  );
};

export default RoutePath;