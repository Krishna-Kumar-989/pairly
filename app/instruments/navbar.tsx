'use client';

import { useRouter } from 'next/navigation';
import type { JSX } from 'react';
import {
  Home,
  Heart,
  MessageCircle,
  User,
  Clock,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react';
import React from 'react';

export default function Navbar(): JSX.Element {
  const router = useRouter();

  const handleHomeClick = () => router.push('/homepage');
  const handleMatchClick = () => router.push('/potentialmatch');
  const handleChatClick = () => router.push('/chat');
  const handleProfileClick = () => router.push('/viewprofile');
  const handlePendingClick = () => router.push('/pending');
  const handleNotificationsClick = () => console.log('Notifications clicked');
  const handleSettingsClick = () => console.log('Settings clicked');
  const handleLogoutClick = () => console.log('Logout clicked');

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-pink-50 via-pink-100 to-white/80 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-5">
          <button
            onClick={handleHomeClick}
            className="text-black hover:text-pink-500 transition-colors duration-200"
          >
            <Home size={24} strokeWidth={2} />
          </button>
          <button
            onClick={handleMatchClick}
            className="text-black hover:text-pink-500 transition-colors duration-200"
          >
            <Heart size={24} strokeWidth={2} />
          </button>
          <button
            onClick={handleChatClick}
            className="text-black hover:text-pink-500 transition-colors duration-200"
          >
            <MessageCircle size={24} strokeWidth={2} />
          </button>
          <button
            onClick={handlePendingClick}
            className="text-black hover:text-pink-500 transition-colors duration-200"
          >
            <Clock size={24} strokeWidth={2} />
          </button>
        </div>

        {/* Center - Website Name */}
        <div className="text-black font-semibold text-lg tracking-wide drop-shadow-sm relative">
          Pairly
          <span className="block h-1 w-full rounded-full bg-gradient-to-r from-pink-300 via-pink-200 to-pink-100 mt-1"></span>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-5">
          <button
            onClick={handleNotificationsClick}
            className="text-black hover:text-pink-500 transition-colors duration-200"
          >
            <Bell size={24} strokeWidth={2} />
          </button>
          <button
            onClick={handleSettingsClick}
            className="text-black hover:text-pink-500 transition-colors duration-200"
          >
            <Settings size={24} strokeWidth={2} />
          </button>
          <button
            onClick={handleLogoutClick}
            className="text-black hover:text-pink-500 transition-colors duration-200"
          >
            <LogOut size={24} strokeWidth={2} />
          </button>
          <button
            onClick={handleProfileClick}
            className="text-black hover:text-pink-500 transition-colors duration-200"
          >
            <User size={24} strokeWidth={2} />
          </button>
        </div>
      </div>
    </nav>
  );
}
