import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Moon, Sun, Satellite, Map as MapIcon, Plus, Minus } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

const DEFAULT_CENTER = [-2.5, 118];
const MAP_THEME_KEY = 'geonusa-map-theme';
const MAP_LAYER_KEY = 'geonusa-map-layer';

function readSetting(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function getCoordinates(location) {
  const coordinates = location?.koordinat;
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null;
  const longitude = Number(coordinates[0]);
  const latitude = Number(coordinates[1]);
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude) || Math.abs(longitude) > 180 || Math.abs(latitude) > 90) return null;
  return [latitude, longitude];
}

function FocusSelectedLocation({ location }) {
  const map = useMap();
  useEffect(() => {
    const coordinates = getCoordinates(location);
    if (coordinates) map.flyTo(coordinates, Math.max(map.getZoom(), 6), { duration: 1.35, easeLinearity: 0.25 });
  }, [location, map]);
  return null;
}

function CustomZoomControls() {
  const map = useMap();
  return (
    <div className="absolute bottom-[82px] left-4 z-[1000] flex flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/95 shadow-xl shadow-slate-900/20 backdrop-blur-xl sm:bottom-[90px] sm:left-5">
      <button type="button" aria-label="Perbesar peta" title="Perbesar" onClick={() => map.zoomIn()} className="grid h-10 w-10 place-items-center text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700 sm:h-11 sm:w-11"><Plus size={19} strokeWidth={2.5} /></button>
      <div className="mx-2 border-t border-slate-200" />
      <button type="button" aria-label="Perkecil peta" title="Perkecil" onClick={() => map.zoomOut()} className="grid h-10 w-10 place-items-center text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700 sm:h-11 sm:w-11"><Minus size={19} strokeWidth={2.5} /></button>
    </div>
  );
}

function makeMarkerIcon(color = '#10b981', active = false) {
  const safeColor = /^#[0-9a-f]{6}$/i.test(color) ? color : '#10b981';
  const size = active ? 32 : 26;
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50% 50% 50% 8px;transform:rotate(-45deg);background:${safeColor};border:3px solid white;box-shadow:0 4px 14px rgba(15,23,42,.4);display:flex;align-items:center;justify-content:center"><span style="width:6px;height:6px;border-radius:50%;background:white;transform:rotate(45deg)"></span></div>`,
    iconSize: [size, size], iconAnchor: [size / 2, size], popupAnchor: [0, -24],
  });
}

const tileLayers = {
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
  },
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  },
};

export default function LeafletMap({ locations = [], selectedLocation = null, onSelectLocation }) {
  const [mapTheme, setMapTheme] = useState(() => readSetting(MAP_THEME_KEY, 'light'));
  // Citra satelit menjadi pilihan default saat pertama kali membuka peta.
  const [mapLayer, setMapLayer] = useState(() => readSetting(MAP_LAYER_KEY, 'satellite'));

  useEffect(() => {
    try {
      localStorage.setItem(MAP_THEME_KEY, mapTheme);
      localStorage.setItem(MAP_LAYER_KEY, mapLayer);
    } catch {
      // Peta tetap berfungsi jika localStorage tidak tersedia.
    }
  }, [mapTheme, mapLayer]);

  const validLocations = useMemo(() => (Array.isArray(locations) ? locations : [])
    .map((location, index) => ({ location, index, coordinates: getCoordinates(location) }))
    .filter((item) => item.coordinates), [locations]);

  const activeLayer = mapLayer === 'satellite'
    ? tileLayers.satellite
    : mapTheme === 'dark' ? tileLayers.dark : tileLayers.light;

  const toggleMapTheme = () => {
    setMapTheme((current) => current === 'light' ? 'dark' : 'light');
    // Tema terang/gelap memakai basemap yang sesuai; satelit bisa dipilih kembali kapan saja.
    setMapLayer((current) => current === 'satellite' ? 'street' : current);
  };

  return (
    <div className={`absolute inset-0 h-full w-full overflow-hidden ${mapTheme === 'dark' && mapLayer !== 'satellite' ? 'bg-slate-950' : 'bg-sky-100'}`}>
      <MapContainer center={DEFAULT_CENTER} zoom={4.5} minZoom={3} maxZoom={18} scrollWheelZoom zoomControl={false} className="h-full w-full">
        <TileLayer key={`${mapLayer}-${mapTheme}`} attribution={activeLayer.attribution} url={activeLayer.url} />
        {validLocations.map(({ location, coordinates, index }) => {
          const active = selectedLocation && (selectedLocation.id != null ? selectedLocation.id === location.id : selectedLocation.nama === location.nama);
          return (
            <Marker key={location.id ?? `${location.nama ?? 'wilayah'}-${index}`} position={coordinates} icon={makeMarkerIcon(location.warna, Boolean(active))} eventHandlers={{ click: () => onSelectLocation?.(location) }}>
              <Popup>
                <div className="min-w-[150px] text-slate-800">
                  <strong className="block text-sm">{location.nama ?? 'Wilayah Indonesia'}</strong>
                  {location.ibukota && <p className="mt-1 text-xs text-slate-600">Ibu kota: {location.ibukota}</p>}
                  {location.geografi && <p className="mt-2 text-xs leading-relaxed text-slate-600">{location.geografi}</p>}
                  <button type="button" className="mt-3 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white" onClick={() => onSelectLocation?.(location)}>Lihat materi</button>
                </div>
              </Popup>
            </Marker>
          );
        })}
        <FocusSelectedLocation location={selectedLocation} />
        <CustomZoomControls />
      </MapContainer>

      {/* Layer dan tema peta dipindahkan ke bawah-kiri, tepat di atas kontrol zoom. */}
      <div className="absolute bottom-[176px] left-4 z-[1000] flex max-w-[calc(100%-32px)] flex-col items-start gap-2 sm:bottom-[190px] sm:left-5">
        <div className="flex items-center gap-1 rounded-2xl border border-white/70 bg-white/95 p-1.5 shadow-xl shadow-slate-900/15 backdrop-blur-xl">
          <button type="button" onClick={() => setMapLayer('street')} aria-pressed={mapLayer === 'street'} className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[11px] font-extrabold transition ${mapLayer === 'street' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}><MapIcon size={15} /><span>Peta</span></button>
          <button type="button" onClick={() => setMapLayer('satellite')} aria-pressed={mapLayer === 'satellite'} className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[11px] font-extrabold transition ${mapLayer === 'satellite' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}><Satellite size={15} /><span>Satelit</span></button>
        </div>
        <button type="button" onClick={toggleMapTheme} className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/95 px-3 py-2.5 text-[11px] font-extrabold text-slate-700 shadow-xl shadow-slate-900/15 backdrop-blur-xl transition hover:-translate-y-0.5" aria-label={mapTheme === 'light' ? 'Aktifkan peta gelap' : 'Aktifkan peta terang'}>
          {mapTheme === 'light' ? <Moon size={15} className="text-indigo-600" /> : <Sun size={15} className="text-amber-500" />}
          {mapTheme === 'light' ? 'Mode gelap peta' : 'Mode terang peta'}
        </button>
        {mapLayer === 'satellite' && <div className="rounded-lg border border-white/20 bg-slate-950/70 px-2.5 py-1.5 text-[10px] font-bold text-white shadow-lg backdrop-blur-md">Citra satelit · Esri</div>}
      </div>

      {validLocations.length === 0 && (
        <div className="absolute bottom-4 left-20 right-4 z-[1000] rounded-2xl border border-white/30 bg-slate-950/80 p-4 text-white shadow-xl backdrop-blur-md">
          <p className="text-sm font-extrabold">Koordinat materi belum tersedia</p>
          <p className="mt-1 text-xs leading-relaxed text-white/75">Pastikan setiap data wilayah memiliki koordinat dalam format [longitude, latitude].</p>
        </div>
      )}
    </div>
  );
}
