import React, { useState, useEffect } from "react";
import { Plus, Trash2, Users, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { GiLotus } from "react-icons/gi";
import { FaCross } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "/api";

async function parseApiResponse(res: Response) {
  const text = await res.text();

  try {
    return text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`Server returned ${res.status} ${res.statusText} instead of JSON`);
  }
}

async function apiFetch(url: string, options?: RequestInit) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 10000);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export function AdminDashboard() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<any[]>([]);
  const [newRoom, setNewRoom] = useState({ name: "", type: "buddha" });
  const [loading, setLoading] = useState(false);

  // Hàm lấy danh sách phòng từ server
  const fetchRooms = async () => {
    try {
      const res = await apiFetch(`${API_URL}/rooms/all`);
      const data = await parseApiResponse(res);

      if (!res.ok) {
        throw new Error(data?.message || "Khong the lay danh sach phong");
      }

      setRooms(data);
    } catch (err) {
      console.error("Fetch rooms failed:", err);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  // Hàm tạo phòng
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch(`${API_URL}/rooms/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newRoom, adminId: user?.id }),
      });

      const data = await parseApiResponse(res);

      if (!res.ok) {
        throw new Error(data?.message || "Khong the tao phong");
      }

      setNewRoom({ name: "", type: "buddha" });
      fetchRooms(); // Cập nhật lại danh sách ngay lập tức
    } catch (err) {
      console.error("Create room failed:", err);
      alert(err instanceof Error ? err.message : "Loi khi tao phong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-6 md:p-10">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-black">Hệ thống quản lý phòng</h1>
          <p className="text-gray-500 font-bold">Chào Admin, bạn có thể tạo và quản lý các phòng lạy tại đây.</p>
        </div>
        <Link to="/" className="flex items-center gap-2 font-black text-xs uppercase bg-white border-2 border-black px-4 py-2 rounded-xl shadow-solid-sm active:translate-y-1 active:shadow-none">
          <ArrowLeft size={14} /> Về trang chủ
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* FORM TẠO PHÒNG (Cột 4/12) */}
        <div className="lg:col-span-4">
          <div className="bg-white border-4 border-black p-8 rounded-[32px] shadow-[10px_10px_0_0_#000]">
            <h3 className="font-black text-xl mb-6 uppercase flex items-center gap-2">
              <Plus className="text-orange-500" /> Tạo phòng mới
            </h3>
            <form onSubmit={handleCreateRoom} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Tên phòng lạy</label>
                <input 
                  type="text" required value={newRoom.name}
                  onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-black p-4 rounded-2xl font-bold mt-1 outline-none focus:bg-white transition-all" 
                  placeholder="Ví dụ: Phòng Tích Đức 01" 
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Loại tâm linh</label>
                <select 
                  value={newRoom.type}
                  onChange={(e) => setNewRoom({...newRoom, type: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-black p-4 rounded-2xl font-bold mt-1 outline-none cursor-pointer"
                >
                  <option value="buddha">Phòng Phật 🙏</option>
                  <option value="jesus">Phòng Chúa ⛪</option>
                </select>
              </div>
              <button 
                type="submit" disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-300 border-4 border-black py-4 rounded-2xl font-black text-lg shadow-[6px_6px_0_0_#000] active:translate-y-1 active:shadow-none transition-all"
              >
                {loading ? "ĐANG TẠO..." : "XÁC NHẬN TẠO PHÒNG"}
              </button>
            </form>
          </div>
        </div>

        {/* DANH SÁCH PHÒNG (Cột 8/12) */}
        <div className="lg:col-span-8">
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-xl uppercase">Danh sách phòng hiện có ({rooms.length})</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map((room) => (
                <div key={room.id} className="bg-white border-2 border-black p-5 rounded-[24px] flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-black/5 
                        ${room.type === 'buddha' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                         {room.type === 'buddha' ? <GiLotus size={24}/> : <FaCross size={20}/>}
                      </div>
                      <div>
                         <p className="font-black text-sm uppercase leading-tight">{room.name}</p>
                         <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
                           ID: <span className="text-orange-500">{room.id}</span> | {room.current_count}/25 Người
                         </p>
                      </div>
                   </div>
                   <button className="text-gray-300 hover:text-red-500 p-2 transition-colors cursor-pointer">
                      <Trash2 size={20}/>
                   </button>
                   <Link
                     to={room.type === 'buddha' ? `/buddhaRoom/${room.id}` : `/jesusRoom/${room.id}`}
                     className="text-[10px] font-black uppercase bg-black text-white px-3 py-2 rounded-xl shadow-sm hover:bg-gray-800"
                   >
                     Vào phòng
                   </Link>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
