import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { pool } from '../db/pool';

const authRouter = Router();

type RegistrationRequest = {
  nickname?: unknown;
  password?: unknown;
  gender?: unknown;
  birthDate?: unknown;
  email?: unknown;
  location?: unknown;
  emailOffers?: unknown;
  newsOffers?: unknown;
};

const isText = (value: unknown, maxLength: number): value is string =>
  typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength;

authRouter.post('/register', async (request, response, next) => {
  try {
    const { nickname, password, gender, birthDate, email, location, emailOffers, newsOffers } = request.body as RegistrationRequest;

    if (!isText(nickname, 32) || !isText(password, 72) || password.length < 6 || !isText(gender, 32) || !isText(birthDate, 10) || !isText(email, 254) || !isText(location, 120)) {
      return response.status(400).json({ message: 'Lütfen tüm zorunlu alanları geçerli biçimde doldurun.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return response.status(400).json({ message: 'Geçerli bir e-posta adresi girin.' });
    }
    if (Number.isNaN(Date.parse(`${birthDate}T00:00:00Z`))) {
      return response.status(400).json({ message: 'Geçerli bir doğum tarihi seçin.' });
    }
    if (!config.jwtSecret || !config.databaseUrl) {
      return response.status(503).json({ message: 'Sunucu kayıt için yapılandırılmamış.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query<{ id: string; nickname: string }>(
      `INSERT INTO users (nickname, password_hash, gender, birth_date, email, location, email_offers, news_offers)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, nickname`,
      [nickname.trim(), passwordHash, gender.trim(), birthDate, email.trim().toLowerCase(), location.trim(), emailOffers === true, newsOffers === true],
    );
    const user = result.rows[0];
    if (!user) return response.status(500).json({ message: 'Kullanıcı oluşturulamadı.' });

    const token = jwt.sign({ sub: user.id, nickname: user.nickname }, config.jwtSecret, { expiresIn: '8h' });
    return response.status(201).json({ token, user: { id: user.id, nickname: user.nickname } });
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
      return response.status(409).json({ message: 'Bu kullanıcı adı veya e-posta adresi zaten kullanılıyor.' });
    }
    return next(error);
  }
});

authRouter.post('/login', async (request, response, next) => {
  try {
    const { nickname, password } = request.body as { nickname?: unknown; password?: unknown };

    if (typeof nickname !== 'string' || typeof password !== 'string' || !nickname.trim() || !password) {
      return response.status(400).json({ message: 'Takma ad ve şifre zorunludur.' });
    }

    if (!config.jwtSecret) {
      return response.status(503).json({ message: 'Sunucu kimlik doğrulama için yapılandırılmamış.' });
    }
    if (!config.databaseUrl) {
      return response.status(503).json({ message: 'Sunucu veritabanı için yapılandırılmamış.' });
    }

    const result = await pool.query<{ id: string; nickname: string; password_hash: string }>(
      'SELECT id, nickname, password_hash FROM users WHERE LOWER(nickname) = LOWER($1) LIMIT 1',
      [nickname.trim()],
    );
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return response.status(401).json({ message: 'Takma ad veya şifre hatalı.' });
    }

    const token = jwt.sign({ sub: user.id, nickname: user.nickname }, config.jwtSecret, { expiresIn: '8h' });
    return response.json({ token, user: { id: user.id, nickname: user.nickname } });
  } catch (error) {
    return next(error);
  }
});

export { authRouter };
