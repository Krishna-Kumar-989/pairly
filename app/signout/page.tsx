// app/signout/page.tsx

import Navbar from '../instruments/navbar';
import { LogOut } from 'lucide-react';
import SignOutButton from './signoutbtn';

export default function SignOutPage() {
  return (
    <>
      <Navbar />
      <main className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <div className="flex justify-center mb-4">
            <LogOut className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="mb-6 text-center text-2xl font-semibold text-gray-800">
            Are you sure you want to sign out?
          </h1>
          <div className="flex justify-center">
            <SignOutButton className="w-full max-w-xs" />
          </div>
        </div>
      </main>
    </>
  );
}
