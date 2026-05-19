import { useState, useEffect } from "react";
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

  useEffect(() => {
    // Only connect once
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on("stateUpdate", (newState: AppState) => {
      setState(newState);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const pray = () => {
    if (socket) {
      socket.emit("pray");
    }
  };

  const joinRoom = (room: "buddha" | "jesus") => {
    if (socket) {
      socket.emit("joinRoom", room);
    }
  };

  const leaveRoom = (room: "buddha" | "jesus") => {
    if (socket) {
      socket.emit("leaveRoom", room);
    }
  };

  return { state, pray, joinRoom, leaveRoom };
}
