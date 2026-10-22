// src/components/CesiumMap.jsx
import { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

// Set token dari file .env
Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

export default function CesiumMap() {
  const cesiumContainer = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!cesiumContainer.current) return;

    // Inisialisasi Viewer
    const viewer = new Cesium.Viewer(cesiumContainer.current, {
      terrain: Cesium.Terrain.fromWorldTerrain(), // Medan 3D (gunung, lembah)
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      infoBox: false,
    });

    viewerRef.current = viewer;

    // 1. Terbangkan kamera ke Indonesia (sekitar Jawa)
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(110.0, -7.5, 1500000), // Longitude, Latitude, Ketinggian
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90), // Melihat lurus ke bawah
        roll: 0,
      },
      duration: 3, // Animasi terbang selama 3 detik
    });

    // 2. Tambahkan Pin untuk Kota-Kota di Indonesia
    const cities = [
      { name: 'Ponorogo (Reog)', lat: -7.8667, lon: 111.4667, color: Cesium.Color.RED },
      { name: 'Yogyakarta (Budaya)', lat: -7.7956, lon: 110.3695, color: Cesium.Color.BLUE },
      { name: 'Bandung (Geologi)', lat: -6.9175, lon: 107.6191, color: Cesium.Color.GREEN },
    ];

    cities.forEach((city) => {
      viewer.entities.add({
        name: city.name,
        position: Cesium.Cartesian3.fromDegrees(city.lon, city.lat),
        point: {
          pixelSize: 15,
          color: city.color,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
        },
        label: {
          text: city.name,
          font: '14pt Poppins, sans-serif',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -20),
        },
      });
    });

    // Cleanup saat komponen di-unmount
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div 
      ref={cesiumContainer} 
      className="absolute inset-0 w-full h-full" 
      style={{ zIndex: 0 }} 
    />
  );
}