'use client'

import { useActionState } from 'react'
import { login, signup, type AuthState } from './actions'
import { UserRoundCheck } from 'lucide-react'

const initialState: AuthState = { error: null }

export default function LoginPage() {
  const [loginState, loginAction, isLoginPending] = useActionState<AuthState, FormData>(
    login,
    initialState
  )
  const [signupState, signupAction, isSignupPending] = useActionState<AuthState, FormData>(
    signup,
    initialState
  )

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-200 p-6">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden grid md:grid-cols-2">
        
        {/* Left side - Icon section */}
        <div className="bg-rose-300 flex flex-col justify-center items-center p-10">
          <UserRoundCheck className="w-24 h-24 text-pink-100 mb-6" strokeWidth={1.2} />
          <h2 className="text-3xl font-bold text-white">Welcome</h2>
        </div>

        {/* Right side - Form section */}
        <form method="post" className="p-10 space-y-6 bg-white text-black">
          <h1 className="text-2xl font-semibold text-center">Login or Sign Up</h1>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 border border-rose-200 rounded-md focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-2 border border-rose-200 rounded-md focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
            <p className="text-xs text-gray-600 mt-1">Minimum 6 characters</p>
          </div>

          {/* Error message */}
          {(loginState?.error || signupState?.error) && (
            <p className="text-sm text-center text-red-600">
              {loginState?.error || signupState?.error}
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              formAction={loginAction}
              disabled={isLoginPending}
              className="flex-1 bg-rose-500 text-white py-2 rounded-md hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoginPending ? 'Logging in...' : 'Log in'}
            </button>
            <button
              type="submit"
              formAction={signupAction}
              disabled={isSignupPending}
              className="flex-1 bg-rose-100 text-black py-2 rounded-md hover:bg-rose-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSignupPending ? 'Signing up...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
