import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, LogIn, HardDrive } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Thêm state báo lỗi
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 1. Gọi API Login chung
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 2. KIỂM TRA QUYỀN: Nếu không phải admin thì từ chối
        if (data.role !== 'admin') {
          setError("Tài khoản này không có quyền truy cập Admin!");
          return;
        }

        // 3. Nếu đúng là Admin: Lưu vào context và chuyển hướng
        login(data);
        navigate("/admin"); // Chuyển sang trang Dashboard Admin
      } else {
        setError(data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      setError("Lỗi kết nối server!");
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black shadow-[16px_16px_0_0_#000] rounded-[32px] w-full max-w-lg p-10 relative">
        <div className="flex items-center gap-3 mb-8">
           <div className="w-12 h-12 bg-red-600 rounded-2xl border-2 border-black flex items-center justify-center text-white shadow-sm">
              <ShieldCheck size={28} />
           </div>
           <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Hệ thống Quản trị</h2>
              <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-1">Chỉ dành cho Admin</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 border-2 border-black rounded-3xl p-6 space-y-4 shadow-inner">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Mã định danh Admin</label>
                <div className="relative">
                   <HardDrive className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white border-2 border-black/10 rounded-xl py-3 pl-12 pr-4 font-bold text-sm outline-none focus:border-red-500 transition-all" placeholder="admin_code" />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Mật khẩu bảo mật</label>
                <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-white border-2 border-black/10 rounded-xl py-3 pl-12 pr-4 font-bold text-sm outline-none focus:border-red-500 transition-all" placeholder="••••••••" />
                </div>
             </div>
          </div>

          <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white border-4 border-black py-5 rounded-[24px] font-black text-xl shadow-[8px_8px_0_0_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-4 mt-6 uppercase italic">
            Xác thực Admin <LogIn size={24} />
          </button>
        </form>

        <p className="mt-10 text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">
           Security Level: 128-bit Encrypted 🔐
        </p>
      </div>
      {error && <p className="text-red-500 text-xs font-bold mb-4">⚠️ {error}</p>}
    </div>
  );
}