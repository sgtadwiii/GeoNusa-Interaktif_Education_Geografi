import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ✅ FIX: Import GeoJSON langsung dari folder src/data
import provinsiData from '../../data/Provinsi.json';

export default function LeafletMap({ locations, selectedLocation, onSelectLocation, isNight }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const geoJsonLayerRef = useRef(null);
  const selectedPolygonRef = useRef(null);

  // 1. Inisialisasi Peta
  useEffect(() => {
    if (map.current) return;

    map.current = L.map(mapContainer.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([-2.548926, 118.0148634], 5);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
    }).addTo(map.current);

    L.control.attribution({ position: 'bottomright', prefix: false })
      .addAttribution('&copy; Esri, Maxar')
      .addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // 2. Render Markers
  useEffect(() => {
    if (!map.current) return;
    
    markersRef.current.forEach(m => map.current.removeLayer(m));
    markersRef.current = [];

    locations.forEach((loc) => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${loc.warna || '#10b981'}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: transform 0.2s;"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([loc.koordinat[1], loc.koordinat[0]], { icon })
        .addTo(map.current)
        .on('click', () => onSelectLocation(loc));

      markersRef.current.push(marker);
    });
  }, [locations, onSelectLocation]);

  // 3. Render Garis Batas Provinsi (Putih di awal)
  useEffect(() => {
    if (!map.current) return;

    // Hapus layer batas lama jika ada
    if (geoJsonLayerRef.current) {
      map.current.removeLayer(geoJsonLayerRef.current);
    }

    // Gambar semua batas provinsi dengan garis putih transparan
    geoJsonLayerRef.current = L.geoJSON(provinsiData, {
      style: {
        color: '#ffffff', 
        weight: 1,        
        opacity: 0.5,     
        fill: false,      
      },
    }).addTo(map.current);

  }, []);

  // 4. Efek saat kota dipilih (Zoom & Highlight Poligon)
  useEffect(() => {
    if (!map.current || !provinsiData) return;

    // Hapus polygon highlight sebelumnya
    if (selectedPolygonRef.current) {
      map.current.removeLayer(selectedPolygonRef.current);
      selectedPolygonRef.current = null;
    }

    if (selectedLocation) {
      // Zoom ke lokasi
      map.current.flyTo([selectedLocation.koordinat[1], selectedLocation.koordinat[0]], 6.5, {
        duration: 1.5,
      });

      // Bersihkan nama provinsi dari embel-embel "(SMP)" atau "(SMA)"
      const cleanProvinceName = selectedLocation.nama.replace(/\s*\(.*?\)\s*/g, '').trim().toLowerCase();

      // Cari fitur yang cocok dengan normalisasi nama
      const selectedFeature = provinsiData.features.find(
        (feature) => feature.properties.PROVINSI.toLowerCase() === cleanProvinceName
      );

      // Jika ketemu, gambar ulang dengan warna highlight
      if (selectedFeature) {
        selectedPolygonRef.current = L.geoJSON(selectedFeature, {
          style: {
            color: selectedLocation.warna || '#10b981', 
            weight: 3,
            opacity: 1,
            fillColor: selectedLocation.warna || '#10b981',
            fillOpacity: 0.15, 
          },
        }).addTo(map.current);
      }
    }
  }, [selectedLocation]);

  return <div ref={mapContainer} className="h-full w-full z-0 outline-none" />;
}