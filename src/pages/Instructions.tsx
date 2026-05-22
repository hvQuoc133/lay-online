import React from "react";
import {
    Home, Play, Users, Zap, Trophy, ShieldCheck, HelpCircle,
    CheckCircle2, ArrowRight, User, Lock, Heart, CalendarCheck,
    Activity, CalendarDays, Star, Crown
} from "lucide-react";
import { PiFlowerLotusThin } from "react-icons/pi";
import { FaCross } from "react-icons/fa";
import { GiLotus } from "react-icons/gi";

export function Instructions() {
    const quickLinks = [
        { icon: <Home className="text-green-600" />, label: "Tổng quan", color: "bg-green-100" },
        { icon: <Play className="text-orange-600" />, label: "Bắt đầu lạy", color: "bg-orange-100" },
        { icon: <Users className="text-blue-600" />, label: "Phòng & Camp", color: "bg-blue-100" },
        { icon: <Zap className="text-purple-600" />, label: "Tăng hiệu quả", color: "bg-purple-100" },
        { icon: <Trophy className="text-red-600" />, label: "Thành tích", color: "bg-red-100" },
        { icon: <ShieldCheck className="text-teal-600" />, label: "Quy tắc", color: "bg-teal-100" },
        { icon: <HelpCircle className="text-yellow-600" />, label: "Câu hỏi", color: "bg-yellow-100" },
    ];

    return (
        <div className="max-w-[1600px] pb-20 mx-auto px-4">

            <section className="pt-14 pb-2 flex flex-col items-center justify-center text-center">
                <h1 className="font-display font-black text-5xl md:text-[64px] uppercase tracking-tighter text-orange-500">
                    Hướng dẫn sử dụng
                </h1>
                <p className="mt-4 text-sm md:text-lg font-bold text-black uppercase tracking-[0.2em]">
                    Lạy đúng cách – Tích đức mỗi ngày – An yên cuộc sống 🙏
                </p>

                <div className="xl:mt-10 relative top-14 flex justify-center items-center">
                    <div className="absolute w-40 h-20 bg-orange-400/20 blur-[50px] rounded-full -z-10"></div>
                    <PiFlowerLotusThin
                        size={128}
                        className="text-amber-500 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)] relative z-10"
                    />
                </div>
            </section>

            <section className="mx-auto px-4 mt-2 relative">
                <div className="relative  mx-auto">
                    <div className="absolute bottom-[calc(100%-0px)] left-0 md:left-5 z-20 pointer-events-none hidden lg:block">
                        <img src="/images/img-5.png" alt="Buddha" className="w-64 xl:w-56 h-auto" />
                    </div>
                    <div className="absolute bottom-[calc(100%-0px)] right-0 md:right-5 z-20 pointer-events-none hidden lg:block">
                        <img src="/images/img-6.png" alt="Meme" className="w-64 xl:w-56 h-auto" />
                    </div>

                    <div className="bg-white border-[2px] border-[oklch(70.5%_0.213_47.604)]/30 rounded-[35px] shadow-sm py-5 relative z-10">
                        <p className="text-center font-black uppercase text-[16px] text-orange-900/60 mb-5">
                            Nội dung hướng dẫn
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-7 gap-y-5 md:gap-y-0 md:divide-x divide-black/5">
                            {quickLinks.map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-5 group cursor-pointer px-2">
                                    <div className={`${item.color} w-14 h-14 rounded-full flex items-center justify-center transition-all group-hover:scale-110 shadow-sm`}>
                                        {React.cloneElement(item.icon as React.ReactElement, { size: 24 })}
                                    </div>
                                    <span className="font-black text-[10px] md:text-[12px] uppercase text-gray-500 text-center leading-tight tracking-tighter">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-[1600px] mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border border-black/10 rounded-[35px] shadow-sm relative overflow-hidden h-full">
                    <div className="flex flex-col sm:flex-row h-full">
                        <div className="p-8 flex-1 relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-8 h-8 bg-green-600 rounded-full text-white flex items-center justify-center font-black text-sm">1</span>
                                <h2 className="text-2xl font-black text-green-600 uppercase tracking-tighter">Tổng quan</h2>
                            </div>
                            <p className="font-bold text-gray-700 mb-8 text-sm leading-relaxed xl:max-w-[50%]">
                                Lạy Online là nền tảng giúp bạn lạy online mọi lúc mọi nơi để tích đức, gieo thiện, cầu bình an và an yên trong cuộc sống.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Lạy mọi lúc, mọi nơi",
                                    "Tham gia cộng đồng thiện lành",
                                    "Theo dõi tiến trình và thành tích",
                                    "Nhiều phòng với mục tiêu khác nhau"
                                ].map((text, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50" />
                                        {text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-3/6">
                            <img
                                src="/images/bg-1.png"
                                alt="Buddha Background"
                                className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
                                style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)' }}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-black/10 rounded-[35px] shadow-sm p-8 relative overflow-hidden h-full">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-8 h-8 bg-orange-500 rounded-full text-white flex items-center justify-center font-black text-sm">2</span>
                        <h2 className="text-2xl font-black text-orange-600 uppercase tracking-tighter">Bắt đầu lạy</h2>
                    </div>
                    <p className="font-bold text-gray-700 mb-10 text-sm">
                        Chỉ với vài thao tác đơn giản để bắt đầu lạy và tích đức.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative items-start">

                        <div className="flex flex-col items-center group">
                            <div className="relative mb-4 w-full h-32 bg-white border-2 border-orange-100 rounded-2xl p-3 flex flex-col justify-center gap-2 shadow-sm transition-transform group-hover:-translate-y-1">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-orange-500 rounded-full text-white text-[10px] font-black flex items-center justify-center border-2 border-white z-10">1</div>
                                <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 border border-black/5 rounded-lg">
                                    <User size={10} className="text-blue-500" />
                                    <div className="h-1.5 w-12 bg-gray-200 rounded-full"></div>
                                </div>
                                <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 border border-black/5 rounded-lg">
                                    <Lock size={10} className="text-gray-400" />
                                    <div className="h-1.5 w-8 bg-gray-200 rounded-full"></div>
                                </div>
                                <div className="w-full h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <div className="w-8 h-1.5 bg-white/40 rounded-full"></div>
                                </div>
                                <ArrowRight className="hidden sm:block absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 text-orange-300 w-4 h-4" />
                            </div>
                            <p className="text-[10px] font-bold text-gray-500 text-center leading-tight">Đăng nhập tài khoản</p>
                        </div>

                        <div className="flex flex-col items-center group">
                            <div className="relative mb-4 w-full h-32 bg-white border-2 border-orange-100 rounded-2xl p-2 flex flex-col items-center justify-center text-center transition-transform group-hover:-translate-y-1 shadow-sm">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-orange-500 rounded-full text-white text-[10px] font-black flex items-center justify-center border-2 border-white z-10">2</div>
                                <GiLotus className="text-amber-500 text-2xl mb-1" />
                                <p className="text-[8px] font-black text-orange-600 uppercase leading-none mb-1">PHÒNG TÍCH ĐỨC</p>
                                <p className="text-[7px] font-bold text-gray-400 mb-2">1,248 người lạy</p>
                                <div className="px-4 py-1.5 bg-yellow-400 border border-black rounded-lg font-black text-[8px] shadow-[2px_2px_0_0_#000]">Vào phòng</div>
                                <ArrowRight className="hidden sm:block absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 text-orange-300 w-4 h-4" />
                            </div>
                            <p className="text-[10px] font-bold text-gray-500 text-center leading-tight">Chọn phòng lạy</p>
                        </div>

                        <div className="flex flex-col items-center group">

                            <div className="relative mb-4 w-full h-32 bg-white border-2 border-orange-100 rounded-2xl p-2 flex items-center justify-center transition-transform group-hover:-translate-y-1 shadow-sm">

                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-orange-500 rounded-full text-white text-[10px] font-black flex items-center justify-center border-2 border-white z-20">
                                    3
                                </div>

                                <img
                                    src="/images/meme-2.png"
                                    alt="Lạy"
                                    className="w-full h-full object-contain rounded-xl"
                                />

                                <ArrowRight className="hidden sm:block absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 text-orange-300 w-4 h-4" />
                            </div>
                            <p className="text-[10px] font-bold text-gray-500 text-center leading-tight">Nhấn bắt đầu lạy</p>
                        </div>

                        <div className="flex flex-col items-center group">
                            <div className="relative mb-4 w-full h-32 bg-white border-2 border-orange-100 rounded-2xl p-3 flex flex-col items-center justify-center transition-transform group-hover:-translate-y-1 shadow-sm">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-orange-500 rounded-full text-white text-[10px] font-black flex items-center justify-center border-2 border-white z-10">4</div>
                                <div className="w-full bg-orange-50 py-1 rounded-md text-center mb-2 border border-orange-100">
                                    <p className="text-[7px] font-black text-orange-400 uppercase">Lượt lạy của bạn</p>
                                </div>
                                <p className="text-3xl font-black text-black leading-none">128</p>
                                <p className="text-[9px] font-bold text-gray-300 uppercase mt-1">lượt lạy</p>
                            </div>
                            <p className="text-[10px] font-bold text-gray-500 text-center leading-tight">Hệ thống đếm số</p>
                        </div>

                    </div>
                </div>

            </section>

            <section className="max-w-[1600px] mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border border-black/10 rounded-[35px] shadow-sm p-8 flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-8 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center font-black text-sm">3</span>
                            <h2 className="text-2xl font-black text-blue-600 uppercase tracking-tighter">Phòng & Camp</h2>
                        </div>
                        <p className="font-bold text-gray-700 mb-8 text-sm leading-relaxed">
                            Tham gia phòng phù hợp với mục tiêu của bạn và theo dõi camp để tăng hiệu quả.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-red-50 p-2 rounded-xl text-red-500"><GiLotus size={24} /></div>
                                <div>
                                    <h4 className="font-black text-sm text-black">Phòng tích đức</h4>
                                    <p className="text-[12px] font-bold text-gray-400 leading-tight mt-1">Tích lũy công đức, cầu an, cầu bình an, sức khỏe...</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-50 p-2 rounded-xl text-blue-700"><FaCross size={20} /></div>
                                <div>
                                    <h4 className="font-black text-sm text-black">Phòng rửa tội</h4>
                                    <p className="text-[12px] font-bold text-gray-400 leading-tight mt-1">Rửa sạch tội lỗi, bắt đầu lại từ tâm.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-green-50 p-2 rounded-xl text-green-600"><Home size={20} /></div>
                                <div>
                                    <h4 className="font-black text-sm text-black">Camp</h4>
                                    <p className="text-[12px] font-bold text-gray-400 leading-tight mt-1">Mỗi camp có mục tiêu riêng, giúp bạn có động lực và theo dõi tiến độ.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-[260px] bg-white border border-black/5 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm">🏔️</span>
                            <p className="text-[12px] font-black text-green-600 uppercase tracking-tighter">Camp hiện tại: <span className="text-black">Chánh niệm</span></p>
                        </div>
                        <div className="w-full bg-gray-100 rounded-xl mb-4 overflow-hidden border border-black/5">
                            <img src="/images/img-9.png" alt="Camp BG" className="w-full h-full object-contain" />
                        </div>
                        <div className="mb-4">
                            <div className="flex justify-between text-[10px] font-black mb-1.5 uppercase">
                                <span>Cấp độ 3</span>
                                <span className="text-gray-400">650 / 1,000 điểm</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-black/5">
                                <div className="h-full bg-green-500 w-[65%] rounded-full"></div>
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-black mb-2 uppercase tracking-tighter">Lợi ích camp:</p>
                        <ul className="space-y-1.5 text-[11px] font-bold text-gray-500">
                            <li className="flex items-center gap-2">⭐ Tăng 10% hiệu quả lượt lạy</li>
                            <li className="flex items-center gap-2">⭐ Nhận điểm thưởng khi đạt mốc</li>
                            <li className="flex items-center gap-2">⭐ Top camp nhận huy hiệu đặc biệt</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white border border-black/10 rounded-[35px] shadow-sm p-8 relative overflow-hidden flex flex-col md:flex-row h-full">
                    <div className="md:w-1/2 z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-8 h-8 bg-purple-600 rounded-full text-white flex items-center justify-center font-black text-sm">4</span>
                            <h2 className="text-2xl font-black text-purple-600 uppercase tracking-tighter">Tăng hiệu quả</h2>
                        </div>
                        <p className="font-bold text-gray-700 mb-10 text-sm">Một số mẹo giúp bạn lạy hiệu quả hơn mỗi ngày.</p>

                        <div className="space-y-6">
                            {[
                                { icon: <Zap size={16} className="text-orange-400 fill-orange-400" />, text: "Lạy đều tay, giữ tâm thành kính" },
                                { icon: <Heart size={16} className="text-red-500 fill-red-500" />, text: "Tham gia camp phù hợp để nhận hiệu quả cộng thêm" },
                                { icon: <Users size={16} className="text-blue-500 fill-blue-500" />, text: "Mời bạn bè cùng lạy để tăng động lực" },
                                { icon: <CalendarCheck size={16} className="text-red-500 fill-white-500" />, text: "Duy trì thói quen lạy mỗi ngày" },
                                { icon: <Trophy size={16} className="text-red-600 fill-red-600" />, text: "Hoàn thành mục tiêu để nhận huy hiệu và phần thưởng" }
                            ].map((tip, i) => (
                                <div key={i} className="flex items-center gap-4 text-sm font-bold text-gray-600">
                                    <div className="shrink-0">{tip.icon}</div>
                                    <p className="leading-tight">{tip.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="hidden sm:flex items-end justify-center w-full relative md:w-1/2">
                        <div className="absolute inset-0 bg-yellow-400/10 blur-3xl rounded-full translate-y-10"></div>
                        <img src="/images/img-7.png" alt="Character Tip" className="w-full h-auto object-contain relative z-10 scale-100" />
                    </div>
                </div>

            </section>

            <section className="max-w-[1600px] mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

                <div className="bg-white border border-black/10 rounded-[35px] shadow-sm p-8 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-8 h-8 bg-red-500 rounded-full text-white flex items-center justify-center font-black text-sm">5</span>
                        <h2 className="text-2xl font-black text-red-500 uppercase tracking-tighter">Thành tích & Thống kê</h2>
                    </div>
                    <p className="font-bold text-gray-700 mb-5 text-sm leading-relaxed">
                        Theo dõi thành tích cá nhân và đóng góp của bạn cho cộng đồng.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                        {[
                            { icon: <Activity className="text-orange-600" />, val: "12,548", label: "Tổng lượt lạy" },
                            { icon: <Trophy className="text-yellow-600" />, val: "2,548", label: "Ngày lạy nhiều nhất" },
                            { icon: <CalendarDays className="text-red-600" />, val: "7", label: "Chuỗi ngày lạy" },
                            { icon: <Star className="text-amber-600" />, val: "15", label: "Huy hiệu đạt được" }
                        ].map((item, i) => (
                            <div key={i} className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm hover:bg-orange-100/50 transition-all">
                                <div className="mb-3 p-2 bg-white border border-orange-100 rounded-full shadow-sm">
                                    {React.cloneElement(item.icon as React.ReactElement, { size: 20 })}
                                </div>
                                <p className="text-base font-black text-black leading-none">{item.val}</p>
                                <p className="text-[11px] font-bold text-gray-500 mt-2 leading-tight">{item.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-5 relative">
                        <p className="text-center font-black text-[12px] text-orange-600 uppercase mb-6">Top Phật tử lạy nhiều nhất</p>
                        <div className="grid grid-cols-5 gap-2">
                            {[
                                { name: "Tâm Hướng Phật", count: "1,248", crown: true },
                                { name: "Phật Tử Tí Hon", count: "842" },
                                { name: "Sen Hồng Nở", count: "715" },
                                { name: "Bình An Tự Tại", count: "635" },
                                { name: "Lạc Thiện", count: "512" }
                            ].map((user, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className="relative mb-2">
                                        {user.crown && <Crown size={18} className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-500 fill-yellow-400" />}
                                        <div className="w-14 h-14 rounded-full bg-white border border-black/5 flex items-center justify-center overflow-hidden">
                                            <User size={30} className="text-gray-300" />
                                        </div>
                                    </div>
                                    <p className="text-[12px] font-black text-black text-center leading-tight truncate w-full">{user.name}</p>
                                    <p className="text-[11px] font-bold text-gray-400 leading-none mt-1">{user.count} lượt</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto pt-8 flex justify-center">
                        <button className="flex items-center justify-center gap-3 cursor-pointer px-8 py-3 bg-orange-50 border border-orange-200 rounded-[20px] text-xs font-black text-orange-600 hover:bg-orange-100 hover:border-orange-300 transition-all group shadow-sm active:scale-95">
                            Xem bảng xếp hạng đầy đủ
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-black/10 rounded-[35px] shadow-sm p-8 flex flex-col md:flex-row h-full relative overflow-hidden">
                    <div className="flex-1 z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-8 h-8 bg-teal-600 rounded-full text-white flex items-center justify-center font-black text-sm shadow-sm">6</span>
                            <h2 className="text-2xl font-black text-teal-600 uppercase tracking-tighter">Quy tắc phòng</h2>
                        </div>
                        <p className="font-bold text-gray-700 mb-5 text-sm leading-relaxed">
                            Cùng nhau tạo môi trường thanh tịnh, tôn trọng và thiện lành.
                        </p>

                        <ul className="space-y-5">
                            {[
                                "Giữ thái độ tôn trọng, hòa nhã với tất cả mọi người",
                                "Không sử dụng ngôn từ thô tục, xúc phạm",
                                "Không spam, quảng cáo hoặc chia sẻ nội dung không phù hợp",
                                "Tập trung vào việc lạy và tích đức",
                                "Tuân thủ hướng dẫn của quản trị viên",
                                "Vi phạm sẽ bị cảnh báo hoặc khóa tài khoản"
                            ].map((rule, i) => (
                                <li key={i} className="flex items-center gap-4">
                                    <div className="bg-teal-50 p-1 rounded-lg border border-teal-100">
                                        <ShieldCheck size={18} className="text-teal-600" />
                                    </div>
                                    <p className="text-xs font-bold text-gray-600 leading-tight">{rule}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col items-center justify-end w-full md:w-[320px] relative xl:pt-20 md:pt-0">

                        <div className="flex flex-col items-center justify-end w-full md:w-[350px] relative xl:pt-10 md:pt-0">

                            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400/30 blur-[70px] rounded-full -z-10 animate-pulse"></div>

                            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-amber-200/40 blur-[40px] rounded-full -z-10"></div>

                            <div className="relative z-10 w-full flex justify-center translate-y-6">
                                <img
                                    src="/images/img-8.png"
                                    alt="Buddha Rule"
                                    className="w-[280px] md:w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]"
                                />
                            </div>
                        </div>

                        <div className="absolute bottom-0 w-40 h-20 bg-teal-400/5 blur-[40px] rounded-full -z-10"></div>
                    </div>
                </div>

            </section>

            <section className="max-w-[1600px] mx-auto px-4 mt-16">

                <div className="bg-white border border-black/10 rounded-[35px] shadow-sm p-8 md:p-10">

                    <div className="flex items-center gap-3 mb-10">
                        <span className="w-8 h-8 bg-yellow-500 rounded-full text-white flex items-center justify-center font-black text-sm shadow-sm">7</span>
                        <h2 className="text-2xl font-black text-yellow-600 uppercase tracking-tighter">Câu hỏi thường gặp</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                        {[
                            { q: "Lạy online có thật sự được tích đức không?", a: "Có. Quan trọng là tâm thành kính và việc làm thiện lương mỗi ngày." },
                            { q: "Tôi có thể lạy ở nhiều phòng cùng lúc không?", a: "Bạn chỉ có thể lạy ở 1 phòng tại một thời điểm để hệ thống đếm chính xác." },
                            { q: "Camp là gì? Có bắt buộc tham gia không?", a: "Camp là thử thách theo chủ đề. Bạn không bắt buộc nhưng tham gia sẽ nhận nhiều lợi ích hơn." },
                            { q: "Lượt lạy hôm nay được tính khi nào?", a: "Lượt lạy được tính ngay khi bạn bắt đầu lạy và sẽ được lưu khi tạm dừng." },
                            { q: "Tôi quên tạm dừng lạy thì lượt lạy có bị mất không?", a: "Không. Hệ thống sẽ tự động lưu lượt lạy khi bạn thoát khỏi phòng." },
                        ].map((faq, i) => (
                            <div
                                key={i}
                                className="bg-orange-50/50 border border-[oklch(70.5%_0.213_47.604)]/30 rounded-[10px] p-4 flex gap-4 shadow-sm hover:border-[oklch(70.5%_0.213_47.604)]/60 transition-all group"
                            >
                                <div className="shrink-0">
                                    <div className="w-8 h-8 rounded-full border border-[oklch(70.5%_0.213_47.604)]/50 flex items-center justify-center bg-white shadow-sm group-hover:scale-110 transition-transform">
                                        <HelpCircle size={16} className="text-yellow-600" />
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col gap-2">
                                    <h4 className="text-[14px] font-black text-black leading-tight tracking-tighter">
                                        {faq.q}
                                    </h4>
                                    <p className="text-[12px] font-bold text-gray-500 leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}