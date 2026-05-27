import express from 'express';
import { db } from '../db/db';

const router = express.Router();
let schemaReady = false;

// Hàm hỗ trợ tạo ID phòng ngẫu nhiên (Ví dụ: ge93jgaew)
const generateRoomId = () => Math.random().toString(36).substring(2, 10);

async function ensureRoomSchema() {
  if (schemaReady) return;

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

  schemaReady = true;
}

/**
 * 1. API ADMIN TẠO PHÒNG
 * Body: { name: string, type: 'buddha' | 'jesus', adminId: number }
 */
router.post('/create', async (req, res) => {
  const { name, type, adminId } = req.body;
  const roomId = generateRoomId();

  try {
    await ensureRoomSchema();

    if (!name || !['buddha', 'jesus'].includes(type)) {
      return res.status(400).json({ message: "Thong tin phong khong hop le" });
    }

    await db.execute(
      'INSERT INTO rooms (id, name, type, created_by) VALUES (?, ?, ?, ?)',
      [roomId, name, type, adminId ?? null]
    );
    res.status(201).json({ 
        message: "Tạo phòng thành công!", 
        roomId, 
        name, 
        type 
    });
  } catch (error) {
    console.error("Create room failed:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi tạo phòng" });
  }
});

/**
 * 2. API LẤY DANH SÁCH TẤT CẢ PHÒNG (Để user chọn join)
 */
router.get('/all', async (req, res) => {
  try {
    await ensureRoomSchema();
    const [rows]: any = await db.execute('SELECT * FROM rooms');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách phòng" });
  }
});

router.get('/type/:type', async (req, res) => {
  const { type } = req.params;

  try {
    await ensureRoomSchema();

    if (!['buddha', 'jesus'].includes(type)) {
      return res.status(400).json({ message: "Loai phong khong hop le" });
    }

    const [rows]: any = await db.execute(
      'SELECT * FROM rooms WHERE type = ? ORDER BY created_at ASC LIMIT 1',
      [type]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Chua co phong nao" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Fetch room by type failed:", error);
    res.status(500).json({ message: "Loi khi lay phong" });
  }
});

router.get('/:roomId', async (req, res) => {
  const { roomId } = req.params;

  try {
    await ensureRoomSchema();
    const [rows]: any = await db.execute('SELECT * FROM rooms WHERE id = ?', [roomId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Phong khong ton tai" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Fetch room failed:", error);
    res.status(500).json({ message: "Loi khi lay phong" });
  }
});

/**
 * 3. API USER THAM GIA PHÒNG
 * Body: { roomId: string, userId: number }
 */
router.post('/join', async (req, res) => {
    const { roomId, userId } = req.body;

    try {
        await ensureRoomSchema();

        // A. Kiểm tra xem phòng có tồn tại và còn chỗ không (Capacity: 25)
        const [roomRows]: any = await db.execute('SELECT current_count, capacity FROM rooms WHERE id = ?', [roomId]);
        
        if (roomRows.length === 0) {
            return res.status(404).json({ message: "Phòng không tồn tại" });
        }

        const room = roomRows[0];

        if (room.current_count >= room.capacity) {
            return res.status(400).json({ message: "Phòng đã đầy (tối đa 25 người)" });
        }

        // B. Kiểm tra xem user đã join phòng này chưa (tránh trùng lặp)
        const [memberRows]: any = await db.execute('SELECT id FROM room_members WHERE room_id = ? AND user_id = ?', [roomId, userId]);
        
        if (memberRows.length > 0) {
            return res.status(200).json({ message: "Bạn đã ở trong phòng này rồi" });
        }

        // C. Thực hiện Join (Dùng Transaction để đảm bảo tính nhất quán dữ liệu)
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Thêm user vào bảng thành viên phòng
            await connection.query('INSERT INTO room_members (room_id, user_id) VALUES (?, ?)', [roomId, userId]);
            
            // 2. Tăng số lượng người hiện tại trong phòng
            await connection.query('UPDATE rooms SET current_count = current_count + 1 WHERE id = ?', [roomId]);

            await connection.commit();
            res.json({ message: "Tham gia phòng thành công!", roomId });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi tham gia phòng" });
    }
});

export default router;
