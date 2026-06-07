import React, { useMemo } from 'react';
import * as THREE from 'three';

const Route3D = ({ data, isHighlighted, isDimmed, color = "#f59e0b" }) => {
  const pointsData = useMemo(() => {
    const rawPoints = data.bodyPoints || [];
    return rawPoints.filter(p => p && typeof p.x !== 'undefined' && typeof p.y !== 'undefined');
  }, [data]);

  const { geometry, gravelPositions } = useMemo(() => {
    if (pointsData.length < 2) return { geometry: null, gravelPositions: [] };

    const points = pointsData.map(p => new THREE.Vector3(
      parseFloat(p.x) - 50,
      0,
      parseFloat(p.y) - 50
    ));

    const curve = new THREE.CatmullRomCurve3(points);
    const geo = new THREE.TubeGeometry(curve, 128, 1.4, 8, false);

    const gravel = [];
    const sampling = 150;
    
    for (let i = 0; i <= sampling; i++) {
      const t = i / sampling;
      const point = curve.getPoint(t);
      const tangent = curve.getTangent(t);
      const normal = new THREE.Vector3(0, 1, 0).cross(tangent).normalize();

      [-1.6, 1.6].forEach(sideOffset => {
        for(let j = 0; j < 2; j++) {
          gravel.push({
            pos: [
              point.x + (normal.x * sideOffset) + (Math.random() * 0.4 - 0.2),
              0.05,
              point.z + (normal.z * sideOffset) + (Math.random() * 0.4 - 0.2)
            ],
            scale: 0.04 + Math.random() * 0.08,
            color: j % 2 === 0 ? "#9ca3af" : "#6b7280"
          });
        }
      });
    }
    
    return { geometry: geo, gravelPositions: gravel };
  }, [pointsData]);

  if (!geometry) return null;

  return (
    <group>
      <mesh geometry={geometry} receiveShadow scale={[1, 0.01, 1]} position={[0, 0.05, 0]}>
        <meshStandardMaterial 
          color={isHighlighted ? color : "#7c6c5a"} 
          roughness={1} 
          transparent 
          opacity={isDimmed ? 0.4 : 1}
          emissive={isHighlighted ? color : "#000"}
          emissiveIntensity={isHighlighted ? 0.5 : 0}
        />
      </mesh>

      {gravelPositions.map((stone, idx) => (
        <mesh key={idx} position={stone.pos} scale={stone.scale} castShadow>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={stone.color} roughness={1} />
        </mesh>
      ))}
    </group>
  );
};

export default Route3D;