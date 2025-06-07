'use client';

import { useEffect } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import ttServices from '@tomtom-international/web-sdk-services';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

interface MapProps {
  onLocationSelect: (lat: number, lng: number, city: string, country: string) => void;
}

export default function SelectLocationMap({ onLocationSelect }: MapProps) {
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY!;
    if (!apiKey) {
      console.error('TOMTOM API key is missing');
      return;
    }

    if (typeof window === 'undefined') return;

    // Initialize map
    const map = tt.map({
      key: apiKey,
      container: 'tt-map',
      center: [77.209, 28.6139], // Default to Delhi
      zoom: 4,
    });

    let marker: tt.Marker | null = null;

    map.on('click', function (e) {
      const { lng, lat } = e.lngLat;

      // Remove existing marker
      if (marker) marker.remove();

      // Add new marker
      marker = new tt.Marker().setLngLat([lng, lat]).addTo(map);

      // Reverse geocode to get city and country
      ttServices.services
        .reverseGeocode({ key: apiKey, position: `${lng},${lat}` })
        .then((results) => {
          const address = results?.addresses?.[0]?.address || {};
          const city = address.municipality || address.city || address.town || '';
          const country = address.country || '';
          onLocationSelect(lat, lng, city, country);
        })
        .catch((err) => console.error('Reverse geocoding failed:', err));
    });

    return () => map.remove();
  }, [onLocationSelect]);

  return (
    <div
      id="tt-map"
      className="rounded-lg shadow-md border border-gray-300"
      style={{ height: '400px', width: '100%' }}
    />
  );
}
