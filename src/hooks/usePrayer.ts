import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface AppState {
  totalMembers: number;
  totalPrayers: number;
  prayersToday: number;
  onlineMembers: number;
  bestDay: string;
  buddhaRoomActive: number;
  jesusRoomActive: number;
}

interface RoomStats {
  roomId: string;
  userId?: number;
  total?: number;
  roomTotal?: number;
}

const defaultState: AppState = {
  totalMembers: 0,
  totalPrayers: 0,
  prayersToday: 0,
  onlineMembers: 0,
  bestDay: "Thứ 2",
  buddhaRoomActive: 0,
  jesusRoomActive: 0,
};

export function usePrayer() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [state, setState] = useState<AppState>(defaultState);
  const [roomStats, setRoomStats] = useState<RoomStats | null>(null);

  useEffect(() => {
    // Only connect once
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on("stateUpdate", (newState: AppState) => {
      setState(newState);
    });

    newSocket.on("update_stats", (stats: RoomStats) => {
      setRoomStats(stats);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const pray = useCallback(() => {
    if (socket) {
      socket.emit("pray");
    }
  }, [socket]);

  const joinRoom = useCallback((room: "buddha" | "jesus") => {
    if (socket) {
      socket.emit("joinRoom", room);
    }
  }, [socket]);

  const leaveRoom = useCallback((room: "buddha" | "jesus") => {
    if (socket) {
      socket.emit("leaveRoom", room);
    }
  }, [socket]);

  const joinPrayerRoom = useCallback((roomId: string) => {
    if (socket) {
      socket.emit("join_prayer_room", roomId);
    }
  }, [socket]);

  const emitRoomPrayer = useCallback((roomId: string, userId?: number, roomType?: "buddha" | "jesus") => {
    if (socket) {
      socket.emit("user_prayed", { roomId, userId, roomType });
    }
  }, [socket]);

  return { state, roomStats, pray, joinRoom, leaveRoom, joinPrayerRoom, emitRoomPrayer };
}
