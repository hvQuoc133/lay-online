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

// ROUTE LOGIN WITH GOOGLE
router.post('/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    const googleRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    const googleUser: any = await googleRes.json();

    const { sub: googleId, email, name, picture } = googleUser;

    const [rows]: any = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    let user = rows[0];

    if (!user) {
      const [result]: any = await db.execute(
        'INSERT INTO users (username, email, google_id, avatar, password) VALUES (?, ?, ?, ?, ?)',
        [name, email, googleId, picture, 'GOOGLE_AUTH']
      );
      
      const [newUser]: any = await db.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
      user = newUser[0];
    } else if (!user.google_id) {
      await db.execute('UPDATE users SET google_id = ?, avatar = ? WHERE id = ?', [googleId, picture, user.id]);
      user.avatar = picture;
    }

    res.json({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      role: user.role
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi xác thực Google' });
  }
});

export default router;