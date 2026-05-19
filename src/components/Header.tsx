import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedNumber } from "./AnimatedNumber";
import { usePrayerContext } from "../contexts/PrayerContext";

export function Header() {
  const { state } = usePrayerContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Trang chủ", path: "/", active: true },
    { name: "Hướng dẫn", path: "/" },
    { name: "Thống kê", path: "/" },
    { name: "Cộng đồng", path: "/" },
    { name: "Về chúng tôi", path: "/" },
  ];

  return (
    <header className="sticky top-0 w-full bg-[var(--color-bg-primary)] border-b border-black/10 py-2 z-[100]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-12 flex items-center justify-between">

        {/* LOGO & SLOGAN */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Logo" className="w-11 h-13 sm:w-13 sm:h-15 object-cover" />
            <div>
              <h1 className="font-display font-bold text-lg sm:text-xl uppercase tracking-tighter leading-none text-black">
                Lạy Online
              </h1>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 font-medium pt-1 leading-tight">
                Lạy là có phúc, <br className="sm:hidden" /> không lạy cũng... có phúc!
              </p>
            </div>
          </Link>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-bold text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`${link.active
                  ? "text-orange-500 underline decoration-2 underline-offset-4"
                  : "text-gray-700 hover:text-orange-500"
                } transition-colors whitespace-nowrap`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold bg-white/50 px-3 py-1.5 rounded-full border border-black/10">
            <Users className="w-3.5 h-3.5 text-green-600" />
            <span className="text-green-600"><AnimatedNumber value={state.onlineMembers} /></span>
            <span className="hidden xl:inline text-green-600"> đang lạy</span>
          </div>

          <button className="bg-yellow-400 border-2 border-black px-4 py-2 rounded-full font-black text-xs sm:text-sm shadow-[3px_3px_0_0_#000] active:translate-y-1 active:shadow-none transition-all text-black">
            Đăng nhập
          </button>

          <button
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden p-2 text-black"
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* MOBILE MENU MODAL (DRAWER) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[105] lg:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-[300px] sm:w-[380px] bg-[var(--color-bg-primary)] z-[110] p-6 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="flex justify-end mb-4">
                <button onClick={() => setIsMenuOpen(false)} className="p-2">
                  <X className="w-8 h-8 text-black" />
                </button>
              </div>

              <div className="flex flex-col gap-8">
                <p className="text-sm font-black uppercase text-gray-400 tracking-[0.2em] border-b border-black/5 pb-2">
                  Danh mục
                </p>

                <div className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`text-3xl font-black uppercase tracking-tighter transition-all ${link.active ? "text-orange-500" : "text-black hover:text-orange-500"
                        }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                <div className="mt-12">
                  <div className="flex items-center gap-4 bg-gray-200/50 p-6 rounded-[25px] border border-black/5">
                    <div className="bg-white p-3 rounded-2xl shadow-sm">
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-green-600 leading-none">
                        <AnimatedNumber value={state.onlineMembers} />
                      </span>
                      <span className="text-[10px] font-black text-green-600 uppercase mt-1 tracking-wider">
                        Thành viên online
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}