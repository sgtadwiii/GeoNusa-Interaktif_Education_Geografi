import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function LeafletMap({ locations, selectedLocation, onSelectLocation, isNight }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (map.current) return;

    map.current = L.map(mapContainer.current, {
      zoomControl: false, // Hilangkan tombol zoom
      attributionControl: false,
    }).setView([-2.548926, 118.0148634], 5); // Fokus Indonesia

    // Citra Satelit Esri
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

  useEffect(() => {
    if (selectedLocation && map.current) {
      map.current.flyTo([selectedLocation.koordinat[1], selectedLocation.koordinat[0]], 6.5, {
        duration: 1.5,
      });
    }
  }, [selectedLocation]);

  return <div ref={mapContainer} className="h-full w-full z-0 outline-none" />;
}