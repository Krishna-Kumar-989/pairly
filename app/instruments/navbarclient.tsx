'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/auth-js';
import { supabase } from '../lib/supabase';

import {
  Home,
  Heart,
  MessageCircle,
  Clock,
  Bell,
  Settings,
  LogOut,
  UserRound,
} from 'lucide-react';

export type NavItem = {
  label: string;
  iconName: string;
  showDot?: boolean;
  onClick: string;
};

const iconMap: Record<string, React.ComponentType<any>> = {
  Home,
  Heart,
  MessageCircle,
  Clock,
  Bell,
  Settings,
  LogOut,
  UserRound,
};

interface UserDataFormProps {
  user: User | null;
}

export default function NavbarClient({ user }: UserDataFormProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const [pendingCount, setPendingCount] = useState<number>(0);


  //for pending_count starts

  useEffect(() => {
    if (!user?.id) return;

    // Fetch initial count
    const fetchInitialCount = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('pending_request_count')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching pending request count:', error);
        return;
      }

      setPendingCount(data?.pending_request_count ?? 0);
    };

    fetchInitialCount();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const updatedCount = payload.new?.pending_request_count ?? 0;
          setPendingCount(updatedCount);
          console.log('Realtime Pending Request Count:', updatedCount);
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user?.id]);


//forpendingcount ends






  const navItems: NavItem[] = [
    { label: 'Home', iconName: 'Home', onClick: 'navigate:/homepage' },
    { label: 'Match', iconName: 'Heart', onClick: 'navigate:/potentialmatch' },
    { label: 'Chat', iconName: 'MessageCircle', onClick: 'navigate:/chat' },
    { label: 'Pending', iconName: 'Clock', onClick: 'navigate:/pending', showDot: pendingCount > 0 },
    { label: 'Notifications', iconName: 'Bell', onClick: 'notifications' },
    { label: 'Settings', iconName: 'Settings', onClick: 'settings' },
    { label: 'Logout', iconName: 'LogOut', onClick: 'navigate:/signout' },
    { label: 'Profile', iconName: 'UserRound', onClick: 'navigate:/viewprofile' },
  ];

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
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-pink-50 via-pink-100 to-white/80 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="text-black font-semibold text-lg tracking-wide relative">
            Pairly
            <span className="block h-1 w-full rounded-full bg-gradient-to-r from-pink-300 via-pink-200 to-pink-100 mt-1"></span>
          </div>
          <button
            className="md:hidden text-black relative"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            type="button"
          >
            {menuOpen ? '✕' : '☰'}
            {pendingCount > 0 && (
              <span
                className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"
                aria-label="Notification dot"
              />
            )}
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-5">
          {navItems.map(({ label, iconName, onClick, showDot }) => {
            const Icon = iconMap[iconName];
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
            const Icon = iconMap[iconName];
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
    </nav>
  );
}