'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  Heart,
  MessageCircle,
  Clock,
  Bell,
  Settings,
  LogOut,
  User,
} from 'lucide-react';

import { NavItem } from './navbar';  // Import the NavItem type

// Map icons using their names as keys.
const iconMap: Record<NavItem['iconName'], React.ComponentType<any>> = {
  Home,
  Heart,
  MessageCircle,
  Clock,
  Bell,
  Settings,
  LogOut,
  User,
};

// Define the props interface for NavButtons component
type NavButtonsProps = {
  navItems: NavItem[];  // Use NavItem[] as the type for the navItems prop
};

export default function NavButtons({ navItems }: NavButtonsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleClick = (action: string) => {
    if (action.startsWith('navigate:')) {
      const path = action.split(':')[1];
      router.push(path);
      setMenuOpen(false);
    } else {
      switch (action) {
        case 'notifications':
          console.log('Notifications clicked');
          break;
        case 'settings':
          console.log('Settings clicked');
          break;
        case 'logout':
          console.log('Logout clicked');
          break;
        default:
          console.warn(`Unknown action: ${action}`);
      }
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="text-black font-semibold text-lg tracking-wide relative">
            Pairly
            <span className="block h-1 w-full rounded-full bg-gradient-to-r from-pink-300 via-pink-200 to-pink-100 mt-1"></span>
          </div>
          <button
            className="md:hidden text-black"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            type="button"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-5">
          {navItems.map(({ label, iconName, onClick, showDot }) => {
            const Icon = iconMap[iconName];  // TypeScript knows `iconName` is a valid key in `iconMap`
            return (
              <button
                key={label}
                onClick={() => handleClick(onClick)}
                className="relative text-black hover:text-pink-500 transition-colors duration-200"
                aria-label={label}
                type="button"
              >
                {Icon && <Icon size={24} strokeWidth={2} />}
                {showDot && (
                  <span
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-2 w-2 rounded-full bg-red-500"
                    aria-label="Notification dot"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-3">
          {navItems.map(({ label, iconName, onClick, showDot }) => {
            const Icon = iconMap[iconName];  // TypeScript knows `iconName` is a valid key in `iconMap`
            return (
              <button
                key={label}
                onClick={() => handleClick(onClick)}
                className="relative flex items-center space-x-3 text-black hover:text-pink-500 transition-colors duration-200"
                type="button"
              >
                {Icon && <Icon size={20} strokeWidth={2} />}
                <span>{label}</span>
                {showDot && (
                  <span
                    className="absolute top-1 right-6 h-2 w-2 rounded-full bg-red-500"
                    aria-label="Notification dot"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
