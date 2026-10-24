import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ✅ FIX: Import GeoJSON langsung dari folder src/data
import provinsiData from '../../data/Provinsi.json';

export default function LeafletMap({ locations, selectedLocation, onSelectLocation, isNight }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef({});
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

  // 2. Render Markers (Custom Google Maps Style Pin)
  useEffect(() => {
    if (!map.current) return;
    
    // Bersihkan marker lama
    Object.values(markersRef.current).forEach(m => map.current.removeLayer(m));
    markersRef.current = {};

    locations.forEach((loc) => {
      const isActive = selectedLocation?.id === loc.id;
      const color = loc.warna || '#10b981';

      // SVG Pin ala Google Maps + Efek Denyut (Pulse) jika aktif
      const html = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: all 0.3s ease;">
          ${isActive ? `<div style="position: absolute; top: 0; width: 30px; height: 30px; background-color: ${color}; border-radius: 50%; opacity: 0.6; animation: markerPulse 1.5s infinite;"></div>` : ''}
          <div class="marker-pin ${isActive ? 'scale-110 z-50' : ''}" style="
            width: 32px; 
            height: 32px; 
            background: linear-gradient(135deg, ${color}, ${color}dd); 
            border-radius: 50% 50% 50% 0; 
            transform: rotate(-45deg); 
            border: 3px solid white; 
            box-shadow: 0 6px 12px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: ${isActive ? 50 : 10};
            transition: transform 0.2s ease;
          ">
             <div style="
               width: 10px; 
               height: 10px; 
               background: white; 
               border-radius: 50%; 
               transform: rotate(45deg);
             "></div>
          </div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'bg-transparent border-none',
        html: html,
        iconSize: [32, 42],
        iconAnchor: [16, 42], // Ujung pin di koordinat
        popupAnchor: [0, -42],
      });

      const marker = L.marker([loc.koordinat[1], loc.koordinat[0]], { icon })
        .addTo(map.current)
        .on('click', () => onSelectLocation(loc));

      markersRef.current[loc.id] = marker;
    });
  }, [locations, selectedLocation, onSelectLocation]);

  // 3. Render Garis Batas Provinsi (Dipertebal & Ber-glow)
  useEffect(() => {
    if (!map.current) return;

    if (geoJsonLayerRef.current) {
      map.current.removeLayer(geoJsonLayerRef.current);
    }

    // Layer 1: Efek Glow (Garis luar lebih tebal & transparan)
    const glowLayer = L.geoJSON(provinsiData, {
      style: {
        color: '#34d399', // Warna emerald terang
        weight: 6,        // Lebih tebal
        opacity: 0.3,     // Transparan untuk efek glow
        fill: false,
      },
    }).addTo(map.current);

    // Layer 2: Garis Utama (Lebih tebal & tegas)
    geoJsonLayerRef.current = L.geoJSON(provinsiData, {
      style: {
        color: '#ffffff',
        weight: 2,        // Dipertebal dari 1 menjadi 2
        opacity: 0.9,     // Lebih tegas
        fill: false,      
      },
    }).addTo(map.current);

    // Cleanup glow layer jika komponen unmount
    return () => {
      if (map.current && glowLayer) map.current.removeLayer(glowLayer);
    };
  }, []);

  // 4. Efek saat kota dipilih (Zoom & Highlight Poligon)
  useEffect(() => {
    if (!map.current || !provinsiData) return;

    if (selectedPolygonRef.current) {
      map.current.removeLayer(selectedPolygonRef.current);
      selectedPolygonRef.current = null;
    }

    if (selectedLocation) {
      // Zoom ke lokasi
      map.current.flyTo([selectedLocation.koordinat[1], selectedLocation.koordinat[0]], 6.5, {
        duration: 1.5,
      });

      const cleanProvinceName = selectedLocation.nama.replace(/\s*\(.*?\)\s*/g, '').trim().toLowerCase();
      
      // Normalisasi nama khusus untuk provinsi tertentu
      let searchName = cleanProvinceName;
      if (cleanProvinceName === 'yogyakarta' || cleanProvinceName === 'di yogyakarta') searchName = 'daerah istimewa yogyakarta';
      if (cleanProvinceName === 'dki jakarta' || cleanProvinceName === 'jakarta') searchName = 'dki jakarta';

      const selectedFeature = provinsiData.features.find(
        (feature) => feature.properties.PROVINSI.toLowerCase() === searchName || feature.properties.PROVINSI.toLowerCase() === cleanProvinceName
      );

      if (selectedFeature) {
        // Polygon Highlight yang lebih tegas
        selectedPolygonRef.current = L.geoJSON(selectedFeature, {
          style: {
            color: selectedLocation.warna || '#10b981', 
            weight: 4,             // Garis batas dipilih lebih tebal
            opacity: 1,
            fillColor: selectedLocation.warna || '#10b981',
            fillOpacity: 0.25,     // Isi lebih terlihat
            dashArray: '5, 5',     // Efek garis putus-putus (opsional, bisa dihapus jika tidak suka)
          },
        }).addTo(map.current);
      }
    }
  }, [selectedLocation]);

  return (
    <>
      {/* Tambahan style global untuk animasi pulse marker */}
      <style>{`
        @keyframes markerPulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .marker-pin:hover {
          transform: rotate(-45deg) scale(1.15) !important;
          box-shadow: 0 8px 16px rgba(0,0,0,0.5) !important;
        }
      `}</style>
      <div ref={mapContainer} className="h-full w-full z-0 outline-none" />
    </>
  );
}