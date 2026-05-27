import React, { useState } from 'react';
import * as THREE from 'three';
import { Billboard, useTexture, Html, Float } from '@react-three/drei';

const Destination3D = ({ data, color }) => {
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(`/${data.picUrl}`);

  const posX = (data.location?.x ?? data.x) - 50;
  const posZ = (data.location?.y ?? data.y) - 50;

  if (isNaN(posX) || isNaN(posZ)) return null;

  return (
    <group position={[posX, 0, posZ]}>
      {/* Vibrant Pedestal */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.8, 2.2, 0.4, 8]} />
        <meshStandardMaterial color="#4b3621" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Animated Animal Image */}
      <Float speed={hovered ? 5 : 2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Billboard position={[0, 2, 0]}>
          <mesh 
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <planeGeometry args={[3.2, 3.2]} />
            <meshStandardMaterial 
              map={texture} 
              transparent={true} 
              alphaTest={0.5} 
              side={THREE.DoubleSide}
              emissive="#ffffff"
              emissiveIntensity={hovered ? 0.2 : 0}
            />
          </mesh>
        </Billboard>
      </Float>

      {/* Styled Label */}
      <Html position={[0, 4, 0]} center distanceFactor={8}>
        <div style={{
          background: color,
          color: 'white',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap'
        }}>
          {data.name}
        </div>
      </Html>
    </group>
  );
};

export default Destination3D;