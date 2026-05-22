import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Users, Heart, Calendar, Zap, RefreshCw,
    ChevronDown, Flame, TrendingUp, TrendingDown,
    ArrowRight, User, Trophy
} from "lucide-react";
import { GiLotus } from "react-icons/gi";
import { FaCross } from "react-icons/fa";
import { PiFlowerLotusThin, PiMedalMilitaryLight } from "react-icons/pi";
import { FaMedal, FaSquareUpRight } from "react-icons/fa6";
import { BiSolidMedal } from "react-icons/bi";
import { HiUserAdd } from "react-icons/hi";
import { BsHouseUpFill, BsCalendar3WeekFill } from "react-icons/bs";
import { RiTimerFlashFill } from "react-icons/ri";
import { AnimatedNumber } from "../components/AnimatedNumber";

const ROOM_STATS_DATA = {
    buddha: {
        chartData: [
            { date: "07/05", val: 300 }, { date: "08/05", val: 450 }, { date: "09/05", val: 420 },
            { date: "10/05", val: 600 }, { date: "11/05", val: 850 }, { date: "12/05", val: 780 }, { date: "13/05", val: 920 },
        ],
        records: { date: "12/05/2024", dateVal: 2145678, time: "20:00 - 21:00", timeVal: 1245678 }
    },
    jesus: {
        chartData: [
            { date: "07/05", val: 200 }, { date: "08/05", val: 380 }, { date: "09/05", val: 550 },
            { date: "10/05", val: 480 }, { date: "11/05", val: 700 }, { date: "12/05", val: 900 }, { date: "13/05", val: 650 },
        ],
        records: { date: "11/05/2024", dateVal: 1245678, time: "19:00 - 20:00", timeVal: 745321 }
    }
};

function MiniChart({ data, color }: { data: any[], color: string }) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const SVG_WIDTH = 400;
    const SVG_HEIGHT = 100;
    const PADDING_X = 15;

    const points = data.map((d, i) => ({
        x: PADDING_X + (i * ((SVG_WIDTH - PADDING_X * 2) / (data.length - 1))),
        y: SVG_HEIGHT - (d.val / 1000 * SVG_HEIGHT)
    }));

    const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

    return (
        <div className="h-52 w-full mt-4 flex gap-4">

            <div className="flex flex-col justify-between h-40 text-right w-8 pointer-events-none pb-[2px]">
                {[1000, 800, 600, 400, 200, 0].map(m => (
                    <span key={m} className="text-[8px] font-black text-gray-400 leading-none">
                        {m}
                    </span>
                ))}
            </div>

            <div className="relative flex-1 h-full">

                <div className="absolute inset-0 h-40 flex flex-col justify-between pointer-events-none">
                    {[1000, 800, 600, 400, 200, 0].map(m => (
                        <div key={m} className="border-t border-black/[0.03] w-full h-0"></div>
                    ))}
                </div>

                <div className="h-40 w-full relative z-10">
                    <svg
                        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                        className="w-full h-full overflow-visible"
                        preserveAspectRatio="none"
                    >
                        {/* Đường biểu đồ (Line) */}
                        <path
                            d={pathD}
                            fill="none"
                            stroke={color}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {points.map((p, i) => (
                            <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)} className="cursor-pointer">
                                <rect x={p.x - 20} y="0" width="40" height="100" fill="transparent" />

                                {/* Điểm tròn chính */}
                                <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r="3"
                                    fill="white"
                                    stroke={color}
                                    strokeWidth="1.5"
                                    className="transition-all duration-200"
                                />
                            </g>
                        ))}
                    </svg>

                    <AnimatePresence>
                        {hoveredIndex !== null && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute bg-gray-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-black z-50 shadow-2xl pointer-events-none flex flex-col items-center"
                                style={{
                                    left: `${(points[hoveredIndex].x * 100) / SVG_WIDTH}%`,
                                    top: `${points[hoveredIndex].y - 35}%`,
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                <span className="whitespace-nowrap">{data[hoveredIndex].val} lượt lạy</span>
                                <div className="w-2 h-2 bg-gray-900 rotate-45 absolute -bottom-1"></div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative w-full mt-4 border-t border-black/5 pt-3">
                    {points.map((p, i) => (
                        <span
                            key={i}
                            className="absolute text-[9px] font-black text-gray-400 uppercase tracking-tighter transition-colors"
                            style={{
                                left: `${(p.x * 100) / SVG_WIDTH}%`,
                                transform: 'translateX(-50%)',
                                color: hoveredIndex === i ? color : undefined
                            }}
                        >
                            {data[i].date}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function Stats() {
    const [activeTab, setActiveRoom] = useState<"buddha" | "jesus">("buddha");
    const [timeFilter, setTimeFilter] = useState("Hôm nay");

    const getComparisonLabel = () => {
        switch (timeFilter) {
            case "Hôm nay": return "so với hôm qua";
            case "7 ngày qua": return "so với 7 ngày trước";
            case "30 ngày qua": return "so với tháng trước";
            case "Tháng này": return "so với tháng trước";
            case "Năm nay": return "so với năm ngoái";
            default: return "so với kỳ trước";
        }
    };

    const comparisonLabel = getComparisonLabel();

    const getFilteredStats = () => {
        let m = 1;
        if (timeFilter === "7 ngày qua") m = 7.2;
        if (timeFilter === "30 ngày qua") m = 31.5;
        if (timeFilter === "Tháng này") m = 22.4;
        if (timeFilter === "Năm nay") m = 245.8;

        return [
            {
                label: "Tổng lượt lạy",
                value: Math.floor(25680452 * (m / 200 + 1)),
                unit: "lượt",
                trendValue: (15.5 * (m / m)).toFixed(1),
                color: "bg-orange-50",
                icon: "🙏"
            },
            {
                label: "Tổng người tham gia",
                value: Math.floor(128541 * (m / 500 + 1)),
                unit: "thành viên",
                trendValue: (8.2).toFixed(1),
                color: "bg-blue-50",
                icon: <Users className="text-blue-500" />
            },
            {
                label: "Lượt lạy kỳ này",
                value: Math.floor(8745 * m),
                unit: "lượt",
                trendValue: m > 10 ? -4.2 : 15.3,
                color: "bg-purple-50",
                icon: <Zap className="text-purple-500" fill="currentColor" />
            },
            {
                label: "Tổng công đức",
                value: Math.floor(258647 * m),
                unit: "điểm",
                trendValue: m > 30 ? -2.1 : 20.1,
                color: "bg-red-50",
                icon: <Heart className="text-red-500" fill="currentColor" />
            },
            {
                label: "Số ngày hoạt động",
                value: 237,
                unit: "ngày",
                trendValue: null,
                color: "bg-green-50",
                icon: <Calendar className="text-green-600" />,
                isDate: true
            },
        ];
    };

    const activeStats = getFilteredStats();
    const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

    return (
        <div className="max-w-[1600px] mx-auto px-4">

            <section className="relative pt-10 2xl:pb-10 flex flex-col items-center justify-center text-center w-full mx-auto">

                <div className="absolute left-0 -bottom-10 hidden md:block pointer-events-none translate-x-[10%] xl:translate-x-[0%]">
                    <div className="relative">
                        <img src="/images/img-11.png" alt="Buddha" className="w-64 xl:w-64 2xl:w-72 h-auto" />
                    </div>
                </div>

                <div className="z-10 flex flex-col items-center md:mb-[160px] 2xl:mb-[0] xl:mb-[0]">
                    <div className="text-amber-200 mb-2">
                        <PiFlowerLotusThin size={64} />
                    </div>
                    <h1 className="font-display font-black text-5xl md:text-[64px] uppercase tracking-tighter text-[#4A2C2A]">
                        Thống kê lạy online
                    </h1>
                    <p className="mt-4 text-sm md:text-base font-bold text-gray-500 uppercase tracking-[0.2em]">
                        Minh bạch – Công bằng – Lan tỏa năng lượng tích cực 🙏
                    </p>
                </div>

                <div className="absolute right-0 -bottom-14 xl:-bottom-13 hidden md:block pointer-events-none translate-x-[-20%] xl:translate-x-[0%]">
                    <div className="relative">
                        <img src="/images/img-12.png" alt="Meme" className="w-64 xl:w-64 2xl:w-72 h-auto" />
                    </div>
                </div>
            </section>

            <section className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                <button
                    onClick={() => setActiveRoom("buddha")}
                    className={`flex items-center justify-center gap-4 py-6 cursor-pointer rounded-[30px] border-2 transition-all shadow-sm
      ${activeTab === "buddha"
                            ? "bg-orange-50 border-orange-500 text-orange-600 scale-[1.02] shadow-md"
                            : "bg-orange-50/20 border-orange-300 text-orange-400 hover:border-orange-200"
                        }`}
                >
                    <GiLotus size={28} />
                    <span className="font-black text-xl uppercase tracking-tighter">Phòng Tích Đức</span>
                </button>

                <button
                    onClick={() => setActiveRoom("jesus")}
                    className={`flex items-center justify-center gap-4 py-6 cursor-pointer rounded-[30px] border-2 transition-all shadow-sm
      ${activeTab === "jesus"
                            ? "bg-blue-50 border-blue-500 text-blue-600 scale-[1.02] shadow-md"
                            : "bg-blue-50/20 border-blue-300 text-blue-400 hover:border-blue-200"
                        }`}
                >
                    <FaCross size={24} />
                    <span className="font-black text-xl uppercase tracking-tighter">Phòng Rửa Tội</span>
                </button>
            </section>

            <div className="bg-white border border-black/10 rounded-[40px] p-8 md:p-10 shadow-sm mt-12 relative">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-12 border-b border-black/5 pb-8">

                    <div className="flex items-center justify-between w-full xl:w-auto">
                        <span className="text-[16px] font-black text-orange-600 uppercase tracking-widest whitespace-nowrap">
                            Thời gian thống kê
                        </span>

                        <div className="flex xl:hidden items-center gap-2 text-xs font-bold text-gray-400 shrink-0">
                            <RefreshCw size={14} className="animate-spin-slow" />
                            <span className="hidden xs:inline">Cập nhật lúc: </span> 14:25:38
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:overflow-x-auto overflow-visible justify-between w-full xl:w-auto pb-2 xl:pb-0 no-scrollbar">
                        <div className="relative flex-1 md:flex-none">
                            <div className="md:hidden w-full">
                                <button
                                    onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                                    className="w-full flex items-center justify-between bg-gray-100/80 border border-black/5 rounded-2xl px-5 py-3 shadow-sm active:scale-[0.98] transition-all"
                                >
                                    <div className="flex flex-col items-start">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thời gian:</span>
                                        <span className="text-xs font-black text-orange-600 uppercase">{timeFilter}</span>
                                    </div>
                                    <ChevronDown size={18} className={`text-orange-500 transition-transform duration-300 ${isTimeDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isTimeDropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-[90]" onClick={() => setIsTimeDropdownOpen(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-orange-100 rounded-[24px] shadow-xl z-[100] p-2 overflow-hidden"
                                            >
                                                {["Hôm nay", "7 ngày qua", "30 ngày qua", "Tháng này", "Năm nay"].map((f) => (
                                                    <button
                                                        key={f}
                                                        onClick={() => {
                                                            setTimeFilter(f);
                                                            setIsTimeDropdownOpen(false);
                                                        }}
                                                        className={`w-full text-left px-5 py-4 rounded-xl text-xs font-black uppercase transition-all mb-1 last:mb-0
                  ${timeFilter === f ? "bg-orange-500 text-white shadow-md" : "text-gray-600 hover:bg-orange-50"}`}
                                                    >
                                                        {f}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="hidden md:flex bg-gray-100/50 p-1 rounded-2xl border border-black/5 flex-nowrap shrink-0">
                                {["Hôm nay", "7 ngày qua", "30 ngày qua", "Tháng này", "Năm nay"].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setTimeFilter(f)}
                                        className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap cursor-pointer
        ${timeFilter === f ? "bg-orange-500 text-white shadow-md" : "text-gray-500 hover:text-black"}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-black/5 rounded-xl text-xs font-black text-gray-500 uppercase hover:bg-gray-50 transition-all cursor-pointer shrink-0">
                            <Calendar size={14} />
                            <span className="hidden sm:inline">Tùy chọn</span>
                            <ChevronDown size={14} />
                        </button>
                    </div>

                    <div className="hidden xl:flex items-center gap-2 text-xs font-bold text-gray-400">
                        <RefreshCw size={14} className="animate-spin-slow" />
                        Cập nhật lúc: 14:25:38
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-black text-black uppercase tracking-[0.2em] mb-8">Tổng quan chung</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {activeStats.map((s, i) => (
                            <div key={i} className={`${s.color} border border-black/5 rounded-[30px] p-6 shadow-sm flex flex-col gap-6 hover:translate-y-[-4px] transition-all cursor-pointer group`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-xl group-hover:scale-110 transition-transform">
                                        {s.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-gray-500 uppercase leading-none mb-2">{s.label}</span>
                                        <p className="text-2xl font-black text-black leading-none tracking-tighter">
                                            <AnimatedNumber value={s.value} />
                                        </p>
                                        <span className="text-xs font-bold text-gray-500 mt-2">{s.unit}</span>
                                    </div>
                                </div>

                                <div className="mt-auto flex items-center gap-2">
                                    {s.isDate || s.trendValue === null ? (
                                        <span className="text-xs font-black text-gray-500 uppercase">Từ 01/10/2023</span>
                                    ) : (
                                        <>
                                            {Number(s.trendValue) >= 0 ? (
                                                <TrendingUp size={14} className="text-green-500" />
                                            ) : (
                                                <TrendingDown size={14} className="text-red-500" />
                                            )}

                                            <span className={`text-xs font-black ${Number(s.trendValue) >= 0 ? "text-green-500" : "text-red-500"}`}>
                                                {Number(s.trendValue) >= 0 ? `+${s.trendValue}%` : `${s.trendValue}%`}
                                            </span>

                                            <span className="text-[11px] font-bold text-gray-400 uppercase ml-1">
                                                {comparisonLabel}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <section className="mt-12 grid grid-cols-1 xl:grid-cols-2 gap-8 mb-20">

                <div className="bg-white border border-black/10 rounded-[40px] p-6 md:p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8 border-b border-black/5 pb-6">
                        <div className="flex items-center gap-3 text-orange-600">
                            <GiLotus size={28} />
                            <h2 className="font-black text-[16px] md:text-2xl uppercase tracking-tighter">Phòng Tích Đức</h2>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-black/5 rounded-xl text-[10px] font-black text-gray-500 uppercase hover:bg-orange-50 hover:text-orange-600 transition-all cursor-pointer">
                            Xem chi tiết <ArrowRight size={12} />
                        </button>
                    </div>

                    <div className="mb-10">
                        <p className="text-[14px] font-black text-orange-900/40 uppercase tracking-widest mb-4">Tổng quan</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x divide-black/10">
                            {[
                                { label: "Tổng lượt lạy", val: "18,542,168", icon: <Flame size={18} />, color: "text-orange-500" },
                                { label: "Người tham gia", val: "96,328", icon: <Users size={18} />, color: "text-amber-600" },
                                { label: "Lượt lạy hôm nay", val: "6,245", icon: <Zap size={18} />, color: "text-orange-400" },
                                { label: "Tổng công đức", val: "186,248", icon: <Heart size={18} />, color: "text-red-500" },
                            ].map((item, i) => (
                                <div key={i} className="md:px-6 first:pl-0 last:pr-0">
                                    <p className="text-[12px] font-black text-gray-400 font-bold flex flex-row md:flex-col 2xl:flex-row items-center md:items-start 2xl:items-center gap-1.5 mb-2">
                                        <span className={`${item.color} shrink-0`}>
                                            {item.icon}
                                        </span>

                                        <span className="leading-tight whitespace-nowrap">
                                            {item.label}
                                        </span>
                                    </p>
                                    <p className="text-base font-black text-black leading-none">{item.val}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">lượt</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col 2xl:grid 2xl:grid-cols-12 gap-10">
                        <div className="w-full 2xl:col-span-4 border-b 2xl:border-b-0 pb-10 2xl:pb-0 2xl:pr-8">
                            <p className="text-[12px] font-black text-orange-900/40 uppercase tracking-widest mb-6">Top 5 cá nhân</p>
                            <div className="space-y-4">
                                {[
                                    { name: "Tâm Hướng Phật", val: "1,248k" },
                                    { name: "Phật Tử Tí Hon", val: "842k" },
                                    { name: "Sen Hồng Nở", val: "715k" },
                                    { name: "Bình An Tự Tại", val: "635k" },
                                    { name: "Lạc Thiện", val: "512k" },
                                ].map((u, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-xl transition-all hover:bg-gray-50/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 flex justify-center shrink-0">
                                                {i === 0 && <FaMedal size={20} className="text-yellow-500 drop-shadow-sm" title="Top 1" />}
                                                {i === 1 && <BiSolidMedal size={24} className="text-slate-400 drop-shadow-sm" title="Top 2" />}
                                                {i === 2 && <PiMedalMilitaryLight size={20} className="text-amber-700 drop-shadow-sm" title="Top 3" />}
                                                {i >= 3 && <span className="text-[12px] font-black text-gray-300">{i + 1}</span>}
                                            </div>

                                            <div className="w-8 h-8 rounded-full bg-gray-100 border border-black/5 overflow-hidden flex items-center justify-center shadow-inner">
                                                <User size={16} className="text-gray-400" />
                                            </div>

                                            <span className={`text-[12px] font-black truncate w-24 ${i === 0 ? 'text-orange-600' : 'text-black'}`}>
                                                {u.name}
                                            </span>
                                        </div>

                                        <span className="text-[10px] font-bold text-gray-400">{u.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-full 2xl:col-span-8 flex flex-col h-full 2xl:border-l border-black/5 2xl:pl-3">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[12px] font-black text-orange-900/40 uppercase tracking-widest">Biểu đồ lượt lạy</p>
                                <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-lg border border-black/5">
                                    <span className="text-[12px] font-black text-gray-500 uppercase">7 ngày qua</span>
                                    <ChevronDown size={10} className="text-gray-400" />
                                </div>
                            </div>
                            <div className="h-40 w-full relative pt-4">
                                <MiniChart
                                    data={ROOM_STATS_DATA.buddha.chartData}
                                    color="#f97316"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 2xl:mt-30 xl:mt-20 sm:mt-25 mt-25">
                                <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4">
                                    <p className="text-[12px] font-black text-gray-400 uppercase mb-1">Ngày lạy nhiều nhất</p>
                                    <p className="text-sm font-black text-black">
                                        {ROOM_STATS_DATA.buddha.records.date}
                                    </p>
                                    <p className="text-[11px] font-bold text-orange-600 2xl:pt-1 xl:pt-1">
                                        <AnimatedNumber value={ROOM_STATS_DATA.buddha.records.dateVal} /> lượt
                                    </p>
                                </div>
                                <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4">
                                    <p className="text-[12px] font-black text-gray-400 uppercase mb-1">Giờ lạy nhiều nhất</p>
                                    <p className="text-sm font-black text-black">
                                        {ROOM_STATS_DATA.buddha.records.time}
                                    </p>
                                    <p className="text-[11px] font-bold text-orange-600 2xl:pt-1 xl:pt-1">
                                        <AnimatedNumber value={ROOM_STATS_DATA.buddha.records.timeVal} /> lượt
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-black/10 rounded-[40px] p-6 md:p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8 border-b border-black/5 pb-6">
                        <div className="flex items-center gap-3 text-blue-600">
                            <FaCross size={24} />
                            <h2 className="font-black text-[16px] md:text-2xl uppercase tracking-tighter">Phòng Rửa Tội</h2>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-black/5 rounded-xl text-[10px] font-black text-gray-500 uppercase hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer">
                            Xem chi tiết <ArrowRight size={12} />
                        </button>
                    </div>

                    <div className="mb-10">
                        <p className="text-[14px] font-black text-blue-900/40 uppercase tracking-widest mb-4">Tổng quan</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x divide-black/10">
                            {[
                                { label: "Tổng lượt lạy", val: "7,138,284", icon: <Flame size={18} />, color: "text-blue-500" },
                                { label: "Người tham gia", val: "32,213", icon: <Users size={18} />, color: "text-blue-600" },
                                { label: "Lượt lạy hôm nay", val: "2,500", icon: <Zap size={18} />, color: "text-sky-400" },
                                { label: "Tổng công đức", val: "72,399", icon: <Heart size={18} />, color: "text-blue-400" },
                            ].map((item, i) => (
                                <div key={i} className="md:px-6 first:pl-0 last:pr-0">
                                    <p className="text-[12px] font-black text-gray-400 font-bold flex flex-row md:flex-col 2xl:flex-row items-center md:items-start 2xl:items-center gap-1.5 mb-2">
                                        <span className={`${item.color} shrink-0`}>
                                            {item.icon}
                                        </span>

                                        <span className="leading-tight whitespace-nowrap">
                                            {item.label}
                                        </span>
                                    </p>
                                    <p className="text-base font-black text-black leading-none">{item.val}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">điểm</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col 2xl:grid 2xl:grid-cols-12 gap-10">
                        <div className="w-full 2xl:col-span-4 border-b 2xl:border-b-0  pb-10 2xl:pb-0 2xl:pr-8">
                            <p className="text-[12px] font-black text-blue-900/40 uppercase tracking-widest mb-6">Top 5 cá nhân</p>
                            <div className="space-y-4">
                                {[
                                    { name: "Chúa Tế Nhân Lành", val: "542k" },
                                    { name: "Maria Mến Yêu", val: "421k" },
                                    { name: "Giuse Hiền Lành", val: "368k" },
                                    { name: "Teresa Hài Đồng", val: "256k" },
                                    { name: "Phaolo Loan Báo", val: "198k" },
                                ].map((u, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-xl transition-all hover:bg-gray-50/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 flex justify-center shrink-0">
                                                {i === 0 && <FaMedal size={20} className="text-yellow-500 drop-shadow-sm" title="Top 1" />}
                                                {i === 1 && <BiSolidMedal size={24} className="text-slate-400 drop-shadow-sm" title="Top 2" />}
                                                {i === 2 && <PiMedalMilitaryLight size={20} className="text-amber-700 drop-shadow-sm" title="Top 3" />}
                                                {i >= 3 && <span className="text-[12px] font-black text-gray-300">{i + 1}</span>}
                                            </div>

                                            <div className="w-8 h-8 rounded-full bg-gray-100 border border-black/5 overflow-hidden flex items-center justify-center">
                                                <User size={16} className="text-gray-400" />
                                            </div>

                                            <span className={`text-[12px] font-black truncate w-24 ${i === 0 ? 'text-blue-600' : 'text-black'}`}>
                                                {u.name}
                                            </span>
                                        </div>

                                        <span className="text-[10px] font-bold text-gray-400">{u.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-full 2xl:col-span-8 flex 2xl:border-l border-black/5 2xl:pl-3 flex-col h-full">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[12px] font-black text-orange-900/40 uppercase tracking-widest">Biểu đồ lượt lạy</p>
                                <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-lg border border-black/5">
                                    <span className="text-[12px] font-black text-gray-500 uppercase">7 ngày qua</span>
                                    <ChevronDown size={10} className="text-gray-400" />
                                </div>
                            </div>
                            <div className="h-40 w-full relative pt-4">
                                <MiniChart
                                    data={ROOM_STATS_DATA.jesus.chartData}
                                    color="#2563eb"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 2xl:mt-30 xl:mt-20 sm:mt-25 mt-25">
                                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4">
                                    <p className="text-[12px] font-black text-gray-400 uppercase mb-1">Ngày lạy nhiều nhất</p>
                                    <p className="text-sm font-black text-black">
                                        {ROOM_STATS_DATA.jesus.records.date}
                                    </p>
                                    <p className="text-[11px] font-bold text-blue-600 2xl:pt-1 xl:pt-1">
                                        <AnimatedNumber value={ROOM_STATS_DATA.jesus.records.dateVal} /> lượt
                                    </p>
                                </div>

                                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4">
                                    <p className="text-[12px] font-black text-gray-400 uppercase mb-1">Giờ lạy nhiều nhất</p>
                                    <p className="text-sm font-black text-black">
                                        {ROOM_STATS_DATA.jesus.records.time}
                                    </p>
                                    <p className="text-[10px] font-bold text-blue-600 2xl:pt-1 xl:pt-1">
                                        <AnimatedNumber value={ROOM_STATS_DATA.jesus.records.timeVal} /> lượt
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-12 bg-white border border-black/10 rounded-[40px] p-6 md:p-10 shadow-sm max-w-[1600px] mx-auto">
                <div className="flex flex-col lg:flex-row items-center justify-between mb-10 gap-6">
                    <h2 className="font-black text-xl md:text-2xl uppercase tracking-tighter text-orange-600 text-center lg:text-left">
                        So sánh hai phòng
                    </h2>

                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                        <div className="flex items-center gap-2 shrink-0">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span className="text-[12px] font-black uppercase text-gray-500 whitespace-nowrap">Phòng Tích Đức</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-[12px] font-black uppercase text-gray-500 whitespace-nowrap">Phòng Rửa Tội</span>
                        </div>
                        <span className="text-[11px] font-black uppercase text-gray-400 border-l border-black/10 pl-4 hidden sm:block">
                            Tỷ lệ
                        </span>
                    </div>
                </div>

                <div className="space-y-12 lg:space-y-10">
                    {[
                        { label: "Tổng lượt lạy", val1: 18542168, val2: 7138284, icon: <GiLotus size={24} />, color: "text-orange-500" },
                        { label: "Người tham gia", val1: 96328, val2: 32213, icon: <Users size={24} />, color: "text-amber-600" },
                        { label: "Lượt lạy hôm nay", val1: 6245, val2: 2500, icon: <Zap size={24} />, color: "text-orange-400" },
                        { label: "Tổng công đức", val1: 186248, val2: 72399, icon: <Heart size={24} />, color: "text-red-500" },
                    ].map((item, i) => {
                        const total = item.val1 + item.val2;
                        const percent1 = (item.val1 / total) * 100;
                        const percent2 = 100 - percent1;

                        return (
                            <div key={i} className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-2 items-center border-b border-black/[0.03] lg:border-0 pb-6 lg:pb-0 last:border-0">

                                <div className="lg:col-span-3 flex items-center gap-4">
                                    <span className={`${item.color} shrink-0 bg-gray-50 p-2 rounded-xl`}>{item.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-black text-gray-400 uppercase leading-none mb-1">{item.label}</p>
                                        <p className="text-base font-black text-black">
                                            {new Intl.NumberFormat().format(item.val1)}
                                        </p>
                                    </div>
                                </div>

                                <div className="lg:col-span-6 my-2 lg:my-0 px-1">
                                    <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex border border-black/5 shadow-inner">
                                        <div style={{ width: `${percent1}%` }} className="h-full bg-orange-500 transition-all duration-1000 ease-out border-r border-white/20"></div>
                                        <div className="flex-1 h-full bg-blue-500 transition-all duration-1000 ease-out"></div>
                                    </div>
                                </div>

                                <div className="lg:col-span-3 flex items-center justify-between lg:pl-6">
                                    <div className="text-left">
                                        <p className="text-base font-black text-black">
                                            {new Intl.NumberFormat().format(item.val2)}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 px-3 py-2 rounded-xl border border-black/5 flex items-center justify-center min-w-max ml-4 shadow-sm">
                                        <span className="text-[11px] font-black whitespace-nowrap">
                                            <span className="text-orange-600">{percent1.toFixed(1)}%</span>
                                            <span className="text-gray-300 mx-1.5">/</span>
                                            <span className="text-blue-600">{percent2.toFixed(1)}%</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 max-w-[1600px] mx-auto">

                <div className="bg-white border border-black/10 rounded-[40px] p-8 shadow-sm flex flex-col">
                    <h3 className="font-black text-[16px] text-orange-600 uppercase tracking-widest mb-8">Hoạt động nổi bật</h3>
                    <div className="space-y-6 flex-1">
                        {[
                            { user: "Tâm Hướng Phật", msg: "vừa đạt 1,000,000 lượt lạy! 🎉", time: "2 phút trước" },
                            { user: "Chúa Tế Nhân Lành", msg: "vừa đạt 500,000 lượt lạy! 🙏", time: "5 phút trước" },
                            { user: "Sen Hồng Nở", msg: "vừa đạt combo x200! 🔥", time: "8 phút trước" },
                            { user: "Maria Mến Yêu", msg: "vừa đạt combo x100! 🌸", time: "12 phút trước" },
                            { user: "Phòng Tích Đức", msg: "vừa vượt mốc 18 triệu lượt lạy! ✨", time: "15 phút trước" },
                        ].map((act, i) => (
                            <div key={i} className="flex items-center justify-between gap-4 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0"><User size={16} className="text-gray-400" /></div>
                                    <p className="text-[12px] font-bold text-gray-500 leading-tight">
                                        <span className="text-black font-black">{act.user}</span> {act.msg}
                                    </p>
                                </div>
                                <span className="text-[11px] font-bold text-gray-500 whitespace-nowrap">{act.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-black/10 rounded-[40px] p-8 shadow-sm text-center flex flex-col">
                    <h3 className="font-black text-[16px] text-orange-600 uppercase tracking-widest mb-10">Thành tựu chung</h3>
                    <div className="grid grid-cols-3 gap-4 flex-1 items-center">
                        <div>
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100"><Users size={24} className="text-blue-500" /></div>
                            <p className="text-[12px] font-black text-gray-400 uppercase leading-none mb-2">Cộng đồng</p>
                            <p className="text-lg font-black text-black uppercase">100K+</p>
                            <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase">Thành viên</p>
                        </div>
                        <div>
                            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100"><PiFlowerLotusThin size={28} className="text-orange-400" /></div>
                            <p className="text-[12px] font-black text-gray-400 uppercase leading-none mb-2">Tích cực</p>
                            <p className="text-lg font-black text-black uppercase">25M+</p>
                            <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase">Lượt lạy</p>
                        </div>
                        <div>
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100"><Heart size={24} className="text-red-500" fill="currentColor" /></div>
                            <p className="text-[12px] font-black text-gray-400 uppercase leading-none mb-2">Hành trình</p>
                            <p className="text-lg font-black text-black uppercase">237</p>
                            <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase">Ngày tu tập</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-black/10 rounded-[40px] p-8 shadow-sm flex flex-col h-full">
                    <h3 className="font-black text-sm text-orange-600 uppercase tracking-widest mb-8">Xu hướng</h3>
                    <div className="space-y-6 flex-1">
                        {[
                            {
                                label: "Lượt lạy tăng", val: "18.6%", desc: "so với hôm qua",
                                icon: <FaSquareUpRight className="text-green-500" size={20} />,
                                trendColor: "text-green-500"
                            },
                            {
                                label: "Thành viên mới", val: "12.4%", desc: "tăng trưởng",
                                icon: <HiUserAdd className="text-blue-500" size={22} />,
                                trendColor: "text-blue-500"
                            },
                            {
                                label: "Phòng Tích Đức", val: "", desc: "hoạt động mạnh hơn",
                                icon: <BsHouseUpFill className="text-orange-500" size={20} />,
                                trendColor: "text-orange-600"
                            },
                            {
                                label: "Giờ cao điểm", val: "", desc: "Tối 20h hàng ngày",
                                icon: <RiTimerFlashFill className="text-purple-500" size={22} />,
                                trendColor: "text-purple-600"
                            },
                            {
                                label: "Cuối tuần", val: "", desc: "lượt lạy tăng cao",
                                icon: <BsCalendar3WeekFill className="text-amber-500" size={18} />,
                                trendColor: "text-amber-600"
                            },
                        ].map((trend, i) => (
                            <div key={i} className="flex items-center justify-between last:border-0 group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center border border-black/5 group-hover:scale-110 transition-transform">
                                        {trend.icon}
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-black text-black uppercase leading-none">
                                            {trend.label} <span className={trend.trendColor}>{trend.val}</span>
                                        </p>
                                        <p className="text-[11px] font-bold text-gray-400 mt-1.5">{trend.desc}</p>
                                    </div>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center border border-green-100 shadow-sm">
                                    <TrendingUp size={12} className="text-green-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}