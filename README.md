# OLX Clone

A modern, feature-rich clone of OLX built with **React**, **Firebase**, and **Tailwind CSS**. This full-stack marketplace application allows users to buy, sell, and browse classified advertisements with real-time updates and secure authentication.

---

## 🛠 Tech Stack

### Frontend

- **React 18** - Modern React with hooks and functional components
- **React Router DOM** - Client-side routing and navigation
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Feather icons (`FiHeart`, `FiMenu`, `FiX`)
- **Vite / Create React App** - Fast build tool and development server

### Backend & Database

- **Firebase Authentication** - User authentication and authorization
- **Firebase Firestore** - NoSQL cloud database for real-time data
- **Firebase Storage** - Cloud storage for product images
- **Firebase Hosting** - Production deployment platform

### State Management & Hooks

- **React Hooks** - `useState`, `useEffect`, `useRef`, `useContext`
- **React Firebase Hooks** - `useAuthState` for authentication state
- **Custom Hooks** - Reusable logic for data fetching and state management

---

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account and project

### Step 1: Clone the Repository

```bash
git clone https://github.com/Sarathjithu89/Olx_clone.git
cd olx-clone
```

````
### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
````

### Step 3: Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** (Email/Password and Google)
3. Create a **Firestore Database**
4. Enable **Firebase Storage**
5. Copy your Firebase configuration

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_APIKEY=your_api_key
VITE_FIREBASE_AUTHDOMAIN=your_auth_domain
VITE_FIREBASE_PROJECTID=your_project_id
VITE_FIREBASE_STORAGEBUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGINGSENDERID=your_messaging_sender_id
VITE_FIREBASE_APPID=your_app_id
```

### Step 4: Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

```

```
