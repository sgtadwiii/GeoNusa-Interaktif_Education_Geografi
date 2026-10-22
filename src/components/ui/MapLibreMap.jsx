import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapLibreMap({ locations, onSelectLocation }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // Cegah inisialisasi ganda

    // Inisialisasi Peta MapLibre
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/bright',
      center: [115.1889, -2.5], // Fokus ke Indonesia
      zoom: 4.5,
      pitch: 45, // Sedikit miring untuk efek 3D
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Tambahkan Pin untuk setiap lokasi
    locations.forEach((loc) => {
      // Buat elemen HTML untuk marker
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = loc.warna;
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
      el.style.cursor = 'pointer';

      // Tambahkan marker ke peta
      new maplibregl.Marker({ element: el })
        .setLngLat(loc.koordinat)
        .addTo(map.current)
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(
            `<div class="p-2">
              <h3 class="font-bold text-slate-800 text-sm mb-1">${loc.nama}</h3>
              <p class="text-xs text-slate-600">${loc.geografi}</p>
            </div>`
          )
        );

      // Event listener saat marker diklik
      el.addEventListener('click', () => {
        onSelectLocation(loc);
        map.current.flyTo({
          center: loc.koordinat,
          zoom: 8,
          duration: 2000
        });
      });
    });

    return () => {
      if (map.current) map.current.remove();
    };
  }, [locations, onSelectLocation]);

  return <div ref={mapContainer} className="absolute inset-0 w-full h-full" />;
}