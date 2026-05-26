import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrayerProvider } from "./contexts/PrayerContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Instructions } from "./pages/Instructions";
import { BuddhaRoom } from "./pages/BuddhaRoom";
import { Stats } from "./pages/Stats";
import { UserLogin } from "./pages/user/Login";
import { UserRegister } from "./pages/user/Register";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { GoogleOAuthProvider } from '@react-oauth/google';

// Define the Layout wrapper that contains repeating UI
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 py-4 z-10 relative">
        {children}
      </main>

      <Footer />

      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      />
    </div>
  );
}

// Ensure your whole application is wrapped with the Provider and Router
export default function App() {
  return (
    <GoogleOAuthProvider clientId="1041539420586-h88bqsjgn8925jbpengq2leqpij7vc2q.apps.googleusercontent.com">
      <AuthProvider>
        <PrayerProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/instructions" element={<Instructions />} />
                <Route path="/buddhaRoom" element={<BuddhaRoom />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/login" element={<UserLogin />} />
                <Route path="/register" element={<UserRegister />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                {/* Future pages can be easily added here: 
                <Route path="/about" element={<About />} /> 
                <Route path="/community" element={<Community />} /> 
            */}
              </Routes>
            </Layout>
          </BrowserRouter>
        </PrayerProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
