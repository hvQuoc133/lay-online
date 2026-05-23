import React, { useState } from "react";
import { CheckCircle2, Activity, CalendarDays, Users, Heart, MousePointer2 } from "lucide-react";
import { GiLotus } from "react-icons/gi";
import { FaCross } from "react-icons/fa";
import { motion, AnimatePresence } from "motion/react";
import { usePrayerContext } from "../contexts/PrayerContext";
import { AnimatedNumber } from "../components/AnimatedNumber";

export function Home() {
  const { state, pray, joinRoom, leaveRoom } = usePrayerContext();
  const [activeRoom, setActiveRoom] = useState<"buddha" | "jesus" | null>(null);
  const [showPrayAnimation, setShowPrayAnimation] = useState(false);

  const handlePray = () => {
    pray();
    setShowPrayAnimation(true);
    setTimeout(() => setShowPrayAnimation(false), 1000);
  };

  const handleJoinRoom = (room: "buddha" | "jesus") => {
    if (activeRoom === room) {
      leaveRoom(room);
      setActiveRoom(null);
    } else {
      if (activeRoom) leaveRoom(activeRoom);
      joinRoom(room);
      setActiveRoom(room);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showPrayAnimation && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.5 }}
            animate={{ opacity: 1, y: -100, scale: 1.5 }}
            exit={{ opacity: 0, y: -150 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-6xl pointer-events-none drop-shadow-md"
          >
            🙏 +1
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative py-8 md:py-12 flex flex-col items-center justify-center mx-auto max-w-4xl z-10 mb-[120px]">
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-display font-black text-black uppercase tracking-tighter mb-8 relative flex flex-col items-center"
        >
          <span className="text-6xl md:text-[72px] text-[50px] leading-none mb-2 md:mb-4 relative z-10">Lạy Online</span>
          <div className="relative text-5xl md:text-[64px] text-[45px] leading-none transform -rotate-2 mt-2">
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center text-white select-none whitespace-nowrap"
              style={{ WebkitTextStroke: '16px white', textShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              aria-hidden="true"
            >Phúc Tự Đến!</span>
            <span className="relative text-orange-500 whitespace-nowrap">Phúc Tự Đến!</span>
          </div>
        </motion.h1>
        <div className="text-lg md:text-xl font-bold relative inline-block z-10 text-gray-800 mt-4 text-center px-4">
          Lạy đi bạn ơi, đời bớt stress, tâm an, điểm tăng!
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-[60%] h-4 pointer-events-none -z-10">
            <svg viewBox="0 0 200 25" preserveAspectRatio="none" className="w-full h-full text-yellow-400 fill-none">
              <path d="M10 20 Q 100 5 190 20" stroke="currentColor" strokeWidth="12" strokeLinecap="round" className="opacity-80" />
              <path d="M20 18 Q 100 8 180 18" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="opacity-60" />
              <path d="M40 16 Q 100 10 160 16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-40" />
            </svg>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="grid lg:grid-cols-[1fr_auto_1fr] gap-12 lg:gap-3 items-stretch my-12 relative max-w-[1600px] mx-auto z-0 px-4">

        {/* CENTER ACTION */}
        <div className="flex flex-col items-center justify-start order-2 z-30 pt-6 md:py-15 relative w-full lg:min-w-[200px] mb-20 lg:mb-0">
          <div className="relative mb-6 md:mb-10 group cursor-pointer" onClick={handlePray}>
            <svg className="absolute -top-8 md:-top-10 left-1/2 -translate-x-1/2 w-16 md:w-20 h-8 md:h-10 text-black opacity-70" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M10 30 Q 25 10 40 30 T 70 30 T 90 10" strokeLinecap="round" />
            </svg>
            <div className="relative w-44 sm:w-56 h-auto transition-transform group-hover:-translate-y-2 group-active:translate-y-1">
              <img src="/images/img-4.png" alt="Speech Bubble" className="w-full h-auto drop-shadow-xl" />
              <div className="absolute inset-0 flex items-center justify-center p-4 md:p-6">
                <h4 className="font-black text-lg md:text-xl text-center leading-tight tracking-tighter text-black">
                  Chọn phòng <br /> và lạy thôi!
                </h4>
              </div>
            </div>
            <MousePointer2 className="absolute right-0 bottom-2 md:bottom-4 w-10 h-10 md:w-12 md:h-12 text-black fill-white drop-shadow-md transform rotate-12 transition-transform group-hover:scale-110" />
          </div>
          <div className="flex flex-col items-center text-center">
            <p className="font-black text-base md:text-lg text-gray-800 leading-tight text-center">
              Lạy xong thấy <br /> đời đẹp hơn hẳn!
            </p>
            <div className="mt-2 md:mt-1 w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center overflow-hidden">
              <img src="/images/img-3.png" alt="Bottom Meme" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>

        {/* Buddha Room */}
        <div className="col-span-1 order-1 relative">
          <div className="absolute bottom-[calc(100%-5px)] left-4 md:left-8 z-20 pb-1 pointer-events-none">
            <div className="relative">
              <img src="/images/img-1.png" alt="Buddha Character" className="w-[130px] md:w-[200px] lg:w-[240px] h-auto object-contain" />
              <div className="absolute top-2/3 -right-30 md:-right-60 lg:-right-50 transform -translate-y-1/2 -rotate-5 whitespace-nowrap">
                <h3 className="font-black text-2xl md:text-5xl text-yellow-400 drop-shadow-[2px_2px_0_#000] lg:drop-shadow-[3px_3px_0_#000] uppercase italic tracking-tighter leading-none">
                  Lạy đi <br /> đừng ngại!
                </h3>
              </div>
            </div>
          </div>

          <div className={`h-full bg-gradient-to-br from-yellow-50 to-orange-100 rounded-3xl border-2 border-yellow-400 shadow-lg relative overflow-hidden transition-all duration-300 ${activeRoom === 'buddha' ? 'ring-4 ring-yellow-400 scale-105 z-10' : 'hover:scale-[1.01]'}`}>
            <div className="flex flex-col sm:flex-row h-full w-full">
              <div className="p-6 md:p-8 flex-1 relative z-10 pb-8 sm:pb-8 max-w-full sm:max-w-[60%]">
                <div className="mb-4 relative group">
                  <GiLotus className="w-16 h-16 text-amber-500 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)] transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full -z-10 animate-pulse"></div>
                </div>
                <h2 className="text-2xl lg:text-2xl font-black font-display text-orange-600 mb-2">PHÒNG TÍCH ĐỨC</h2>
                <p className="font-bold text-gray-800 mb-4">Lạy để tâm an, phúc đến</p>
                <ul className="space-y-2 mb-6 font-bold text-sm text-gray-700">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500 fill-green-100" /> Cầu bình an</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500 fill-green-100" /> Tích phúc đức</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500 fill-green-100" /> Giảm stress hiệu quả</li>
                </ul>
                <button onClick={() => handleJoinRoom('buddha')} className={`w-full sm:w-auto px-6 py-3 rounded-xl font-black shadow-solid transition-transform active:translate-y-1 active:shadow-none border-2 border-black ${activeRoom === 'buddha' ? 'bg-orange-500 text-white' : 'bg-yellow-400 text-black hover:bg-yellow-300'}`}>
                  {activeRoom === 'buddha' ? 'Rời phòng lạy 🙏' : 'Vào phòng lạy Phật 🙏'}
                </button>
                <div className="mt-4 flex items-center gap-2 text-sm font-bold text-gray-600 mt-5">
                  <Users className="w-4 h-4" />
                  <span><AnimatedNumber value={state.buddhaRoomActive} /> người đang lạy</span>
                </div>
              </div>
              <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-3/6">
                <img src="/images/bg-1.png" alt="Buddha Background" className="absolute inset-0 w-full h-full object-cover object-center" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 30%)', maskImage: 'linear-gradient(to right, transparent, black 30%)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Jesus Room */}
        <div className="col-span-1 order-3 relative">
          <div className="absolute bottom-[calc(100%-5px)] right-4 md:right-8 z-20 pb-1 pointer-events-none">
            <div className="relative">
              <img src="/images/img-2.png" alt="Crying Character" className="w-[130px] md:w-[200px] lg:w-[240px] h-auto object-contain" />
              <div className="absolute top-2/3 -left-30 md:-left-48 lg:-left-50 transform -translate-y-1/2 -rotate-5 whitespace-nowrap">
                <h3 className="font-black text-4xl md:text-6xl text-blue-900 uppercase italic tracking-tighter opacity-90 leading-none">
                  FAITH <br /> <span className="text-blue-600">&gt; WIFI</span>
                </h3>
              </div>
            </div>
          </div>

          <div className={`h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl border-2 border-blue-400 shadow-lg relative overflow-hidden transition-all duration-300 ${activeRoom === 'jesus' ? 'ring-4 ring-blue-400 scale-105 z-10' : 'hover:scale-[1.01]'}`}>
            <div className="flex flex-col sm:flex-row h-full w-full">
              <div className="p-6 md:p-8 flex-1 relative z-10 pb-8 sm:pb-8 max-w-full sm:max-w-[60%]">
                <div className="mb-4 relative group">
                  <FaCross className="w-14 h-14 text-blue-700 drop-shadow-[0_2px_10px_rgba(29,78,216,0.4)] transition-transform duration-500 group-hover:rotate-12" />
                  <div className="absolute inset-0 bg-blue-400/10 blur-xl rounded-full -z-10 animate-pulse"></div>
                </div>
                <h2 className="text-2xl lg:text-2xl font-black font-display text-blue-700 mb-2">PHÒNG CẦU NGUYỆN</h2>
                <p className="font-bold text-gray-800 mb-4">Cầu nguyện để yêu thương lan tỏa</p>
                <ul className="space-y-2 mb-6 font-bold text-sm text-gray-700">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500 fill-green-100" /> Xin ơn bình an</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500 fill-green-100" /> Sống tốt mỗi ngày</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500 fill-green-100" /> Yêu thương mọi người</li>
                </ul>
                <button onClick={() => handleJoinRoom('jesus')} className={`w-full sm:w-auto px-6 py-3 rounded-xl font-black shadow-solid transition-transform active:translate-y-1 active:shadow-none border-2 border-black ${activeRoom === 'jesus' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-400'}`}>
                  {activeRoom === 'jesus' ? 'Rời phòng cầu nguyện 🙏' : 'Vào phòng cầu nguyện 🙏'}
                </button>
                <div className="mt-4 flex items-center gap-2 text-sm font-bold text-gray-600 mt-5">
                  <Users className="w-4 h-4" />
                  <span><AnimatedNumber value={state.jesusRoomActive} /> người đang cầu nguyện</span>
                </div>
              </div>
              <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-3/6">
                <img src="/images/bg-2.png" alt="Cathedral Background" className="absolute inset-0 w-full h-full object-cover object-center" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 30%)', maskImage: 'linear-gradient(to right, transparent, black 30%)' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[var(--color-bg-primary)] border-[2px] border-[oklch(70.5%_0.213_47.604)]/30 rounded-3xl py-10 px-6 mt-16 shadow-sm max-w-[1540px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 divide-y md:divide-y-0 lg:divide-x divide-black/5">
          {[
            { icon: <Users className="w-12 h-12 text-blue-500" />, label: "Tổng người tham gia", value: state.totalMembers, unit: "thành viên" },
            { icon: <Heart className="w-10 h-10 text-red-500 fill-red-400" />, label: "Tổng lượt lạy & cầu nguyện", value: state.totalPrayers, unit: "lượt" },
            { icon: <span className="text-4xl">🙏</span>, label: "Lượt lạy hôm nay", value: state.prayersToday, unit: "lượt" },
            { icon: <Activity className="w-10 h-10 text-yellow-500" />, label: "Đang online", value: state.onlineMembers, unit: "người" },
            { icon: <CalendarDays className="w-10 h-10 text-purple-500" />, label: "Ngày đẹp lạy nhiều", value: state.bestDay, unit: "(Ai cũng biết mà 😄)", isText: true },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-center md:justify-start gap-4 px-4 py-2 md:py-4 lg:py-0">
              <div className="shrink-0">{item.icon}</div>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter leading-none mb-1">{item.label}</p>
                <p className="text-2xl font-black text-black leading-none">
                  {item.isText ? item.value : <AnimatedNumber value={Number(item.value)} />}
                </p>
                <p className="text-xs text-gray-400 font-bold mt-1">{item.unit}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="my-5 max-w-[1600px] mx-auto px-4">
        <div className="text-center mb-16 md:mb-5 pt-10 relative">
          <div className="inline-block relative z-10 px-12 py-3">
            <div className="absolute inset-0 bg-yellow-200 -rotate-1 skew-x-12 opacity-90 rounded-sm -z-10"></div>
            <div className="absolute inset-x-2 inset-y-1 bg-yellow-200 rotate-2 -skew-x-6 opacity-70 rounded-sm -z-10"></div>
            <h2 className="font-display font-black text-2xl md:text-3xl text-xl uppercase tracking-tighter text-black relative">
              Vì sao nên lạy online?
            </h2>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row items-stretch justify-between gap-6 relative mt-12">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {[
              { title: "Tâm an, không bực", desc: "Lạy xong tự nhiên thấy lòng nhẹ tênh!", img: "/images/status-1.png", color: "bg-blue-100" },
              { title: "Phúc đức tăng tiến", desc: "Tích tiểu thành đại, phúc đức đầy nhà!", img: "/images/status-2.png", color: "bg-green-100" },
              { title: "Giảm stress cực mạnh", desc: "Lạy 10 phút = thiền 1 tiếng!", img: "/images/status-3.png", color: "bg-orange-100" },
              { title: "Kết nối cộng đồng", desc: "Lạy cùng mọi người, phúc gấp bội!", img: "/images/status-4.png", color: "bg-purple-100" }
            ].map((item, i) => (
              <div key={i} className="bg-white border border-black/20 rounded-2xl py-2 px-1 flex items-center gap-4 relative overflow-hidden hover:border-black/40 transition-colors shadow-sm">
                <img src={item.img} alt={item.title} className="w-20 h-20 md:w-24 md:h-24 object-contain shrink-0" />
                <div className="flex-1">
                  <div className={`inline-block px-3 py-1 rounded-full ${item.color} mb-2`}>
                    <h4 className="font-black text-[10px] md:text-xs text-gray-800">{item.title}</h4>
                  </div>
                  <p className="text-[12px] font-bold text-gray-500 leading-tight">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-end shrink-0 relative px-4">
            <div className="relative">
              <img src="/images/meme-1.png" alt="Panda Meme" className="w-64 h-auto object-contain" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}