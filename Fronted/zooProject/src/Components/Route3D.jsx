import React, { useMemo } from 'react';
import * as THREE from 'three';

const Route3D = ({ data, isHighlighted, isDimmed }) => {
  const pointsData = data.bodyPoints || [];
  
  const { geometry } = useMemo(() => {
    if (pointsData.length < 2) return {};

    const points = pointsData.map(p => new THREE.Vector3(
      parseFloat(p.x) - 50,
      0, // הבסיס בגובה אפס
      parseFloat(p.y) - 50
    ));

    const curve = new THREE.CatmullRomCurve3(points);
    
    /**
     * שינוי הפרמטרים של הצינור:
     * 1. רדיוס גדול יותר (1.5 במקום 0.5) יוצר שביל רחב.
     * 2. מספר צלעות נמוך (Radial Segments: 3 או 4) בשילוב עם Scale מאפשר לשטח אותו.
     */
    const geo = new THREE.TubeGeometry(curve, 128, 1.2, 8, false); 
    return { geometry: geo };
  }, [pointsData]);

  if (!geometry) return null;

  return (
    <mesh 
      geometry={geometry} 
      receiveShadow 
      /* הפשטת הצינור: אנחנו מועכים את ציר ה-Y כדי שזה ייראה כמו שביל שטוח ולא צינור עגול */
      scale={[1, 0.1, 1]} 
      position={[0, 0.02, 0]} // הגבהה קטנטנה מעל הדשא
    >
      <meshStandardMaterial 
        color={isHighlighted ? "#F5DEB3" : "#D2B48C"} // צבע חול/בז' טבעי
        roughness={1}
        metalness={0}
        opacity={isDimmed ? 0.4 : 1}
        transparent={isDimmed}
      />
    </mesh>
  );
};

export default Route3D;