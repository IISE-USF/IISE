# IISE Chapter Website

A full-featured chapter website built with React, Vite, Tailwind CSS, and Firebase.

## Features
- 🏠 Home page with upcoming events & announcements
- 📅 Events page (upcoming + past)
- 📢 Announcements with category filters
- 🖼️ Photo gallery with image uploads
- 👥 Meet the Crew / team page
- 💬 Feedback form
- 🔐 Admin dashboard (protected, Firebase Auth)
- 🚀 Auto-deploy to GitHub Pages via GitHub Actions

---

## Setup Instructions

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Add project** → follow the steps
3. In the project, go to **Build → Firestore Database** → Create database (start in test mode)
4. Go to **Build → Storage** → Get started
5. Go to **Build → Authentication** → Get started → Enable **Email/Password** and **Google**
6. Go to **Project Settings → General → Your apps** → click **</>** (Web) → Register app
7. Copy your config values

### 2. Configure Environment Variables

**For local development:**
```bash
cp .env.example .env.local
# Fill in your Firebase values in .env.local
```

**For GitHub Pages deployment:**
Go to your GitHub repo → Settings → Secrets and variables → Actions → New repository secret, and add each of:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### 3. Enable GitHub Pages
Go to your repo → **Settings → Pages → Source → GitHub Actions**

### 4. Create your Admin account
In Firebase Console → Authentication → Add user → set an email + password.
Use those credentials to log in at `/login` on your site.

### 5. Run Locally
```bash
npm install
npm run dev
```

### 6. Deploy
Push to the `main` branch — GitHub Actions will build and deploy automatically.

---

## Project Structure
```
src/
  components/     # Navbar, Footer, Layout, etc.
  contexts/       # AuthContext (Firebase Auth)
  firebase/       # config.js + db.js (all Firestore helpers)
  pages/          # Home, Events, Announcements, Gallery, Team, Feedback, Admin, Login
```

## Firestore Collections
| Collection      | Fields |
|-----------------|--------|
| `events`        | title, date, time, location, description, image_url, rsvp_link |
| `announcements` | title, body, category, link |
| `gallery`       | url, caption, category |
| `team`          | name, role, bio, image_url, email, order |
| `feedback`      | name, email, rating, message, status |
