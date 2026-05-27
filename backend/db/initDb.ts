import { db } from './db';

export async function initDatabase() {
  // 1. Bảng Users (Đã có)
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      google_id VARCHAR(255) UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('user', 'admin') DEFAULT 'user',
      avatar VARCHAR(255) DEFAULT '/images/logo.png',
      total_prayers INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  // 2. Bảng Rooms (Mới)
  const createRoomsTable = `
    CREATE TABLE IF NOT EXISTS rooms (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      type ENUM('buddha', 'jesus') NOT NULL,
      capacity INT DEFAULT 25,
      current_count INT DEFAULT 0,
      total_room_prayers INT DEFAULT 0,
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  // 3. Bảng Room Members (Mới - Để quản lý user join nhiều phòng)
  const createRoomMembersTable = `
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
  `;

  try {
    const connection = await db.getConnection();
    console.log("--- Khởi tạo hệ thống Database ---");
    await connection.query(createUsersTable);
    await connection.query(createRoomsTable);
    await connection.query(createRoomMembersTable);
    console.log("✅ Hệ thống Database (Users, Rooms, Members) đã sẵn sàng!");
    connection.release();
  } catch (error) {
    console.error("❌ Lỗi khởi tạo DB:", error);
  }
}