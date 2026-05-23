import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { FcGoogle } from "react-icons/fc"; // Icon Google chuẩn
import { useAuth } from "../../contexts/AuthContext";

export function UserLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, rememberMe }),
            });
            const data = await response.json();
            if (response.ok) {
                login(data);
                navigate("/");
            } else {
                setError(data.message || "Đăng nhập thất bại");
            }
        } catch (err) {
            setError("Không thể kết nối đến máy chủ.");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="bg-white border-4 border-black shadow-[12px_12px_0_0_#000] rounded-[32px] w-full max-w-md p-8 relative">
                <Link to="/" className="inline-flex items-center gap-2 text-xs font-black uppercase text-gray-400 hover:text-black mb-8 transition-colors">
                    <ArrowLeft size={14} /> Trang chủ
                </Link>

                <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 text-orange-600">Đăng Nhập</h2>
                <p className="text-gray-500 font-bold text-sm mb-8">Đăng nhập để tiếp tục hành trình tích đức 🙏</p>

                <button
                    type="button"
                    className="w-full bg-white border-2 border-black py-3 rounded-2xl font-black text-sm shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 mb-8 cursor-pointer"
                >
                    <FcGoogle size={22} /> ĐĂNG NHẬP VỚI GOOGLE
                </button>

                <div className="relative flex items-center mb-8">
                    <div className="flex-1 border-t border-black/10"></div>
                    <span className="px-4 text-[10px] font-black text-gray-400 uppercase">Hoặc dùng Email</span>
                    <div className="flex-1 border-t border-black/10"></div>
                </div>

                {error && <div className="bg-red-50 border-2 border-red-500 text-red-600 p-3 rounded-xl mb-6 font-bold text-xs">⚠️ {error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase ml-1">Email</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 border-2 border-black rounded-2xl py-4 px-4 font-bold text-sm outline-none focus:bg-white transition-all" placeholder="user@gmail.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase ml-1">Mật khẩu</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 border-2 border-black rounded-2xl py-4 px-4 font-bold text-sm outline-none focus:bg-white transition-all" placeholder="••••••••" />
                    </div>

                    <div className="flex items-center justify-between px-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 border-2 border-black rounded accent-orange-500"
                            />
                            <span className="text-xs font-bold text-gray-500 group-hover:text-black">Ghi nhớ tôi</span>
                        </label>
                        <Link to="/forgot-password" size={12} className="text-xs font-bold text-orange-600 hover:underline">Quên mật khẩu?</Link>
                    </div>

                    <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-300 border-4 border-black py-4 rounded-2xl font-black text-lg shadow-[6px_6px_0_0_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 cursor-pointer">
                        VÀO LẠY THÔI! <ArrowRight size={20} />
                    </button>
                </form>

                <p className="mt-8 text-center text-xs font-bold text-gray-500">
                    Bạn chưa có tài khoản? <Link to="/register" className="text-orange-600 font-black hover:underline ml-1">ĐĂNG KÝ NGAY</Link>
                </p>
            </div>
        </div>
    );
}