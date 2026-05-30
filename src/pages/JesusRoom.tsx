import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft, Music, Share2, Copy, User,
    Trophy, Flame, Target, Star, Radio,
    CalendarDays, Settings, Mic, ArrowRight,
    Video, UserRoundX, CircleStar, ShieldCheck,
    Anvil
} from "lucide-react";
import { PiMountainsFill } from "react-icons/pi";
import { FaCross } from "react-icons/fa";
import { AnimatedNumber } from "../components/AnimatedNumber";
import { PoseTracker } from "../components/PoseTracker";
import { useAuth } from "../contexts/AuthContext";
import { usePrayerContext } from "../contexts/PrayerContext";

const API_URL = import.meta.env.VITE_API_URL || "/api";

interface BackendRoom {
    id: string;
    name: string;
    type: "buddha" | "jesus";
    capacity: number;
    current_count: number;
    total_room_prayers: number;
    created_by?: number | null;
    created_at?: string;
}

const ROOM_DATA = {
    name: "Phòng Cầu Nguyện 🙏",
    id: "#CAUNGUYEN2024",
    host: { name: "Con Chúa", isHost: true },
    totalPrayers: 856,
    goal: 500000,
    progress: 45,
};

const TOP_PRAYERS = [
    { rank: 2, name: "Maria Mến Yêu", count: 421, img: "/images/prayer-2.png", isLive: true },
    { rank: 4, name: "Phaolo Loan Báo", count: 198, img: "/images/prayer-4.png", isLive: true },
    { rank: 1, name: "Chúa Tế Nhân Lành", count: 542, img: "/images/prayer-1.png", isLive: true, isHost: true },
    { rank: 3, name: "Giuse Hiền Lành", count: 368, img: "/images/prayer-3.png", isLive: true },
    { rank: 5, name: "Teresa Hài Đồng", count: 256, img: "/images/prayer-5.png", isLive: true },
];

const CAMP_DATA = {
    name: "Yêu Thương",
    level: 2,
    currentXP: 450,
    maxXP: 1000,
    benefits: [
        "Tăng 10% hiệu quả cầu nguyện",
        "Sống tốt mỗi ngày",
        "Yêu thương mọi người"
    ]
};

const CHAT_MESSAGES = [
    { user: "Maria Mến Yêu", msg: "Cầu xin Chúa ban phước lành ✨", time: "20:31" },
    { user: "Giuse Hiền Lành", msg: "Bình an cho tất cả mọi người 💪", time: "20:31" },
];

const NOTIFICATIONS = [
    { msg: "Maria vừa đạt 200 lượt cầu nguyện! 🔥", time: "2 phút trước" },
];

const COMMUNITY_CAMS = Array.from({ length: 20 }, (_, i) => ({
    rank: i + 6,
    name: ["Maria", "Giuse", "Phaolo", "Teresa", "Anna", "Luy", "Gioan", "Đaminh", "Mattheu", "Linh"][i % 10],
    count: Math.floor(Math.random() * 300) + 50,
    isLive: true
}));

export function JesusRoom() {
    const { roomId: routeRoomId } = useParams();
    const { user } = useAuth();
    const { emitRoomPrayer, joinPrayerRoom, roomStats } = usePrayerContext();
    const navigate = useNavigate();

    const [room, setRoom] = useState<BackendRoom | null>(null);
    const [roomLoading, setRoomLoading] = useState(true);
    const [roomError, setRoomError] = useState("");
    const [copied, setCopied] = useState(false);
    const [sortBy, setSortBy] = useState<"count" | "rank" | "name">("count");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [prayerBursts, setPrayerBursts] = useState<Array<{ id: number }>>([]);

    const roomType = "jesus";
    const roomId = room?.id ?? routeRoomId ?? `jesus-demo`;
    const roomName = room?.name ?? ROOM_DATA.name;
    const roomTotalPrayers = roomStats?.roomId === roomId && roomStats.roomTotal !== undefined
        ? roomStats.roomTotal
        : room?.total_room_prayers ?? ROOM_DATA.totalPrayers;

    useEffect(() => {
        if (!user) { navigate("/login"); return; }
        if (!routeRoomId) { navigate(`/rooms/jesus`); }
    }, [user, routeRoomId, navigate]);

    useEffect(() => {
        const fetchRoom = async () => {
            setRoomLoading(true);
            setRoomError("");
            try {
                const endpoint = routeRoomId 
                    ? `${API_URL}/rooms/${routeRoomId}` 
                    : `${API_URL}/rooms/type/jesus`;
                const res = await fetch(endpoint);
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || "Khong tai duoc phong");
                setRoom(data);
            } catch (err) {
                setRoom(null);
                setRoomError(err instanceof Error ? err.message : "Khong tai duoc phong");
            } finally {
                setRoomLoading(false);
            }
        };
        fetchRoom();
    }, [routeRoomId]);

    useEffect(() => {
        if (!roomLoading) joinPrayerRoom(roomId);
    }, [joinPrayerRoom, roomId, roomLoading]);

    useEffect(() => {
        const joinBackendRoom = async () => {
            if (roomLoading || !room?.id || !user?.id) return;
            try {
                await fetch(`${API_URL}/rooms/join`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ roomId: room.id, userId: user.id }),
                });
            } catch (err) { console.error(err); }
        };
        joinBackendRoom();
    }, [room?.id, roomLoading, user?.id]);

    const sortedCams = [...COMMUNITY_CAMS].sort((a, b) => {
        if (sortBy === "count") return b.count - a.count;
        if (sortBy === "rank") return a.rank - b.rank;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
    });

    const handleCopy = () => {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAIPrayer = async () => {
        if (!room?.id || !user?.id) return;

        try {
            // 1️⃣ REST API - Lưu vào Database (Primary)
            const startTime = performance.now();
            const res = await fetch(`${API_URL}/rooms/prayer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roomId: room.id, userId: user.id }),
            });
            const responseTime = performance.now() - startTime;

            if (!res.ok) {
                console.error(`❌ Prayer API failed: ${res.status} - ${res.statusText}`);
                return;
            }

            const data = await res.json();
            console.log(`✅ Prayer saved: ${responseTime.toFixed(2)}ms`, {
                userPrayers: data.userPrayers,
                roomTotal: data.roomTotal
            });
        } catch (err) {
            console.error("❌ Prayer recording error:", err);
            return;
        }

        // 2️⃣ Socket Emit - Real-time Broadcast (Secondary)
        // Server sẽ query DB và broadcast data tới tất cả clients
        emitRoomPrayer(roomId, user?.id, "jesus");

        // 3️⃣ Show animation
        const id = Date.now();
        setPrayerBursts((items) => [...items, { id }]);
        setTimeout(() => setPrayerBursts((items) => items.filter((i) => i.id !== id)), 1200);
    };

    return (
        <div className="max-w-[1600px] mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8">
                <button onClick={() => navigate("/rooms/jesus")} className="flex items-center gap-2 px-4 py-2 bg-white border border-black/10 rounded-xl font-black text-xs shadow-sm hover:bg-gray-50 transition-all">
                    <ArrowLeft size={14} /> Quay lại phòng
                </button>
                <div className="text-center flex flex-col items-center">
                    <div className="flex items-center gap-3 mb-1 text-blue-700">
                        <FaCross size={28} />
                        <h1 className="font-display font-black text-3xl md:text-[64px] uppercase tracking-tighter">{roomName}</h1>
                    </div>
                    <p className="text-xs xl:pt-3 md:text-sm font-bold text-gray-500 flex items-center gap-2">Cầu nguyện để bình an, yêu thương và hy vọng mỗi ngày</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border rounded-xl font-black text-xs shadow-sm transition-all bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100">
                        <Music size={14} /> Bật nhạc cầu nguyện
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-black/10 rounded-xl font-black text-xs shadow-sm hover:bg-gray-50 transition-all">
                        <Share2 size={14} /> Chia sẻ phòng
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
                <aside className="lg:col-span-2 bg-white border border-black/5 rounded-[30px] p-6 shadow-sm h-full">
                    <h3 className="font-black text-[14x] uppercase mb-6 border-b border-black/5 pb-2 text-blue-700">Thông tin phòng</h3>
                    <div className="space-y-6">
                        {roomLoading && <p className="text-[11px] font-bold text-gray-400">Đang tải...</p>}
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-2 flex items-center gap-2"><FaCross size={11} /> Tên phòng:</p>
                            <p className="text-sm font-black text-black">{roomName}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-2 flex items-center gap-2"><Target size={12} /> ID phòng:</p>
                            <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-black/5">
                                <span className="text-[11px] font-black text-blue-700">{roomId}</span>
                                <button onClick={handleCopy} className="text-[9px] font-black text-gray-400 hover:text-black uppercase">{copied ? "Xong!" : "Sao chép"}</button>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-2 flex items-center gap-2"><User size={12} /> Chủ trì phòng:</p>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-black/5"><User size={16} className="text-gray-400" /></div>
                                <p className="text-[11px] font-black">{ROOM_DATA.host.name} <span className="text-[8px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded ml-1">Chủ trì</span></p>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Tổng lượt cầu nguyện:</p>
                            <p className="text-xl font-black text-black"><AnimatedNumber value={roomTotalPrayers} /> lượt</p>
                        </div>
                    </div>
                </aside>

                <main className="lg:col-span-8 flex flex-col gap-6 h-full">
                    <div className="bg-white border border-black/10 rounded-[40px] p-8 shadow-sm h-full flex flex-col relative overflow-visible">
                        <h3 className="text-center font-black text-[14px] uppercase text-blue-700">Top 5 người cầu nguyện nhiều nhất</h3>
                        <div className="grid grid-cols-5 gap-3 items-center flex-1 min-h-[420px]">
                            {TOP_PRAYERS.map((prayer, i) => (
                                <div key={i} className={`relative flex flex-col group transition-all duration-500 ${prayer.rank === 1 ? 'h-[85%]' : 'h-[70%]'}`}>
                                    <div className={`relative flex-1 rounded-[25px] overflow-hidden border-2 transition-all duration-500 z-10 ${prayer.rank === 1 ? 'border-blue-400 shadow-[0_15px_40px_rgba(37,99,235,0.15)] ring-4 ring-blue-400/10' : 'border-black/5 shadow-sm'}`}>
                                        <img src="/images/img-7.png" alt={prayer.name} className="absolute inset-0 w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
                                        {prayer.rank !== 1 && prayer.isLive && (
                                            <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-0.5 rounded-full text-[7px] font-black flex items-center gap-1 z-20 animate-pulse uppercase"><Radio size={8} /> Live</div>
                                        )}
                                        <div className={`absolute bottom-0 left-0 right-0 p-3 z-20 text-center flex flex-col items-center ${prayer.rank === 1 ? 'pb-8' : 'pb-3'}`}>
                                            <div className={`w-6 h-6 rounded-full border border-white/20 flex items-center justify-center font-black text-[10px] mb-2 shadow-lg ${prayer.rank === 1 ? 'bg-blue-600 text-white scale-110' : 'bg-white/20 text-white backdrop-blur-md'}`}>{prayer.rank}</div>
                                            <p className={`font-black leading-tight truncate text-white w-full ${prayer.rank === 1 ? 'text-sm mb-0.5' : 'text-[10px]'}`}>{prayer.name}</p>
                                            <p className="font-bold text-blue-400 text-[8px]">{prayer.count} lượt</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                <aside className="lg:col-span-2 bg-white border border-black/5 rounded-[30px] p-6 shadow-sm h-full">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-6 h-6 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm"><PiMountainsFill size={14} className="text-blue-700" /></div>
                        <h3 className="font-black text-[12px] text-gray-500">Cam hiện tại: <span className="text-blue-700 ml-1">{CAMP_DATA.name}</span></h3>
                    </div>
                    <div className="w-full rounded-[20px] overflow-hidden border border-black/5 mb-6"><img src="/images/img-10.png" alt="Camp" className="w-full h-full object-contain" /></div>
                    <div className="mb-6">
                        <div className="flex flex-col xl:flex-row xl:justify-between text-[12px] font-black uppercase mb-2 gap-1"><span className="text-black">Cấp độ {CAMP_DATA.level}</span><span className="text-gray-400 text-[10px]">{CAMP_DATA.currentXP}/{CAMP_DATA.maxXP}</span></div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-black/5"><div className="h-full bg-blue-500 rounded-full w-[45%]"></div></div>
                    </div>
                    <p className="text-[12px] font-black text-black mb-3 uppercase">Lợi ích camp:</p>
                    <ul className="space-y-3">
                        {CAMP_DATA.benefits.map((b, i) => (
                            <li key={i} className="flex items-start gap-2 text-[10px] font-bold text-gray-500"><Star size={12} className="text-blue-400 fill-blue-400 mt-0.5" />{b}</li>
                        ))}
                    </ul>
                </aside>
            </div>

            <section className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="bg-white border border-black/10 rounded-[30px] p-6 shadow-sm flex flex-col h-[450px]">
                        <h3 className="font-black text-[16px] text-blue-700 uppercase tracking-widest mb-4">Trò chuyện</h3>
                        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-1">
                            {CHAT_MESSAGES.map((m, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0"><User size={16} className="text-gray-400" /></div>
                                    <div className="flex-1"><div className="flex justify-between items-center mb-0.5"><p className="text-[12px] font-black text-black">{m.user}</p><span className="text-[10px] text-gray-400">{m.time}</span></div><p className="text-[12px] font-bold text-gray-500 bg-gray-50 p-2 rounded-xl rounded-tl-none">{m.msg}</p></div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 relative"><input type="text" placeholder="Nhập lời cầu nguyện..." className="w-full bg-gray-50 border border-black/5 rounded-2xl px-4 py-3 text-xs font-bold outline-none" /><button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center"><ArrowRight size={14} /></button></div>
                    </div>
                </div>

                <div className="lg:col-span-6 flex flex-col h-full bg-white border border-black/10 rounded-[40px] p-6 shadow-sm relative">
                    <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
                        <AnimatePresence>
                            {prayerBursts.map((burst) => (
                                <motion.div key={burst.id} initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: -45, scale: 1 }} exit={{ opacity: 0, y: -70 }} className="absolute right-6 top-10 rounded-full bg-blue-600 px-4 py-2 text-sm font-black text-white shadow-lg">+1</motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-black text-xs uppercase text-blue-700 tracking-widest">Cộng đồng đang cầu nguyện ({COMMUNITY_CAMS.length})</h3>
                        <div className="relative">
                            <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-3 bg-gray-50 border border-black/5 rounded-2xl px-4 py-2 shadow-sm hover:border-blue-200 transition-all"><span className="text-[10px] font-black text-gray-400 uppercase">Sắp xếp:</span><span className="text-[10px] font-black text-blue-700 uppercase">{sortBy === "count" ? "Lượt lạy" : sortBy === "rank" ? "Thứ hạng" : "Tên"}</span><Settings size={12} className={`text-blue-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 md:grid-cols-5 gap-3 flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-[450px]">
                        {sortedCams.slice(0, 20).map((cam, i) => (
                            <div key={i} className="flex flex-col gap-2 group cursor-pointer">
                                <div className="relative aspect-square rounded-2xl overflow-hidden border border-black/5"><img src="/images/img-7.png" alt={cam.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" /><div className="absolute inset-0 bg-black/20"></div><div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[9px] font-black text-white flex items-center justify-center">{cam.rank}</div><div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div></div>
                                <div className="text-center"><p className="text-[10px] font-black text-black leading-none truncate px-1">{cam.name}</p><p className="text-[9px] font-bold text-blue-600 mt-1">{cam.count} lượt</p></div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <PoseTracker roomId={roomId} userId={user?.id} onPrayerDetected={handleAIPrayer} roomCurrentCount={room?.current_count} />
                        {roomStats?.roomId === roomId && roomStats.roomTotal !== undefined && (
                            <p className="mt-3 text-center text-[11px] font-black uppercase text-blue-700">Realtime: {roomStats.roomTotal} lượt</p>
                        )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-black/5 flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 md:gap-4 px-4">
                        <div className="flex items-center gap-4 lg:gap-8 order-2 md:order-1">
                            <button className="flex flex-col items-center gap-2 group"><div className="p-3 bg-gray-50 rounded-2xl border border-black/5 group-hover:bg-blue-50 transition-all shadow-sm"><Video size={18} className="text-gray-400 group-hover:text-blue-500" /></div><span className="text-[9px] font-black text-gray-400 uppercase">Mở camera</span></button>
                            <button className="flex flex-col items-center gap-2 group"><div className="p-3 bg-gray-50 rounded-2xl border border-black/5 group-hover:bg-cyan-50 transition-all shadow-sm"><Mic size={18} className="text-gray-400 group-hover:text-cyan-500" /></div><span className="text-[9px] font-black text-gray-400 uppercase">Bật mic</span></button>
                        </div>
                        <button onClick={handleAIPrayer} className="order-1 md:order-2 bg-blue-600 hover:bg-blue-500 text-white px-10 py-3.5 rounded-[22px] font-black text-sm border-2 border-black shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 w-4/5 md:w-auto min-w-[200px]">
                            <span className="text-xl lg:text-2xl animate-pulse">🙏</span> <span className="tracking-tighter uppercase">Cầu nguyện</span>
                        </button>
                        <div className="flex items-center gap-4 lg:gap-8 order-3">
                            <button className="flex flex-col items-center gap-2 group"><div className="p-3 bg-gray-50 rounded-2xl border border-black/5 group-hover:bg-red-50 transition-all shadow-sm"><UserRoundX size={18} className="text-gray-400 group-hover:text-red-500" /></div><span className="text-[9px] font-black text-gray-400 uppercase">Kích người</span></button>
                            <button className="flex flex-col items-center gap-2 group"><div className="p-3 bg-gray-50 rounded-2xl border border-black/5 group-hover:bg-gray-200 transition-all shadow-sm"><Settings size={18} className="text-gray-400 group-hover:text-black" /></div><span className="text-[9px] font-black text-gray-400 uppercase">Cài đặt</span></button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="bg-white border border-black/10 rounded-[30px] p-6 shadow-sm">
                        <h3 className="font-black text-[16px] text-blue-700 uppercase tracking-widest mb-6">Thành tích phòng</h3>
                        <div className="space-y-5">
                            <div className="flex items-center justify-between"><div className="flex items-center gap-3 text-xs font-bold text-gray-400"><Flame size={16} className="text-blue-500" /> Tổng lượt cầu nguyện</div><span className="text-sm font-black">7,138,284 lượt</span></div>
                            <div className="flex items-center justify-between"><div className="flex items-center gap-3 text-xs font-bold text-gray-400"><Star size={16} className="text-yellow-400" /> Ngày nhiều nhất</div><span className="text-sm font-black">12,548 lượt</span></div>
                            <div className="flex items-center justify-between"><div className="flex items-center gap-3 text-xs font-bold text-gray-400"><CalendarDays size={16} className="text-red-400" /> Chuỗi ngày lạy</div><span className="text-sm font-black">5 ngày</span></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}