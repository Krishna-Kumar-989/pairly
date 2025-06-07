'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { redirect } from 'next/navigation';

// Props type for user
interface Props {
  user: { id: string };
}

// Dynamically import the map component (client-only)
const SelectLocationMap = dynamic(() => import('./SelectLocationMap'), { ssr: false });

export default function SelectLocationClient({ user }: Props) {
  const supabase = createClientComponentClient();

  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSavedOnce, setIsSavedOnce] = useState(false);

  // Callback to receive location data from SelectLocationMap
  const onLocationSelect = (lat: number, lng: number, city: string, country: string) => {
    setLat(lat);
    setLng(lng);
    setCity(city);
    setCountry(country);
  };

  // Save location info to Supabase table 'user_location'
  async function handleSave() {
    if (!lat || !lng) {
      setStatus('⚠️ Please select a location first');
      return;
    }
    setLoading(true);
    setStatus('');

    const { error } = await supabase.from('user_location').upsert({
      id: user.id, // assuming 'id' is the PK for user_location
      latitude: lat,
      longitude: lng,
      city,
      country,
      updated_at: new Date().toISOString(),
    });

    setLoading(false);
    if (error) {
      setStatus('❌ Error saving location.');
    } else {
      setStatus('✅ Location saved successfully!');
      setIsSavedOnce(true);
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-6 py-8 bg-white rounded-2xl shadow-lg text-black transition">
      <h1 className="text-3xl font-bold text-center mb-6">🌍 Select Your Location</h1>

      <SelectLocationMap onLocationSelect={onLocationSelect} />

      <div className="mt-4 space-y-2 text-center">
        <p className="text-lg">
          <strong>City:</strong> {city || <span className="text-gray-500">None</span>}
        </p>
        <p className="text-lg">
          <strong>Country:</strong> {country || <span className="text-gray-500">None</span>}
        </p>
      </div>

      <div
        className={`mt-8 flex ${
          isSavedOnce ? 'flex-col sm:flex-row sm:justify-center sm:gap-4' : 'justify-center'
        }`}
      >
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex-1 max-w-xs bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Location'}
        </button>

        {isSavedOnce && (
          <button
            onClick={() => redirect('/homepage')}
            className="flex-1 max-w-xs mt-4 sm:mt-0 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold py-3 px-6 rounded-xl transition"
          >
            Next
          </button>
        )}
      </div>

      {status && (
        <p className="mt-4 text-center font-medium text-sm text-pink-600">
          {status}
        </p>
      )}
    </div>
  );
}
