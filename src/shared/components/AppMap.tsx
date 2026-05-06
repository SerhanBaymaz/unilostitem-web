import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { ItemType } from '@/shared/types';
import 'leaflet/dist/leaflet.css';

export interface MapMarkerData {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  itemType: ItemType;
  onClick?: () => void;
}

interface AppMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarkerData[];
  className?: string;
  onMapClick?: (lat: number, lng: number) => void;
  selectable?: boolean;
}

function createCustomIcon(type: ItemType): L.DivIcon {
  const color = type === 'Lost' ? '#E11D48' : '#059669';

  return L.divIcon({
    className: 'custom-marker',
    html: `<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z" fill="${color}"/>
      <circle cx="14" cy="14" r="5" fill="white"/>
    </svg>`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  });
}

const lostIcon = createCustomIcon('Lost');
const foundIcon = createCustomIcon('Found');

function FlyToCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { duration: 0.8 });
  }, [center, map]);
  return null;
}

function MapClickHandler({ onClick }: { onClick?: (lat: number, lng: number) => void }) {
  const map = useMap();
  useEffect(() => {
    if (!onClick) return;
    const handler = (e: L.LeafletMouseEvent) => {
      onClick(e.latlng.lat, e.latlng.lng);
    };
    map.on('click', handler);
    return () => {
      map.off('click', handler);
    };
  }, [map, onClick]);
  return null;
}

const DEFAULT_CENTER: [number, number] = [41.0082, 28.9784]; // Istanbul
const DEFAULT_ZOOM = 13;

export function AppMap({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  markers = [],
  className,
  onMapClick,
  selectable,
}: AppMapProps) {
  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full rounded-lg"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyToCenter center={center} />
        {selectable && <MapClickHandler onClick={onMapClick} />}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.latitude, marker.longitude]}
            icon={marker.itemType === 'Lost' ? lostIcon : foundIcon}
            eventHandlers={marker.onClick ? { click: marker.onClick } : undefined}
          >
            <Popup>
              <div className="min-w-[160px] max-w-[220px] p-1">
                <span
                  className={`mb-1 inline-block rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    marker.itemType === 'Lost'
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {marker.itemType}
                </span>
                <p className="mt-1 text-sm font-medium text-stone-900">{marker.title}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
