// app/components/navbar.tsx
import {
  Home,
  Heart,
  MessageCircle,
  Clock,
  Bell,
  Settings,
  LogOut,
  User,
  LucideIcon,
} from 'lucide-react';

import NavButtons from './navbuttons';

import { syncPendingRequestsCount } from '@/app/utils/notification/syncPendingRequests'; // adjust this import


// Define NavItem type
export type NavItem = {
  label: string;
  iconName: string;  // pass icon name as string instead of icon component
  showDot?: boolean;
  onClick: string;
};

export default function Navbar() {
 
  const pendingCount = 1;

const navItems: NavItem[] = [
  { label: 'Home', iconName: 'Home', onClick: 'navigate:/homepage' },
  { label: 'Match', iconName: 'Heart', onClick: 'navigate:/potentialmatch' },
  { label: 'Chat', iconName: 'MessageCircle', onClick: 'navigate:/chat' },
  { label: 'Pending', iconName: 'Clock', onClick: 'navigate:/pending', showDot: pendingCount > 0 },
  { label: 'Notifications', iconName: 'Bell', onClick: 'notifications' },
  { label: 'Settings', iconName: 'Settings', onClick: 'settings' },
  { label: 'Logout', iconName: 'LogOut', onClick: 'logout' },
  { label: 'Profile', iconName: 'User', onClick: 'navigate:/viewprofile' },
];

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-pink-50 via-pink-100 to-white/80 backdrop-blur-md shadow-md">
      <NavButtons navItems={navItems} />
    </nav>
  );
}
