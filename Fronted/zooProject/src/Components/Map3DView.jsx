import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, PerspectiveCamera, Sky, Cloud,
  ContactShadows, Stars, BakeShadows
} from '@react-three/drei';
import Destination3D from './Destination3D';
import Route3D from './Route3D';

const NatureElement = ({ position }) => (
  <group position={position} scale={0.7 + Math.random()}>
    <mesh position={[0, 1, 0]} castShadow>
      <cylinderGeometry args={[0.12, 0.28, 2, 6]} />
      <meshStandardMaterial color="#3d2b1f" roughness={0.9} />
    </mesh>
    <mesh position={[0, 2.8, 0]} castShadow>
      <sphereGeometry args={[1.4, 8, 8]} />
      <meshStandardMaterial 
        color="#15803d" 
        roughness={1} 
      />
    </mesh>
  </group>
);

const Map3DView = ({ routes, destinations, selectedRouteId }) => {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#7cd1f9' }}>
      <Canvas 
        shadows 
        // toneMappingExposure נקבע ל-1.4 כדי להגביר את בהירות המצלמה הכללית
        gl={{ antialias: true, toneMappingExposure: 1.4 }}
      >
        <PerspectiveCamera makeDefault position={[55, 55, 55]} fov={35} />
        
        <OrbitControls 
          enableDamping
          maxPolarAngle={Math.PI / 2.2} 
          minDistance={15} 
          maxDistance={150} 
        />

        {/* הגדרות שמיים כחולים עם שמש גבוהה ובוהקת */}
        <Sky 
          distance={450000}
          sunPosition={[0, 1, 0]} // מיקום שמש ישיר מעל הראש לאור חזק
          turbidity={0.01} // שמיים נקיים לחלוטין מאובך
          rayleigh={1.5} // צבע כחול קלאסי ובהיר לשמיים
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />
        
        {/* עננים לבנים ורכים שמשתלבים ביום השמש */}
        <Cloud position={[-20, 35, -40]} speed={0.1} opacity={0.8} color="#ffffff" />
        <Cloud position={[40, 30, 20]} speed={0.12} opacity={0.7} color="#ffffff" />

        {/* מערך תאורה עוצמתי במיוחד */}
        <ambientLight intensity={1.2} /> {/* תאורת סביבה גבוהה שמבטלת פינות חשוכות */}
        <directionalLight 
          position={[40, 120, 40]} // מקור האור תואם למיקום השמש
          intensity={2.8} // עוצמת אור שמש חזקה במיוחד
          castShadow 
          shadow-mapSize={[2048, 2048]} 
          color="#ffffff" // אור לבן ונקי
        />

        <group scale={0.9}>
          {/* דשא ירוק וחי */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
            <planeGeometry args={[250, 250]} />
            <meshStandardMaterial color="#22c55e" roughness={0.8} />
          </mesh>

          {Array.from({ length: 55 }).map((_, i) => (
            <NatureElement key={i} position={[
              (Math.random() - 0.5) * 180, 
              0, 
              (Math.random() - 0.5) * 180
            ]} />
          ))}

          <Suspense fallback={null}>
            {routes?.map((route) => (
              <Route3D 
                key={route.id} 
                data={route} 
                isHighlighted={selectedRouteId === route.id} 
                isDimmed={selectedRouteId && selectedRouteId !== route.id}
              />
            ))}

            {destinations?.map((dest, i) => (
              <Destination3D 
                key={dest.id || i} 
                data={dest} 
                color="#2563eb" // תגיות כחולות בולטות
              />
            ))}
          </Suspense>

          {/* צללים רכים שלא מחשיכים את הדשא יותר מדי */}
          <ContactShadows position={[0, 0.01, 0]} opacity={0.3} scale={200} blur={3} far={15} />
        </group>

        <BakeShadows />
      </Canvas>
    </div>
  );
};

export default Map3DView;