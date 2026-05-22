import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    ArrowLeft, Music, Share2, Copy, User,
    Trophy, Flame, Target, Star, Radio,
    CalendarDays, Settings, Mic, ArrowRight,
    Video, UserRoundX, CircleStar, ShieldCheck,
    Anvil
} from "lucide-react";
import { PiFlowerLotusThin, PiMountainsFill } from "react-icons/pi";
import { GiLotus } from "react-icons/gi";
import { AnimatedNumber } from "../components/AnimatedNumber";

const ROOM_DATA = {
    name: "Phòng Tích Đức 🙏",
    id: "#TICHDUC2024",
    host: { name: "Tâm Hướng Phật", isHost: true },
    totalPrayers: 1248,
    goal: 1000000,
    progress: 62,
};

const TOP_PRAYERS = [
    { rank: 2, name: "Phật Tử Tí Hon", count: 842, img: "/images/prayer-2.png", isLive: true },
    { rank: 4, name: "Sen Hồng Nở", count: 715, img: "/images/prayer-4.png", isLive: true },
    { rank: 1, name: "Tâm Hướng Phật", count: 1248, img: "/images/prayer-1.png", isLive: true, isHost: true },
    { rank: 3, name: "Bình An Tự Tại", count: 635, img: "/images/prayer-3.png", isLive: true },
    { rank: 5, name: "Lạc Thiện", count: 512, img: "/images/prayer-5.png", isLive: true },
];

const CAMP_DATA = {
    name: "Chánh Niệm",
    level: 3,
    currentXP: 650,
    maxXP: 1000,
    benefits: [
        "Tăng 10% hiệu quả lượt lạy",
        "Nhận điểm thưởng khi đạt mốc",
        "Top camp nhận huy hiệu đặc biệt"
    ]
};

const CHAT_MESSAGES = [
    { user: "Sen Hồng Nở", msg: "Mỗi ngày lạy một chút tâm an hơn rất nhiều ✨", time: "20:31" },
    { user: "Phật Tử Tí Hon", msg: "Cố lên mọi người ơi! 💪", time: "20:31" },
    { user: "Bình An Tự Tại", msg: "Lạy đều, tâm an nhé mọi người 🙏", time: "20:32" },
    { user: "Lạc Thiện", msg: "Nam mô bổn sư thích ca mâu ni", time: "20:32" },
];

const NOTIFICATIONS = [
    { msg: "Phật Tử Tí Hon vừa đạt 500 lượt lạy! 🔥", time: "2 phút trước" },
    { msg: "Sen Hồng Nở vừa đạt combo x20! ❤️", time: "5 phút trước" },
    { msg: "Phòng đã đạt 10,000 lượt lạy! 🙏", time: "10 phút trước" },
];

const COMMUNITY_CAMS = Array.from({ length: 20 }, (_, i) => ({
    rank: i + 6,
    name: ["Tâm Hướng Phật", "Minh Tâm", "Diệu Pháp", "An Nhiên", "Hạnh Phúc", "Thiện Lành", "Chân Tâm", "Quảng Đức", "Bảo An", "Tâm Nguyện"][i % 10],
    count: Math.floor(Math.random() * 500) + 100,
    isLive: true
}));


export function BuddhaRoom() {
    const [copied, setCopied] = useState(false);
    const [sortBy, setSortBy] = useState<"count" | "rank" | "name">("count");
    const [isSortOpen, setIsSortOpen] = useState(false);

    const sortedCams = [...COMMUNITY_CAMS].sort((a, b) => {
        if (sortBy === "count") return b.count - a.count;
        if (sortBy === "rank") return a.rank - b.rank;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
    });

    const handleCopy = () => {
        navigator.clipboard.writeText(ROOM_DATA.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-[1600px] mx-auto px-4">

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-black/10 rounded-xl font-black text-xs shadow-sm hover:bg-gray-50 transition-all">
                    <ArrowLeft size={14} /> Quay lại phòng
                </button>

                <div className="text-center flex flex-col items-center">
                    <div className="flex items-center gap-3 text-orange-600 mb-1">
                        <GiLotus size={32} />
                        <h1 className="font-display font-black text-3xl md:text-[64px] uppercase tracking-tighter">Phòng Tích Đức</h1>
                    </div>
                    <p className="text-xs xl:pt-3 md:text-sm font-bold text-gray-500 flex items-center gap-2">
                        Lạy để tích đức, gieo thiện lành, an yên mỗi ngày 🙏
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 border border-orange-100 rounded-xl font-black text-xs shadow-sm hover:bg-orange-100 transition-all">
                        <Music size={14} /> Bật nhạc niệm Phật
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-black/10 rounded-xl font-black text-xs shadow-sm hover:bg-gray-50 transition-all">
                        <Share2 size={14} /> Chia sẻ phòng
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">

                <aside className="lg:col-span-2 bg-white border border-black/5 rounded-[30px] p-6 shadow-sm h-full">
                    <h3 className="font-black text-[14x] text-orange-600 uppercase mb-6 border-b border-black/5 pb-2">Thông tin phòng</h3>

                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-2 flex items-center gap-2"><GiLotus size={12} /> Tên phòng:</p>
                            <p className="text-sm font-black text-black">{ROOM_DATA.name}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-2 flex items-center gap-2"><Target size={12} /> ID phòng:</p>
                            <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-black/5">
                                <span className="text-[11px] font-black text-orange-600">{ROOM_DATA.id}</span>
                                <button onClick={handleCopy} className="text-[9px] font-black text-gray-400 hover:text-black uppercase">{copied ? "Xong!" : "Sao chép"}</button>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-2 flex items-center gap-2"><User size={12} /> Chủ trì phòng:</p>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-black/5"><User size={16} className="text-gray-400" /></div>
                                <p className="text-[11px] font-black">{ROOM_DATA.host.name} <span className="text-[8px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded ml-1">Chủ trì</span></p>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Tổng lượt lạy trong phòng:</p>
                            <p className="text-xl font-black text-black"><AnimatedNumber value={ROOM_DATA.totalPrayers} /> lượt lạy</p>
                        </div>
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase">Mục tiêu phòng:</p>
                                <p className="text-[10px] font-black text-black">{ROOM_DATA.progress}%</p>
                            </div>
                            <p className="text-[11px] font-black text-black mb-2">1 triệu lượt lạy</p>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-black/5">
                                <div className="h-full bg-orange-500 w-[62%] rounded-full shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="lg:col-span-8 flex flex-col gap-6 h-full">
                    <div className="bg-white border border-black/10 rounded-[40px] p-8 shadow-sm h-full flex flex-col relative overflow-visible">
                        <h3 className="text-center font-black text-[14px] text-orange-600 uppercase">
                            Top 5 Phật tử lạy nhiều nhất
                        </h3>

                        <div className="grid grid-cols-5 gap-3 items-center flex-1 min-h-[420px]">
                            {TOP_PRAYERS.map((prayer, i) => (
                                <div
                                    key={i}
                                    className={`relative flex flex-col group transition-all duration-500 
            ${prayer.rank === 1 ? 'h-[85%]' : 'h-[70%]'}`}
                                >
                                    <div className={`relative flex-1 rounded-[25px] overflow-hidden border-2 transition-all duration-500 z-10
            ${prayer.rank === 1
                                            ? 'border-amber-400 shadow-[0_15px_40px_rgba(251,191,36,0.15)] ring-4 ring-amber-400/10'
                                            : 'border-black/5 shadow-sm'
                                        }`}>

                                        <img src="/images/img-7.png" alt={prayer.name} className="absolute inset-0 w-full h-full object-cover" />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>

                                        {prayer.rank !== 1 && prayer.isLive && (
                                            <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-0.5 rounded-full text-[7px] font-black flex items-center gap-1 z-20 animate-pulse uppercase">
                                                <Radio size={8} /> Live
                                            </div>
                                        )}

                                        {prayer.rank === 1 && prayer.isHost && (
                                            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-amber-500/90 text-white px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest border border-white/10 whitespace-nowrap">
                                                👑 Chủ trì
                                            </div>
                                        )}

                                        <div className={`absolute bottom-0 left-0 right-0 p-3 z-20 text-center flex flex-col items-center
              ${prayer.rank === 1 ? 'pb-8' : 'pb-3'}
            `}>
                                            <div className={`w-6 h-6 rounded-full border border-white/20 flex items-center justify-center font-black text-[10px] mb-2 shadow-lg
                ${prayer.rank === 1 ? 'bg-amber-400 text-white scale-110' : 'bg-white/20 text-white backdrop-blur-md'}
              `}>
                                                {prayer.rank}
                                            </div>

                                            <p className={`font-black leading-tight truncate text-white w-full
                ${prayer.rank === 1 ? 'text-sm mb-0.5' : 'text-[10px]'}
              `}>
                                                {prayer.name}
                                            </p>
                                            <p className={`font-bold text-orange-400 
                ${prayer.rank === 1 ? 'text-[11px]' : 'text-[8px]'}
              `}>
                                                {prayer.count} lượt lạy
                                            </p>
                                        </div>
                                    </div>

                                    {prayer.rank === 1 && (
                                        <div className="absolute -bottom-20 lg:-bottom-20 md:-bottom-12 left-1/2 -translate-x-1/2 w-[130%] pointer-events-none z-30">
                                            <img
                                                src="/images/lotus-pedestal.png"
                                                alt="Lotus Pedestal"
                                                className="w-full h-auto object-contain drop-shadow-[0_-5px_15px_rgba(251,191,36,0.5)]"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                <aside className="lg:col-span-2 bg-white border border-black/5 rounded-[30px] p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-6 h-6 bg-green-50 rounded-xl flex items-center justify-center border border-green-100 shadow-sm shrink-0">
                            <PiMountainsFill size={14} className="text-green-600" />
                        </div>

                        <h3 className="font-black text-[12px] text-gray-500">
                            Camp hiện tại:
                            <span className="text-green-600 ml-1">{CAMP_DATA.name}</span>
                        </h3>
                    </div>

                    <div className="w-full rounded-[20px] overflow-hidden border border-black/5 mb-6">
                        <img src="/images/img-10.png" alt="Camp" className="w-full h-full object-contain" />
                    </div>

                    <div className="mb-6">
                        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between text-[12px] font-black uppercase mb-2 gap-1">
                            <span className="text-black whitespace-nowrap">
                                Cấp độ {CAMP_DATA.level}
                            </span>

                            <span className="text-gray-400 text-[10px] xl:text-[11px] whitespace-nowrap">
                                {CAMP_DATA.currentXP} / {CAMP_DATA.maxXP} điểm
                            </span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-black/5 p-[1px]">
                            <div className="h-full bg-green-500 rounded-full w-[65%]"></div>
                        </div>
                    </div>

                    <p className="text-[12px] font-black text-black mb-3 uppercase tracking-tighter">Lợi ích camp:</p>
                    <ul className="space-y-3">
                        {CAMP_DATA.benefits.map((b, i) => (
                            <li key={i} className="flex items-start gap-2 text-[10px] font-bold text-gray-500 leading-tight">
                                <Star size={12} className="text-amber-400 fill-amber-400 shrink-0 mt-0.5" />
                                {b}
                            </li>
                        ))}
                    </ul>
                </aside>

            </div>

            <section className="max-w-[1600px] mx-auto mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">

                <div className="lg:col-span-3 flex flex-col gap-6">
                    {/* Box Trò chuyện */}
                    <div className="bg-white border border-black/10 rounded-[30px] p-6 shadow-sm flex flex-col h-[450px]">
                        <h3 className="font-black text-[16px] text-orange-600 uppercase tracking-widest mb-4">Trò chuyện</h3>
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {CHAT_MESSAGES.map((m, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0 border border-black/5 flex items-center justify-center">
                                        <User size={16} className="text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <p className="text-[12px] font-black text-black">{m.user}</p>
                                            <span className="text-[10px] text-gray-400 font-bold">{m.time}</span>
                                        </div>
                                        <p className="text-[12px] font-bold text-gray-500 leading-tight bg-gray-50 p-2 rounded-xl rounded-tl-none">{m.msg}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 relative">
                            <input type="text" placeholder="Nhập tin nhắn..." className="w-full bg-gray-50 border border-black/5 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:border-orange-200 transition-all pr-12" />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-sm hover:bg-orange-600 transition-all">
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border border-black/10 rounded-[30px] p-6 shadow-sm">
                        <h3 className="font-black text-[16px] text-red-600 uppercase tracking-widest mb-4">Thông báo</h3>
                        <div className="space-y-4">
                            {NOTIFICATIONS.map((n, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 shrink-0"></div>
                                    <div>
                                        <p className="text-[12px] font-black text-black leading-tight">{n.msg}</p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-1">{n.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 px-4 py-2 bg-orange-50 border border-orange-100 rounded-xl font-black text-[10px] text-orange-600 uppercase hover:bg-orange-100 transition-all shadow-sm active:scale-95">
                            Xem tất cả
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-6 flex flex-col h-full bg-white border border-black/10 rounded-[40px] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-black text-xs text-orange-600 uppercase tracking-widest">
                            Cộng đồng Phật tử đang lạy ({COMMUNITY_CAMS.length})
                        </h3>

                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <button
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="flex items-center gap-3 bg-gray-50 border border-black/5 rounded-2xl px-4 py-2 shadow-sm hover:bg-white hover:border-orange-200 transition-all active:scale-95"
                                >
                                    <span className="text-[10px] font-black text-gray-400 uppercase">Sắp xếp:</span>
                                    <span className="text-[10px] font-black text-orange-600 uppercase">
                                        {sortBy === "count" ? "Theo lượt lạy" : sortBy === "rank" ? "Theo thứ hạng" : "Theo tên"}
                                    </span>
                                    <Settings size={12} className={`text-orange-400 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isSortOpen && (
                                        <>
                                            <div className="fixed inset-0 z-[90]" onClick={() => setIsSortOpen(false)} />

                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                className="absolute top-full right-0 mt-2 w-48 bg-white border border-black/10 rounded-[24px] shadow-xl p-2 z-[100] overflow-hidden"
                                            >
                                                {[
                                                    { id: "count", label: "Theo lượt lạy" },
                                                    { id: "rank", label: "Theo thứ hạng" },
                                                    { id: "name", label: "Theo tên" },
                                                ].map((option) => (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => {
                                                            setSortBy(option.id as any);
                                                            setIsSortOpen(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all
                  ${sortBy === option.id
                                                                ? "bg-orange-500 text-white shadow-md"
                                                                : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                                                            }`}>
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 md:grid-cols-5 gap-3 flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-[450px]">
                        {sortedCams.slice(0, 20).map((cam, i) => (
                            <div key={i} className="flex flex-col gap-2 group cursor-pointer">
                                <div className="relative aspect-square rounded-2xl overflow-hidden border border-black/5 shadow-sm">
                                    <img src="/images/img-7.png" alt={cam.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/20"></div>

                                    <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[9px] font-black text-white flex items-center justify-center">{cam.rank}</div>

                                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-black leading-none truncate px-1">{cam.name}</p>
                                    <p className="text-[9px] font-bold text-orange-500 mt-1">{cam.count} lượt lạy</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 px-2 md:px-4">
                        <div className="flex items-center gap-4 lg:gap-8 order-2 md:order-1">
                            <button className="flex flex-col items-center gap-2 group">
                                <div className="p-2.5 lg:p-3 bg-gray-50 rounded-2xl border border-black/5 group-hover:bg-orange-50 transition-all shadow-sm">
                                    <Video size={18} className="lg:w-5 lg:h-5 text-gray-400 group-hover:text-orange-500" />
                                </div>
                                <span className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase whitespace-nowrap tracking-tighter">Mở camera</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 group">
                                <div className="p-2.5 lg:p-3 bg-gray-50 rounded-2xl border border-black/5 group-hover:bg-blue-50 transition-all shadow-sm">
                                    <Mic size={18} className="lg:w-5 lg:h-5 text-gray-400 group-hover:text-blue-500" />
                                </div>
                                <span className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase whitespace-nowrap tracking-tighter">Bật mic</span>
                            </button>
                        </div>

                        <button className="order-1 md:order-2 bg-orange-500 hover:bg-orange-400 text-white px-6 py-3 lg:px-10 lg:py-3.5 rounded-[22px] font-black text-sm lg:text-base border-2 border-black shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 lg:gap-3 w-full md:w-auto min-w-[200px] lg:min-w-[240px]">
                            <span className="text-xl lg:text-2xl animate-pulse">⏸️</span>
                            <span className="tracking-tighter whitespace-nowrap">Tạm dừng lạy</span>
                        </button>

                        <div className="flex items-center gap-4 lg:gap-8 order-3">
                            <button className="flex flex-col items-center gap-2 group">
                                <div className="p-2.5 lg:p-3 bg-gray-50 rounded-2xl border border-black/5 group-hover:bg-red-50 transition-all shadow-sm">
                                    <UserRoundX size={18} className="lg:w-5 lg:h-5 text-gray-400 group-hover:text-red-500" />
                                </div>
                                <span className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase whitespace-nowrap tracking-tighter">Kích người</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 group">
                                <div className="p-2.5 lg:p-3 bg-gray-50 rounded-2xl border border-black/5 group-hover:bg-gray-200 transition-all shadow-sm">
                                    <Settings size={18} className="lg:w-5 lg:h-5 text-gray-400 group-hover:text-black" />
                                </div>
                                <span className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase whitespace-nowrap tracking-tighter">Cài đặt</span>
                            </button>
                        </div>
                    </div>

                    <p className="text-center mt-6 text-[12px] font-bold text-gray-400 flex items-center justify-center gap-2 italic">
                        💡 Mẹo: Lạy đều tay, giữ tâm thành kính để tăng hiệu quả lạy nhé!
                    </p>
                </div>
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="bg-white border border-black/10 rounded-[30px] p-6 shadow-sm flex flex-col">
                        <h3 className="font-black text-[16px] text-orange-600 uppercase tracking-widest mb-6">
                            Thành tích phòng
                        </h3>

                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                                    <Flame size={16} className="text-orange-400" /> Tổng lượt lạy
                                </div>
                                <span className="text-sm font-black">1,248,000 lượt</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                                    <Star size={16} className="text-yellow-400" /> Ngày lạy nhiều nhất
                                </div>
                                <span className="text-sm font-black">25,680 lượt</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                                    <CalendarDays size={16} className="text-red-400" /> Chuỗi ngày lạy
                                </div>
                                <span className="text-sm font-black">7 ngày</span>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-black/5 pt-6 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-3">
                                    Huy hiệu phòng
                                </p>
                                <div className="flex gap-2">
                                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center border border-orange-200 shadow-sm">
                                        <CircleStar size={18} color="#f54a00" />
                                    </div>
                                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center border border-orange-200 shadow-sm">
                                        <ShieldCheck size={18} color="#f54a00" />
                                    </div>
                                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center border border-orange-200 shadow-sm">
                                        <Anvil size={18} color="#f54a00" />
                                    </div>
                                </div>
                            </div>

                            <button className="mt-4 px-4 py-2 bg-orange-50 border border-orange-100 rounded-xl font-black text-[10px] text-orange-600 uppercase hover:bg-orange-100 transition-all shadow-sm active:scale-95">
                                Xem tất cả
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border border-black/10 rounded-[30px] p-6 shadow-sm">
                        <h3 className="font-black text-[16px] text-orange-600 uppercase tracking-widest mb-4">Mục tiêu phòng</h3>
                        <p className="text-xl font-black text-black mb-4">1,000,000 <span className="text-[12px] text-gray-400">lượt lạy</span></p>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-black/5 relative mb-4">
                            <div className="h-full bg-green-500 rounded-full w-[62%]"></div>
                        </div>
                        <div className="flex justify-between text-[12px] font-bold text-gray-500">
                            <span>Hiện tại: 628,741</span>
                            <span>Còn lại: 371,259</span>
                        </div>
                        <p className="mt-4 pt-4 border-t border-black/5 text-[12px] font-black text-orange-600 text-center uppercase tracking-widest">Thời gian còn lại: 2 ngày 14:25:38</p>
                    </div>

                    <div className="bg-white border border-black/10 rounded-[30px] p-6 shadow-sm">
                        <h3 className="font-black text-[14px] text-orange-600 uppercase tracking-widest mb-4">Danh sách đang lạy (128)</h3>
                        <div className="space-y-3">
                            {COMMUNITY_CAMS.slice(0, 5).map((user, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center border border-black/5"><User size={12} className="text-gray-400" /></div>
                                        <span className="text-[12px] font-black text-black">{user.name}</span>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                </div>
                            ))}
                            <p className="text-center pt-2 text-[9px] font-bold text-gray-400">... và 118 người khác</p>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
}