import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrayerProvider } from "./contexts/PrayerContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Instructions } from "./pages/Instructions";

// Define the Layout wrapper that contains repeating UI
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 py-4 z-10 relative">
        {children}
      </main>

      <Footer />

      {/* Background patterns */}
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
    <PrayerProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/instructions" element={<Instructions />} />
            {/* Future pages can be easily added here: 
                <Route path="/about" element={<About />} /> 
                <Route path="/community" element={<Community />} /> 
            */}
          </Routes>
        </Layout>
      </BrowserRouter>
    </PrayerProvider>
  );
}
