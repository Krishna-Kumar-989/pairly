'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Adjust import path to your supabase client

interface Preferences {
  preferred_age_min?: number | null;
  preferred_age_max?: number | null;
  preferred_countries?: string[] | null;
  preferred_cities?: string[] | null;
  preferred_distance_km?: number | null;
  preferred_gender?: string | null;
}

interface Props {
  userId: string;
}

export default function PreferencesClient({ userId }: Props) {
  const [preferences, setPreferences] = useState<Preferences>({
    preferred_age_min: 18,
    preferred_age_max: 99,
    preferred_countries: [],
    preferred_cities: [],
    preferred_distance_km: 50,
    preferred_gender: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchPreferences() {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        setError('Failed to load preferences.');
      } else if (data) {
        setPreferences({
          preferred_age_min: data.preferred_age_min ?? 18,
          preferred_age_max: data.preferred_age_max ?? 99,
          preferred_countries: data.preferred_countries ?? [],
          preferred_cities: data.preferred_cities ?? [],
          preferred_distance_km: data.preferred_distance_km ?? 50,
          preferred_gender: data.preferred_gender ?? '',
        });
      }
      setLoading(false);
    }

    fetchPreferences();
  }, [userId]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);

    const { error } = await supabase.from('user_preferences').upsert({
      id: userId,
      preferred_age_min: preferences.preferred_age_min,
      preferred_age_max: preferences.preferred_age_max,
      preferred_countries: preferences.preferred_countries,
      preferred_cities: preferences.preferred_cities,
      preferred_distance_km: preferences.preferred_distance_km,
      preferred_gender: preferences.preferred_gender,
    });

    if (error) {
      setError('Failed to save preferences.');
    } else {
      setSuccess(true);
    }
    setSaving(false);
  }

  if (loading) return <p className="text-center text-gray-700">Loading preferences...</p>;

  return (
    <div className="max-w-xl mx-auto bg-gray-50 p-8 rounded-lg shadow-md text-black">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-900">
        Your Preferences
      </h1>

      {error && (
        <p className="text-center text-red-700 bg-red-100 py-2 px-4 rounded mb-4">
          {error}
        </p>
      )}
      {success && (
        <p className="text-center text-green-800 bg-green-100 py-2 px-4 rounded mb-4">
          Preferences saved successfully!
        </p>
      )}

      <div className="mb-4">
        <label className="block font-semibold mb-2 text-gray-800">Age Range</label>
        <div className="flex space-x-4">
          <input
            type="number"
            min={18}
            max={preferences.preferred_age_max ?? 99}
            value={preferences.preferred_age_min ?? 18}
            onChange={(e) =>
              setPreferences({ ...preferences, preferred_age_min: Number(e.target.value) })
            }
            className="border border-gray-300 rounded px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            min={preferences.preferred_age_min ?? 18}
            max={99}
            value={preferences.preferred_age_max ?? 99}
            onChange={(e) =>
              setPreferences({ ...preferences, preferred_age_max: Number(e.target.value) })
            }
            className="border border-gray-300 rounded px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2 text-gray-800">Preferred Countries (comma separated)</label>
        <input
          type="text"
          value={(preferences.preferred_countries ?? []).join(', ')}
          onChange={(e) =>
            setPreferences({
              ...preferences,
              preferred_countries: e.target.value
                .split(',')
                .map((c) => c.trim())
                .filter(Boolean),
            })
          }
          placeholder="e.g. USA, Canada, India"
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2 text-gray-800">Preferred Cities (comma separated)</label>
        <input
          type="text"
          value={(preferences.preferred_cities ?? []).join(', ')}
          onChange={(e) =>
            setPreferences({
              ...preferences,
              preferred_cities: e.target.value
                .split(',')
                .map((c) => c.trim())
                .filter(Boolean),
            })
          }
          placeholder="e.g. New York, Toronto, Mumbai"
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2 text-gray-800">Preferred Distance (km)</label>
        <input
          type="number"
          min={1}
          max={500}
          value={preferences.preferred_distance_km ?? 50}
          onChange={(e) =>
            setPreferences({ ...preferences, preferred_distance_km: Number(e.target.value) })
          }
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-800">Preferred Gender</label>
        <select
          value={preferences.preferred_gender ?? ''}
          onChange={(e) =>
            setPreferences({ ...preferences, preferred_gender: e.target.value || null })
          }
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">No preference</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-binary</option>
          <option value="other">Other</option>
        </select>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition"
      >
        {saving ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  );
}
