import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Sky, 
  ContactShadows, 
  Stars,
  BakeShadows,
  Float
} from '@react-three/drei';
import Destination3D from './Destination3D';
import Route3D from './Route3D';

const Map3DView = ({ routes, destinations, selectedRouteId }) => {
  return (
    <div className="map-3d-wrapper" style={{ width: '100%', height: '100%', background: '#1a1a1a' }}>
      <Canvas 
        shadows 
        gl={{ antialias: true }}
      >
        {/* מצלמה הממוקמת בזווית שנותנת תחושת מרחב */}
        <PerspectiveCamera 
          makeDefault 
          position={[0, 50, 80]} 
          fov={35} 
        />
        
        {/* בקרת מצלמה חלקה עם הגבלות גובה למראה ריאליסטי */}
        <OrbitControls 
        enableDamping={true}
        dampingFactor={0.05}
        minDistance={5}        // מאפשר להתקרב מאוד לאדמה
        maxDistance={100}      // טווח זום החוצה
        maxPolarAngle={Math.PI / 2.1} // מאפשר להוריד את המבט לגובה העיניים
        enablePan={true}       // חשוב! מאפשר להזיז את המפה (ללחוץ על ימני ולגרור)
        panSpeed={1.5}
        />

        {/* אווירה: שמיים וכוכבים ללא צורך בנכסים חיצוניים */}
        <Sky 
          distance={450000} 
          sunPosition={[5, 10, 20]} 
          inclination={0.6} 
          azimuth={0.1} 
        />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

        {/* תאורה שכבתית למראה עמוק */}
        <ambientLight intensity={0.4} />
        <hemisphereLight intensity={0.4} color="#ffffff" groundColor="#444444" />
        <directionalLight 
          position={[20, 50, 20]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />

        <group scale={[0.85, 0.85, 0.85]}>
          
          {/* קרקע גן החיות - ירוק עמוק וטבעי */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
            <planeGeometry args={[120, 120]} />
            <meshStandardMaterial 
                color="#2d4a22" 
                roughness={1} 
                metalness={0}
            />
          </mesh>

          {/* צללים רכים ש"מדביקים" את האובייקטים לקרקע */}
          <ContactShadows 
            position={[0, 0, 0]} 
            opacity={0.5} 
            scale={120} 
            blur={2.5} 
            far={10} 
          />

          {/* רינדור שבילי ההליכה (בז') */}
          {routes?.map((route) => (
            <Route3D 
              key={route.id} 
              data={route} 
              isHighlighted={selectedRouteId === route.id} 
              isDimmed={selectedRouteId && selectedRouteId !== route.id}
            />
          ))}

          {/* רינדור נקודות העניין והחיות */}
          {destinations?.map((dest, i) => (
            <Destination3D 
              key={dest.id || i} 
              data={dest} 
              // צבעים המייצגים אזורים שונים בגן
              color={i % 3 === 0 ? "#8b5e34" : (i % 2 === 0 ? "#10b981" : "#f59e0b")} 
            />
          ))}

        
          
        </group>

        <BakeShadows />
      </Canvas>
    </div>
  );
};

export default Map3DView;