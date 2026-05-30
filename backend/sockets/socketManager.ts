import { Server, Socket } from "socket.io";
import { state, getState } from "../db/data";
import { db } from "../db/db";

async function ensurePrayerTables() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS rooms (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      type ENUM('buddha', 'jesus') NOT NULL,
      capacity INT DEFAULT 25,
      current_count INT DEFAULT 0,
      total_room_prayers INT DEFAULT 0,
      created_by INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS room_members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      room_id VARCHAR(50),
      user_id INT,
      prayers_in_room INT DEFAULT 0,
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user_room (room_id, user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

export function setupSockets(io: Server) {
  io.on("connection", (socket: Socket) => {
    state.onlineMembers++;
    io.emit("stateUpdate", getState());

    socket.on("pray", () => {
      state.totalPrayers++;
      state.prayersToday++;
      io.emit("stateUpdate", getState());
    });

    socket.on("join_prayer_room", (roomId: string) => {
      if (roomId) {
        socket.join(roomId);
      }
    });

    socket.on("user_prayed", async ({ roomId, userId, roomType }: { roomId?: string; userId?: number; roomType?: "buddha" | "jesus" }) => {
      state.totalPrayers++;
      state.prayersToday++;

      try {
        if (roomId && userId) {
          await ensurePrayerTables();

          // ✅ Lấy data từ DB (REST API đã update rồi)
          const [memberRows]: any = await db.execute(
            "SELECT prayers_in_room FROM room_members WHERE room_id = ? AND user_id = ?",
            [roomId, userId]
          );
          const [roomRows]: any = await db.execute(
            "SELECT total_room_prayers FROM rooms WHERE id = ?",
            [roomId]
          );

          const userTotal = memberRows[0]?.prayers_in_room;
          const roomTotal = roomRows[0]?.total_room_prayers;

          // ⭐ Broadcast tới room (không update DB, chỉ thông báo)
          io.to(roomId).emit("update_stats", {
            roomId,
            userId,
            total: userTotal,
            roomTotal: roomTotal
          });
        }
      } catch (error) {
        console.error("Socket user_prayed failed:", error);
      }

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
