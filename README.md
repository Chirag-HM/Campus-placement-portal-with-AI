# 🎓 Campus Placement Portal with AI

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-orange)

A next-generation, AI-powered platform designed to bridge the gap between students and recruiters. This portal leverages the power of Google Gemini AI to provide personalized career guidance, automated resume parsing, and an interactive learning hub.

---

## ✨ Key Features

- **🤖 AI Career Assistant**: Powered by Google Gemini 1.5 Flash for personalized mentorship and mock interview prep.
- **💼 Smart Job Board**: Integrated with Adzuna API for real-time job listings across India and beyond.
- **🎮 Gamified Experience**: Earn points, badges, and level up as you complete applications and courses.
- **📚 Learning Hub**: Access curated courses and certifications to boost your professional profile.
- **⚡ Real-time Notifications**: Instant updates on application status and messages via Socket.io.
- **🔐 Secure Authentication**: Integrated Google OAuth 2.0 and JWT-based session management.
- **📁 Portfolio Management**: Create a stunning professional portfolio with Cloudinary-hosted assets.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Vanilla CSS (Premium Glassmorphic Design)
- **State Management**: React Context API
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Real-time**: Socket.io
- **AI Integration**: Google Generative AI (Gemini)
- **File Storage**: Cloudinary

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Chirag-HM/Campus-placement-portal-with-AI.git
cd Campus-placement-portal-with-AI
```

### 2. Setup Server
```bash
cd server
npm install
# Create a .env file based on the keys mentioned in DEPLOYMENT.md
npm run dev
```

### 3. Setup Client
```bash
cd ../client
npm install
npm run dev
```

---

## 📖 Documentation

- [**Deployment Guide**](./DEPLOYMENT.md) - Detailed instructions for production deployment.
- [**API Reference**](./server/README.md) - (Coming soon) Backend API endpoints description.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Developed with ❤️ by the Chirag-HM Team
</p>