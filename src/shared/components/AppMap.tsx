import L from 'leaflet';
import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import type { ItemType } from '@/shared/types';
import 'leaflet/dist/leaflet.css';

export interface MapMarkerData {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  itemType: ItemType;
  imageUrl?: string;
  category?: string;
  locationLabel?: string;
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

function createCustomIcon(type: ItemType, imageUrl?: string): L.DivIcon {
  const color = type === 'Lost' ? '#E11D48' : '#059669';

  if (imageUrl) {
    return L.divIcon({
      className: 'custom-marker-with-image',
      html: `
        <div class="marker-wrapper" style="position: relative; width: 48px; height: 56px;">
          <svg width="48" height="56" viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
            <path d="M24 4C12.954 4 4 12.954 4 24c0 16 20 32 20 32s20-16 20-32C44 12.954 35.046 4 24 4z" fill="${color}" stroke="white" stroke-width="2"/>
          </svg>
          <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 28px; height: 28px; border-radius: 50%; overflow: hidden; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);">
            <img src="${imageUrl}" alt="" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
        </div>
      `,
      iconSize: [48, 56],
      iconAnchor: [24, 56],
      popupAnchor: [0, -56],
    });
  }

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

function getIcon(type: ItemType, imageUrl?: string): L.DivIcon {
  return createCustomIcon(type, imageUrl);
}

function FlyToCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { duration: 0.8 });
  }, [center, map]);
  return null;
}

function MapEvents({
  onMapClick,
  selectable,
}: {
  onMapClick?: (lat: number, lng: number) => void;
  selectable?: boolean;
}) {
  useMapEvents({
    click(e) {
      if (selectable && onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

function InvalidateMapSize() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

const DEFAULT_CENTER: [number, number] = [41.0082, 28.9784]; // Istanbul
const DEFAULT_ZOOM = 13;

const TILE_URLS = {
  light: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
} as const;

export function AppMap({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  markers = [],
  className = 'h-64 w-full',
  onMapClick,
  selectable,
}: AppMapProps) {
  const { resolvedTheme } = useTheme();
  const tileUrl = resolvedTheme === 'dark' ? TILE_URLS.dark : TILE_URLS.light;

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-stone-200 dark:border-stone-700 ${className}`}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={tileUrl}
        />
        <InvalidateMapSize />
        <FlyToCenter center={center} />
        <MapEvents onMapClick={onMapClick} selectable={selectable} />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.latitude, marker.longitude]}
            icon={getIcon(marker.itemType, marker.imageUrl)}
          >
            <Popup>
              <div className="min-w-[200px] max-w-[280px]">
                {marker.imageUrl && (
                  <img
                    src={marker.imageUrl}
                    alt={marker.title}
                    className="h-32 w-full rounded-t-lg object-cover"
                  />
                )}
                <div className="p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={`inline-block rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        marker.itemType === 'Lost'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                      }`}
                    >
                      {marker.itemType}
                    </span>
                    {marker.category && (
                      <span className="text-[10px] font-medium uppercase text-stone-500 dark:text-stone-400">
                        {marker.category}
                      </span>
                    )}
                  </div>
                  <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-stone-900 dark:text-stone-50">
                    {marker.title}
                  </h3>
                  {marker.locationLabel && (
                    <div className="mb-3 flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="line-clamp-1">{marker.locationLabel}</span>
                    </div>
                  )}
                  {marker.onClick && (
                    <button
                      type="button"
                      onClick={marker.onClick}
                      className="w-full rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
