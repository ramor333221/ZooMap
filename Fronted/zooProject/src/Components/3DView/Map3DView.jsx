import React, { Suspense, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sky, Cloud, ContactShadows, BakeShadows } from '@react-three/drei';
import Destination3D from './Destination3D';
import Route3D from './Route3D';
import StatusDisplay from '../ErrorDisplay/StatusDisplay';
import '../../Scss/Map3DView.scss'; 

const NatureElement = ({ position, seed }) => {
    const randomScale = useMemo(() => 0.7 + (seed || Math.random()), [seed]);

    return (
        <group position={position} scale={randomScale}>
            <mesh position={[0, 1, 0]} castShadow>
                <cylinderGeometry args={[0.12, 0.28, 2, 6]} />
                <meshStandardMaterial color="#3d2b1f" roughness={0.9} />
            </mesh>
            <mesh position={[0, 2.8, 0]} castShadow>
                <sphereGeometry args={[1.4, 8, 8]} />
                <meshStandardMaterial color="#15803d" roughness={1} />
            </mesh>
        </group>
    );
};

const Map3DView = ({ routes, destinations, optimizedRoute }) => {
    const [viewError, setViewError] = useState(false);

    const treePlacements = useMemo(() => {
        return Array.from({ length: 55 }).map((_, i) => ({
            id: `tree-${i}`,
            position: [(Math.random() - 0.5) * 180, 0, (Math.random() - 0.5) * 180],
            seed: Math.random()
        }));
    }, []);

    return (
        <div className="map-3d-wrapper">
            
            {viewError && (
                <div className="engine-error-overlay">
                    <StatusDisplay 
                        type="error" 
                        message="3D Engine encountered an error. Please try refreshing or checking your hardware acceleration." 
                    />
                </div>
            )}

            <Canvas 
                shadows 
                gl={{ antialias: true, toneMappingExposure: 1.4 }}
                onCreated={({ gl }) => {
                    gl.domElement.addEventListener('webglcontextlost', () => setViewError(true));
                }}
            >
                <PerspectiveCamera makeDefault position={[55, 55, 55]} fov={35} />
                <OrbitControls enableDamping maxPolarAngle={Math.PI / 2.2} minDistance={15} maxDistance={150} />
                
                <Sky distance={450000} sunPosition={[0, 1, 0]} turbidity={0.01} rayleigh={1.5} />
                <Cloud position={[-20, 35, -40]} speed={0.1} opacity={0.8} color="#ffffff" />
                <ambientLight intensity={1.2} />
                <directionalLight position={[40, 120, 40]} intensity={2.8} castShadow />

                <group scale={0.9}>
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                        <planeGeometry args={[250, 250]} />
                        <meshStandardMaterial color="#22c55e" roughness={0.8} />
                    </mesh>

                    {treePlacements.map((tree) => (
                        <NatureElement 
                            key={tree.id} 
                            position={tree.position} 
                            seed={tree.seed}
                        />
                    ))}

                    <Suspense fallback={null}>
                        {routes?.map((route) => (
                            <Route3D key={`route-${route.id}`} data={route} isDimmed={!!optimizedRoute} />
                        ))}

                        {optimizedRoute?.pathEdges?.map((edge, index) => (
                            <Route3D 
                                key={`opt-edge-${index}`} 
                                data={edge} 
                                isHighlighted={true} 
                                color="#f59e0b" 
                            />
                        ))}

                        {destinations?.map((dest, i) => (
                            <Destination3D key={dest.id || i} data={dest} color="#2563eb" />
                        ))}
                    </Suspense>

                    <ContactShadows position={[0, 0.01, 0]} opacity={0.3} scale={200} blur={3} far={15} />
                </group>
                <BakeShadows />
            </Canvas>
        </div>
    );
};

export default Map3DView;