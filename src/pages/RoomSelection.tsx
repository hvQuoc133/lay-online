import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AnimatedNumber } from "../components/AnimatedNumber";
import { ArrowLeft, Lock, Users, Flame, Target } from "lucide-react";
import { GiLotus } from "react-icons/gi";
import { FaCross } from "react-icons/fa";
import { motion, AnimatePresence } from "motion/react";

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

export function RoomSelection() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [rooms, setRooms] = useState<BackendRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joiningRoomId, setJoiningRoomId] = useState<string | null>(null);

  // *** AUTH CHECK: Nếu chưa login → redirect ***
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: `/rooms/${type}` } });
    }
  }, [user, navigate, type]);

  // *** FETCH danh sách phòng theo loại ***
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError("");
      try {
        // Gọi /rooms/all và filter client-side theo type
        const res = await fetch(`${API_URL}/rooms/all`);
        if (!res.ok) {
          setRooms([]);
          return;
        }
        const allRooms = await res.json();

        // Filter rooms theo type
        if (Array.isArray(allRooms)) {
          const filteredRooms = allRooms.filter(
            (room: BackendRoom) => room.type === type
          );
          setRooms(filteredRooms);
        } else {
          setRooms([]);
        }
      } catch (err) {
        console.error("Fetch rooms failed:", err);
        setError("Lỗi khi tải danh sách phòng. Hãy reload trang.");
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    if (type && user) {
      fetchRooms();
    }
  }, [type, user]);

  // *** JOIN ROOM ***
  const handleJoinRoom = async (roomId: string) => {
    if (!user?.id || !roomId) return;

    setJoiningRoomId(roomId);
    try {
      const res = await fetch(`${API_URL}/rooms/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, userId: user.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Không thể vào phòng");
        return;
      }

      // ✅ Join thành công → redirect sang phòng lạy
      const roomType = type === "buddha" ? "buddha" : "jesus";
      navigate(`${roomType === "buddha" ? "/buddhaRoom" : "/jesusRoom"}/${roomId}`);
    } catch (err) {
      console.error("Join room failed:", err);
      alert("Lỗi khi tham gia phòng");
    } finally {
      setJoiningRoomId(null);
    }
  };

  const isBuddha = type === "buddha";
  const pageTitle = isBuddha ? "Phòng Lạy Phật" : "Phòng Cầu Nguyện Chúa";
  const pageSubtitle = isBuddha
    ? "Chọn một phòng lạy để tích đức"
    : "Chọn một phòng cầu nguyện để bình an";
  const primaryColor = isBuddha ? "orange" : "blue";
  const bgGradient = isBuddha
    ? "from-orange-50 to-yellow-50"
    : "from-blue-50 to-cyan-50";
  const borderColor = isBuddha ? "border-orange-200" : "border-blue-200";
  const accentColor = isBuddha ? "text-orange-600" : "text-blue-700";
  const accentBg = isBuddha ? "bg-orange-50" : "bg-blue-50";
  const accentButton = isBuddha
    ? "bg-orange-500 hover:bg-orange-400"
    : "bg-blue-600 hover:bg-blue-500";

  if (!user) return null; // Loading while redirect

  return (
    <div className="min-h-[70vh] py-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-black/10 rounded-xl font-black text-xs shadow-sm hover:bg-gray-50 transition-all active:scale-95"
        >
          <ArrowLeft size={14} /> Quay lại
        </button>

        <div className="text-center flex-1">
          <div className={`flex items-center justify-center gap-2 ${accentColor} mb-2`}>
            {isBuddha ? (
              <GiLotus size={32} />
            ) : (
              <FaCross size={28} />
            )}
            <h1 className="font-black text-2xl md:text-4xl uppercase tracking-tighter">
              {pageTitle}
            </h1>
          </div>
          <p className="text-xs md:text-sm font-bold text-gray-500">
            {pageSubtitle}
          </p>
        </div>

        <div className="w-[120px]" /> {/* Spacer for alignment */}
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block px-6 py-3 bg-gray-50 rounded-2xl">
              <p className="font-black text-gray-600">⏳ Đang tải phòng...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="inline-block px-6 py-3 bg-red-50 rounded-2xl border border-red-200">
              <p className="font-black text-red-600">{error}</p>
            </div>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Target size={40} className="text-gray-400" />
              </div>
              <p className="font-black text-xl text-gray-800 mb-2">
                Chưa có phòng nào
              </p>
              <p className="text-sm font-bold text-gray-500 mb-6">
                Admin cần tạo phòng {isBuddha ? "lạy Phật" : "cầu nguyện Chúa"} trước
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2 bg-orange-500 text-white rounded-xl font-black text-sm hover:bg-orange-400 transition-all active:scale-95"
              >
                Quay lại trang chủ
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {rooms.map((room, idx) => {
                const isFull = room.current_count >= room.capacity;
                const spotsLeft = room.capacity - room.current_count;

                return (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`relative overflow-hidden rounded-[30px] border-2 shadow-sm transition-all ${borderColor} bg-gradient-to-br ${bgGradient} hover:shadow-lg hover:border-opacity-100`}
                  >
                    {/* FULL OVERLAY */}
                    {isFull && (
                      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-10 rounded-[30px]">
                        <div className="text-center">
                          <Lock size={40} className="text-white mx-auto mb-2" />
                          <p className="font-black text-white text-lg">Phòng đã đầy</p>
                        </div>
                      </div>
                    )}

                    <div className="p-6 md:p-8">
                      {/* ROOM NAME */}
                      <h3 className={`font-black text-xl md:text-2xl mb-2 ${accentColor}`}>
                        {room.name}
                      </h3>

                      {/* STATS GRID */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {/* Current Count */}
                        <div className={`${accentBg} rounded-xl p-3 border border-black/5`}>
                          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
                            Đang online
                          </p>
                          <div className="flex items-baseline gap-1">
                            <p className="text-2xl font-black text-black">
                              <AnimatedNumber value={room.current_count} />
                            </p>
                            <p className="text-xs font-bold text-gray-500">
                              / {room.capacity}
                            </p>
                          </div>
                        </div>

                        {/* Spots Left */}
                        <div
                          className={`${
                            isFull
                              ? "bg-red-50"
                              : "bg-green-50"
                          } rounded-xl p-3 border border-black/5`}
                        >
                          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
                            Chỗ trống
                          </p>
                          <p
                            className={`text-2xl font-black ${
                              isFull ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            {spotsLeft}
                          </p>
                        </div>

                        {/* Total Prayers */}
                        <div className={`${accentBg} rounded-xl p-3 border border-black/5 col-span-2`}>
                          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
                            Tổng {isBuddha ? "lạy" : "cầu nguyện"}
                          </p>
                          <div className="flex items-center gap-2">
                            <Flame size={16} className={`${accentColor}`} />
                            <p className="text-lg font-black text-black">
                              <AnimatedNumber value={room.total_room_prayers} />
                              <span className="text-xs font-bold text-gray-500 ml-1">
                                lượt
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* CAPACITY BAR */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-[10px] font-black text-gray-400 uppercase">
                            Mức độ tập trung
                          </p>
                          <p className="text-[10px] font-black text-gray-600">
                            {Math.round((room.current_count / room.capacity) * 100)}%
                          </p>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden border border-black/5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${
                                (room.current_count / room.capacity) * 100
                              }%`,
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className={`h-full ${
                              isBuddha
                                ? "bg-gradient-to-r from-orange-400 to-orange-500"
                                : "bg-gradient-to-r from-blue-400 to-blue-600"
                            }`}
                          />
                        </div>
                      </div>

                      {/* JOIN BUTTON - ALWAYS ENABLED */}
                      <button
                        onClick={() => handleJoinRoom(room.id)}
                        disabled={joiningRoomId === room.id}
                        className={`w-full py-3 px-4 rounded-xl font-black text-sm uppercase transition-all active:translate-y-1 border-2 border-black shadow-sm ${accentButton} text-white hover:shadow-lg active:shadow-none disabled:opacity-50`}
                      >
                        {joiningRoomId === room.id ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Đang vào...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Users size={16} /> Vào phòng {isBuddha ? "lạy" : "cầu nguyện"}
                          </span>
                        )}
                      </button>

                      {/* INFO */}
                      <p className="text-[10px] font-bold text-gray-400 mt-3 text-center">
                        Room ID: <span className="font-black text-black">{room.id}</span>
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
