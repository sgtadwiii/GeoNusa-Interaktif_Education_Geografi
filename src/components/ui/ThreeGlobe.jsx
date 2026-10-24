import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeGlobe() {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    
    // 1. Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // 2. Buat Objek (Globe Wireframe & Partikel)
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x10b981, // Warna emerald
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Tambahkan Partikel (Bintang/Data)
    const particlesGeo = new THREE.BufferGeometry();
    const particlesCount = 300;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x34d399,
      transparent: true,
      opacity: 0.8
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    // 3. Animasi Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      sphere.rotation.y += 0.002;
      sphere.rotation.x += 0.001;
      particlesMesh.rotation.y -= 0.001;
      renderer.render(scene, camera);
    };
    animate();

    // 4. Handle Resize
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      currentMount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-[1] pointer-events-none opacity-50" />;
}