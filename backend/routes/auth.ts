import express from 'express';
import { db } from '../db/db';
import bcrypt from 'bcryptjs';
const router = express.Router();

router.get('/test_check', (req, res) => res.send("Auth is ALIVE!"));

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows]: any = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Email không tồn tại trong hệ thống' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Mật khẩu không chính xác' });
    }

    res.json({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      role: user.role
    });

  } catch (error) {
    console.error("Lỗi Backend Login:", error);
    res.status(500).json({ message: 'Lỗi server hệ thống' });
  }
});

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
  }

  try {
    const [existingUser]: any = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email này đã được đăng ký' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 'user'] // Mặc định là 'user'
    );

    res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });

  } catch (error) {
    console.error("Lỗi Đăng ký:", error);
    res.status(500).json({ message: 'Lỗi server hệ thống' });
  }
});

export default router;