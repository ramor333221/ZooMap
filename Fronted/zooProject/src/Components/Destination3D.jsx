import React, { useState } from 'react';
import * as THREE from 'three';
import { Billboard, useTexture, Html } from '@react-three/drei';

const Destination3D = ({ data, color }) => {
  const [hovered, setHovered] = useState(false);
  
  // מיקום המשתנה לפי נתוני המפה
  const posX = (data.location?.x ?? data.x) - 50;
  const posZ = (data.location?.y ?? data.y) - 50;
  
  // טעינת התמונה של החיה
  const texture = useTexture(`/${data.picUrl}`);

  if (isNaN(posX) || isNaN(posZ)) return null;

  return (
    <group position={[posX, 0, posZ]}>
      
      {/* בסיס התצוגה - סלע או משטח עליו החיה "עומדת" */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.8, 0.2, 32]} />
        <meshStandardMaterial color="#555" roughness={0.8} />
      </mesh>

      {/* החיה עצמה - מוצבת כ-Billboard כדי שתמיד יראו אותה */}
      <Billboard
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
        position={[0, 1.4, 0]} // מגביה את מרכז התמונה כך שהרגליים יגעו בבסיס
      >
        <mesh 
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {/* גודל התמונה - התאמה לפי הצורך (כאן 2.8 על 2.8) */}
          <planeGeometry args={[2.8, 2.8]} />
          <meshBasicMaterial 
            map={texture} 
            transparent={true} 
            side={THREE.DoubleSide}
            alphaTest={0.5} // חותך את השקיפות מסביב לחיה
          />
        </mesh>
      </Billboard>

      {/* שלט הסבר קטן ליד החיה (כמו בגן חיות) */}
      <group position={[1.5, 0.2, 1]} rotation={[0, Math.PI / 4, 0]}>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.1, 0.6, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <Html transform position={[0, 0.6, 0]} distanceFactor={5}>
          <div style={{
            background: '#f0f0f0',
            padding: '2px 8px',
            border: '1px solid #333',
            fontSize: '8px',
            fontWeight: 'bold',
            color: '#222',
            whiteSpace: 'nowrap'
          }}>
            {data.name}
          </div>
        </Html>
      </group>

      {/* צל דקורטיבי מסביב למתחם */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} />
      </mesh>

    </group>
  );
};

export default Destination3D;