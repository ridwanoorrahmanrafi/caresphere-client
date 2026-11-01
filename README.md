# CareSphere - Community-Driven Social Development Events Platform

> **Live Website URL:** [https://caresphere-events.vercel.app](https://caresphere-events.vercel.app) *(Replace with your deployed Vercel live URL)*

CareSphere is a modern, responsive web application empowering citizens and local organizations to organize, discover, and join grassroots community service initiatives across Bangladesh and beyond.

---

##  Key Features

- **Grassroots Social Service Event Creation:** Any registered community leader or volunteer can schedule and publish social welfare drives (winter clothes, blanket distribution, clean-up drives, tree plantation, free healthcare camps). Strict validation guarantees all events have verified future dates.
- **1-Click Volunteer RSVP Tracking:** Seamless RSVP mechanism enabling users to join volunteer initiatives in real-time, instantly persisting their commitment to the database and showing updated attendee counters.
- **Organizer Event Management (Full CRUD):** Organizers retain full control over their created events with dedicated Edit and Delete operations, backed by strict server-side creator authorization and SweetAlert2 confirmation dialogs.
- **Full-System Dark & Light Mode Theme:** Dynamic theme switching engine persisted in local storage with smooth system-wide transitions across every component and modal.
- **Persistent JWT Authentication & Protected Routes:** Secure registration and login featuring password strength verification (uppercase, lowercase, 6+ characters) and Google single sign-on. Protected routes guarantee a smooth reloading experience without unexpected login kickbacks.
- **Interactive Search & Category Filtering:** Instant search bar and category pills allowing volunteers to filter initiatives by type (Donation, Clean-up, Plantation, Healthcare, Education) and search by title or neighborhood (e.g., Mirpur, Mohammadpur, Uttara).
- **Add to Calendar & Social Sharing:** Volunteers can export event dates to Google Calendar and copy direct shareable links to mobilize friends and family.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Modern Glassmorphism
- **Icons:** Lucide React
- **Notifications:** React Hot Toast & SweetAlert2
- **Visuals:** Canvas Confetti

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js (v18.0.0 or later)
- npm or yarn

### 2. Environment Variables
Create a `.env.local` file in the root of the `client` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=CareSphere
```

### 3. Installation & Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License
This project was developed for Assignment 8 (Batch 14 - Web Development).
