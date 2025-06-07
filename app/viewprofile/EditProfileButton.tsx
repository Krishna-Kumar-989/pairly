'use client';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import type { JSX } from 'react';

export default function EditProfileButton(): JSX.Element {
  return (
    <Link
      href="/editprofile"
      className="flex items-center gap-2 bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white px-5 py-2.5 rounded-2xl shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
    >
      <Pencil className="w-5 h-5" />
      <span className="font-semibold">Edit Profile</span>
    </Link>
  );
}
