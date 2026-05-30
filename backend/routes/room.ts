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

        // A. Kiểm tra xem phòng có tồn tại không
        const [roomRows]: any = await db.execute('SELECT current_count, capacity FROM rooms WHERE id = ?', [roomId]);

        if (roomRows.length === 0) {
            return res.status(404).json({ message: "Phòng không tồn tại" });
        }

        // ✅ BỎ check capacity - có thể join vô hạn
        // Chỉ camera bị giới hạn 25 người (check ở Frontend)

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

/**
 * 4. API RECORD PRAYER
 * Body: { roomId: string, userId: number }
 * Tăng prayers_in_room cho user và total_room_prayers cho phòng
 */
router.post('/prayer', async (req, res) => {
    const { roomId, userId } = req.body;

    if (!roomId || !userId) {
        return res.status(400).json({ message: "Thiếu roomId hoặc userId" });
    }

    try {
        await ensureRoomSchema();

        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Kiểm tra user có trong phòng không
            const [memberRows]: any = await connection.query(
                'SELECT prayers_in_room FROM room_members WHERE room_id = ? AND user_id = ?',
                [roomId, userId]
            );

            if (memberRows.length === 0) {
                await connection.rollback();
                return res.status(404).json({ message: "User chưa join phòng này" });
            }

            // Tăng prayers_in_room cho user
            await connection.query(
                'UPDATE room_members SET prayers_in_room = prayers_in_room + 1 WHERE room_id = ? AND user_id = ?',
                [roomId, userId]
            );

            // Tăng total_room_prayers cho phòng
            await connection.query(
                'UPDATE rooms SET total_room_prayers = total_room_prayers + 1 WHERE id = ?',
                [roomId]
            );

            // Lấy giá trị mới sau khi update
            const [updatedMember]: any = await connection.query(
                'SELECT prayers_in_room FROM room_members WHERE room_id = ? AND user_id = ?',
                [roomId, userId]
            );
            const [updatedRoom]: any = await connection.query(
                'SELECT total_room_prayers FROM rooms WHERE id = ?',
                [roomId]
            );

            await connection.commit();

            res.json({
                message: "Lưu lượt lạy thành công!",
                userPrayers: updatedMember[0]?.prayers_in_room || 0,
                roomTotal: updatedRoom[0]?.total_room_prayers || 0
            });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Record prayer failed:", error);
        res.status(500).json({ message: "Lỗi khi lưu lượt lạy" });
    }
});

/**
 * 5. API LẤY THỐNG KÊ PHÒNG
 * GET /api/rooms/:roomId/stats
 */
router.get('/:roomId/stats', async (req, res) => {
    const { roomId } = req.params;

    try {
        await ensureRoomSchema();

        const [roomRows]: any = await db.execute(
            'SELECT id, name, total_room_prayers, current_count FROM rooms WHERE id = ?',
            [roomId]
        );

        if (roomRows.length === 0) {
            return res.status(404).json({ message: "Phòng không tồn tại" });
        }

        const room = roomRows[0];

        // Lấy top 5 người lạy nhiều nhất
        const [topPrayers]: any = await db.execute(
            `SELECT u.id, u.name, rm.prayers_in_room
             FROM room_members rm
             JOIN users u ON rm.user_id = u.id
             WHERE rm.room_id = ?
             ORDER BY rm.prayers_in_room DESC
             LIMIT 5`,
            [roomId]
        );

        res.json({
            roomId: room.id,
            roomName: room.name,
            totalPrayers: room.total_room_prayers,
            memberCount: room.current_count,
            topPrayerUsers: topPrayers
        });
    } catch (error) {
        console.error("Get room stats failed:", error);
        res.status(500).json({ message: "Lỗi khi lấy thống kê phòng" });
    }
});

/**
 * 6. API LẤY SỐ LƯỢT LẠY CỦA USER TRONG PHÒNG
 * GET /api/rooms/:roomId/user/:userId/prayers
 */
router.get('/:roomId/user/:userId/prayers', async (req, res) => {
    const { roomId, userId } = req.params;

    try {
        await ensureRoomSchema();

        const [memberRows]: any = await db.execute(
            'SELECT prayers_in_room FROM room_members WHERE room_id = ? AND user_id = ?',
            [roomId, parseInt(userId)]
        );

        if (memberRows.length === 0) {
            return res.status(404).json({ message: "User chưa join phòng này" });
        }

        res.json({
            userId: parseInt(userId),
            roomId,
            prayerCount: memberRows[0].prayers_in_room
        });
    } catch (error) {
        console.error("Get user prayers failed:", error);
        res.status(500).json({ message: "Lỗi khi lấy thống kê người dùng" });
    }
});

export default router;
