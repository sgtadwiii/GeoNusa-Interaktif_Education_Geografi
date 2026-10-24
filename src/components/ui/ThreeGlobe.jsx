import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Pin 3D untuk menandai provinsi
function Marker({ position, name, color, onClick }) {
  const [hovered, setHover] = useState(false);
  
  return (
    <group position={position}>
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHover(false); }}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color={hovered ? '#ffffff' : color} emissive={color} emissiveIntensity={hovered ? 2 : 0.5} />
      </mesh>
      
      {/* Garis Pin */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.002, 0.002, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Label saat di-hover */}
      {hovered && (
        <Html distanceFactor={5} position={[0, 0.1, 0]} center>
          <div className="bg-slate-900/90 text-white text-xs font-bold px-2 py-1 rounded-md border border-white/20 whitespace-nowrap backdrop-blur-md pointer-events-none">
            {name}
          </div>
        </Html>
      )}
    </group>
  );
}

// Komponen Bumi
function Earth({ locations, onSelect }) {
  const earthRef = useRef();
  // Menggunakan tekstur Bumi resolusi tinggi
  const texture = useTexture('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
  const bumpMap = useTexture('https://unpkg.com/three-globe/example/img/earth-topology.png');

  // Rotasi Bumi perlahan
  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05;
    }
  });

  // Konversi koordinat (Lat, Lng) ke posisi 3D (X, Y, Z)
  const latLngToVector3 = (lat, lng, radius = 1) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    return [x, y, z];
  };

  return (
    <group>
      {/* Bola Bumi */}
      <Sphere ref={earthRef} args={[1, 64, 64]} castShadow receiveShadow>
        <meshStandardMaterial map={texture} bumpMap={bumpMap} bumpScale={0.05} roughness={0.8} metalness={0.1} />
      </Sphere>

      {/* Atmosfer (Efek Cahaya Biru) */}
      <Sphere args={[1.02, 64, 64]}>
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} side={THREE.BackSide} />
      </Sphere>

      {/* Render Marker */}
      {locations.map((loc) => {
        if (!loc.koordinat) return null;
        const [lng, lat] = loc.koordinat;
        const pos = latLngToVector3(lat, lng, 1.01); // Sedikit di atas permukaan bumi
        return (
          <Marker 
            key={loc.id} 
            position={pos} 
            name={loc.nama} 
            color={loc.warna || '#10b981'} 
            onClick={() => onSelect(loc)} 
          />
        );
      })}
    </group>
  );
}

export default function ThreeGlobe({ locations, onSelect }) {
  return (
    <div className="w-full h-full absolute inset-0 bg-slate-950">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
        {/* Pencahayaan */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={2} />
        
        <Suspense fallback={<Html center><span className="text-white">Memuat Bumi...</span></Html>}>
          <Earth locations={locations} onSelect={onSelect} />
        </Suspense>
        
        {/* Kontrol Kamera */}
        <OrbitControls enablePan={false} minDistance={1.5} maxDistance={4} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}