CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname VARCHAR(32) NOT NULL,
  password_hash TEXT NOT NULL,
  gender VARCHAR(32) NOT NULL,
  birth_date DATE NOT NULL,
  email VARCHAR(254) NOT NULL,
  location VARCHAR(120) NOT NULL,
  email_offers BOOLEAN NOT NULL DEFAULT TRUE,
  news_offers BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_nickname_unique ON users (LOWER(nickname));
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (LOWER(email));
