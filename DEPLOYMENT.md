# 🚀 Deployment Guide: Campus Placement Portal

This guide provides step-by-step instructions for deploying the **Campus Placement Portal** to production.

---

## 🛠️ Prerequisites

Before you begin, ensure you have:
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (for database).
- A [Cloudinary](https://cloudinary.com/) account (for image uploads).
- [Google Cloud Console](https://console.cloud.google.com/) project (for Google OAuth).
- [Adzuna Developer](https://developer.adzuna.com/) account (for job listings).
- [Google AI Studio](https://aistudio.google.com/) account (for Gemini AI).

---

## 🏗️ Backend Deployment (Node.js/Express)

We recommend using **Render**, **Railway**, or **Vercel** for the backend.

### 1. Render Deployment (Recommended)
1. Create a new **Web Service** on [Render](https://render.com/).
2. Connect your GitHub repository.
3. Set the following configuration:
   - **Root Directory**: `server`
   - **Build Command**: `npm install --legacy-peer-deps`
   - **Start Command**: `npm start`
4. Add the **Environment Variables** (see below).

### 2. Environment Variables (Server)
Set these variables in your hosting provider's dashboard:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB Connection String | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT Tokens | `your_random_secret` |
| `SESSION_SECRET` | Secret for Sessions | `your_session_secret` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `...googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `...` |
| `GOOGLE_CALLBACK_URL` | Your production callback URL | `https://your-api.com/api/auth/google/callback` |
| `GEMINI_API_KEY` | Google Gemini API Key | `AIza...` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Name | `...` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `...` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `...` |
| `CLIENT_URL` | Your production frontend URL | `https://your-app.vercel.app` |
| `ADZUNA_APP_ID` | Adzuna App ID | `...` |
| `ADZUNA_APP_KEY` | Adzuna App Key | `...` |

---

## 🎨 Frontend Deployment (React/Vite)

We recommend using **Vercel** or **Netlify** for the frontend.

### 1. Vercel Deployment
1. Create a new project on [Vercel](https://vercel.com/).
2. Connect your GitHub repository.
3. Set the following configuration:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the **Environment Variables** (see below).

### 2. Environment Variables (Client)
Set these variables in your hosting provider's dashboard:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Production Backend API URL | `https://your-api.com/api` |
| `VITE_SOCKET_URL` | Production Backend URL | `https://your-api.com` |

---

## 🔒 Post-Deployment Checklist

### 1. Update Google OAuth Redirect URI
Go to [Google Cloud Console](https://console.cloud.google.com/):
1. Navigate to **APIs & Services > Credentials**.
2. Edit your OAuth 2.0 Client ID.
3. Add your production callback URL to **Authorized redirect URIs**:
   - `https://your-api-url.onrender.com/api/auth/google/callback`

### 2. Update CORS Settings
Ensure the `CLIENT_URL` in your server `.env` matches your deployed frontend URL. This allows the frontend to communicate with the backend.

### 3. Database Whitelisting
If using MongoDB Atlas, ensure you whitelist `0.0.0.0/0` (for testing) or the specific IP address of your backend server to allow connections.

---

## 🚀 Local Production Testing
To test the production build locally:
```bash
# Backend
cd server
npm install
npm start

# Frontend
cd client
npm install
npm run build
npm run preview
```

---

> [!TIP]
> Always use environment variables for sensitive information. Never commit your `.env` file to version control.
