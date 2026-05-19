import { Server, Socket } from "socket.io";
import { state, getState } from "../db/data";

export function setupSockets(io: Server) {
  io.on("connection", (socket: Socket) => {
    state.onlineMembers++;
    io.emit("stateUpdate", getState());

    socket.on("pray", () => {
      state.totalPrayers++;
      state.prayersToday++;
      io.emit("stateUpdate", getState());
    });

    socket.on("joinRoom", (room) => {
       if (room === 'buddha') state.buddhaRoomActive++;
       if (room === 'jesus') state.jesusRoomActive++;
       io.emit("stateUpdate", getState());
    });

    socket.on("leaveRoom", (room) => {
       if (room === 'buddha' && state.buddhaRoomActive > 0) state.buddhaRoomActive--;
       if (room === 'jesus' && state.jesusRoomActive > 0) state.jesusRoomActive--;
       io.emit("stateUpdate", getState());
    });

    socket.on("disconnect", () => {
      state.onlineMembers = Math.max(0, state.onlineMembers - 1);
      io.emit("stateUpdate", getState());
    });
  });
}
