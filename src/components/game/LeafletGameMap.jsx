import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import provinsiData from '../../data/Provinsi.json';

export default function LeafletGameMap({ onProvinceClick, status }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;
    map.current = L.map(mapContainer.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([-2.548926, 118.0148634], 5);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
    }).addTo(map.current);

    L.geoJSON(provinsiData, {
      style: {
        color: '#94a3b8',
        weight: 1,
        opacity: 0.6,
        fillColor: '#1e293b',
        fillOpacity: 0.5,
      },
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: (e) => {
            e.target.setStyle({ color: '#34d399', weight: 3, fillColor: '#10b981', fillOpacity: 0.3 });
          },
          mouseout: (e) => {
            if (status === 'playing') {
              e.target.setStyle({ color: '#94a3b8', weight: 1, fillColor: '#1e293b', fillOpacity: 0.5 });
            }
          },
          click: () => {
            if (status === 'playing') onProvinceClick(feature.properties.PROVINSI);
          },
        });
      },
    }).addTo(map.current);

    return () => {
      if (map.current) { map.current.remove(); map.current = null; }
    };
  }, [status, onProvinceClick]);

  return <div ref={mapContainer} className="h-full w-full z-0" />;
}