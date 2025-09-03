

# Pairly

**Pairly** is a modern, real-time dating application designed to help people connect through shared interests. Currently under active development, Pairly emphasizes a seamless, intuitive, and engaging user experience — from profile creation to real-time chatting.

**Live Demo:** https://pairly-five.vercel.app

---

## Features

* **User Authentication** – Secure sign-up and login powered by Supabase.
* **Profile Customization** – Fill out personal details (name, age, location) and upload multiple photos.
* **Match by Choice** – Browse random profiles and choose to either skip or send a match request with a personalized message.
* **Real-time Notifications** – Receive instant alerts when someone interacts with you.
* **Match Management** – Accept or reject incoming requests; accepted matches appear in your **Matches List**.
* **Live Chat** – Engage in real-time conversations with your matches, powered by Supabase Realtime.
* **Profile Viewing** – Access detailed profiles of your matches at any time.

---

## Tech Stack

* **Frontend:** Next.js 15, React 19, TailwindCSS 4
* **Backend / Database:** Supabase (PostgreSQL)
* **Realtime Engine:** Supabase Realtime
* **Icons & UI Components:** lucide-react, react-icons
* **Maps & Location Services:** TomTom Web SDK

---

## Roadmap

* **Smarter Match Recommendations** – Suggest matches based on user preferences, behavior, and profile data.
* **Enhanced Notifications** – Push alerts for new messages, matches, and key events.
* **Media Sharing** – Enable photo and video sharing in chat.
* **Privacy & Security Controls** – More granular settings for visibility, data privacy, and account security.

---

## Getting Started

To run **Pairly** locally:

1. **Clone the repository**

   ```bash
   git clone https://github.com/Krishna-Kumar-989/pairly
   cd pairly
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

---
