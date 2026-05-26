import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowLeft, CheckCircle2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../contexts/AuthContext";
import { useGoogleLogin } from '@react-oauth/google';

export function UserRegister() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("/api/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        const data = await res.json();
        if (res.ok) {
          login(data);
          navigate("/");
        } else {
          setError(data.message || "Xác thực Google thất bại");
        }
      } catch (err) {
        setError("Lỗi kết nối máy chủ khi đăng ký bằng Google");
      }
    },
    onError: () => setError("Đăng ký bằng Google thất bại!")
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Mật khẩu xác nhận không khớp!");
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.message || "Đăng ký thất bại");
      }
    } catch (err) {
      setError("Lỗi kết nối máy chủ.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black shadow-[12px_12px_0_0_#000] rounded-[32px] w-full max-w-2xl p-8 md:p-10 relative">

        <Link to="/login" className="inline-flex items-center gap-2 text-xs font-black uppercase text-gray-400 hover:text-black mb-6 transition-colors">
          <ArrowLeft size={14} /> Quay lại Đăng nhập
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-orange-600">Đăng Ký</h2>
            <p className="text-gray-500 font-bold 2xl:pt-1 text-sm">Gia nhập cộng đồng tích đức online ✨</p>
          </div>

          <button type="button" onClick={() => handleGoogleLogin()} className="bg-white border-2 border-black px-6 py-3 rounded-2xl font-black text-xs shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all flex items-center gap-3 cursor-pointer">
            <FcGoogle size={20} /> ĐĂNG KÝ VỚI GOOGLE
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-500 text-red-600 p-3 rounded-xl mb-6 font-bold text-xs">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Tên hiển thị</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text" required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-gray-50 border-2 border-black rounded-xl py-3.5 pl-11 pr-4 font-bold text-sm outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all"
                  placeholder="Tên của bạn"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Địa chỉ Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email" required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-gray-50 border-2 border-black rounded-xl py-3.5 pl-11 pr-4 font-bold text-sm outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password" required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-gray-50 border-2 border-black rounded-xl py-3.5 pl-11 pr-4 font-bold text-sm outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Xác nhận lại</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password" required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-gray-50 border-2 border-black rounded-xl py-3.5 pl-11 pr-4 font-bold text-sm outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-300 border-4 border-black py-4 rounded-2xl font-black text-lg shadow-[6px_6px_0_0_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 mt-4 cursor-pointer"
          >
            TẠO TÀI KHOẢN NGAY <CheckCircle2 size={20} />
          </button>
        </form>

        <p className="mt-8 text-center text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
          Đã có tài khoản? <Link to="/login" className="text-orange-600 font-black hover:underline ml-1">ĐĂNG NHẬP</Link>
        </p>
      </div>
    </div>
  );
}