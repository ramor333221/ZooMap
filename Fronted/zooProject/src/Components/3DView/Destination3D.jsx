import React, { useState, Suspense } from 'react';
import * as THREE from 'three';
import { Billboard, useTexture, Html, Float } from '@react-three/drei';
import { BASE_URL } from '../../Api/apiClient'; 
import '../../Scss/Destination3D.scss'; 

const TextureBillboardMesh = ({ imageUrl, hovered, setHovered }) => {
    const texture = useTexture(imageUrl);

    return (
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
    );
};

const Destination3D = ({ data, color }) => {
    const [hovered, setHovered] = useState(false);
    
    const serverHost = BASE_URL.replace('/api', '');
    const imageUrl = `${serverHost}${data.picUrl.startsWith('/') ? '' : '/'}${data.picUrl}`;
    
    const posX = (data.location?.x ?? data.x) - 50;
    const posZ = (data.location?.y ?? data.y) - 50;

    if (isNaN(posX) || isNaN(posZ)) return null;

    return (
        <group position={[posX, 0, posZ]}>
            <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
                <cylinderGeometry args={[1.8, 2.2, 0.4, 8]} />
                <meshStandardMaterial color="#4b3621" roughness={0.6} metalness={0.2} />
            </mesh>

            <Float speed={hovered ? 5 : 2} rotationIntensity={0.2} floatIntensity={0.5}>
                <Billboard position={[0, 2, 0]}>
                    <Suspense fallback={<meshStandardMaterial color="#334155" wireframe />}>
                        <TextureBillboardMesh 
                            imageUrl={imageUrl}
                            hovered={hovered}
                            setHovered={setHovered}
                        />
                    </Suspense>
                </Billboard>
            </Float>

            <Html position={[0, 4, 0]} center distanceFactor={8}>
                <div 
                    className="destination-marker-label"
                    style={{ '--marker-bg-color': color }}
                >
                    {data.name}
                </div>
            </Html>
        </group>
    );
};

export default Destination3D;