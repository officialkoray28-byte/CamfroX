# CamfroX

CamfroX'in React tabanlı giriş ekranı ve Express/PostgreSQL API altyapısı.

## Çalıştırma

1. `server/.env.example` dosyasını `server/.env` olarak kopyalayın ve PostgreSQL bağlantısını, JWT anahtarını girin.
2. `server/sql/001_create_users.sql` dosyasını veritabanında çalıştırın.
3. Ayrı terminallerde aşağıdaki komutları çalıştırın:

```powershell
cd server; npm run dev
cd client; npm run dev
```

İstemci varsayılan olarak `http://localhost:3000/api` adresindeki API'yi kullanır. Gerekirse `client/.env` içinde `VITE_API_URL` ayarlanabilir.

## Render ile yayınlama

Projede iki Render servisini tanımlayan `render.yaml` bulunur: `camfrox-web` (arayüz) ve `camfrox-api` (API). Render panelinden **New > Blueprint** seçip GitHub deposunu bağlayın. API için Render ortam değişkenlerine Supabase PostgreSQL bağlantı adresini `DATABASE_URL` olarak ekleyin. Render'ın verdiği adresler domain olmadan kullanılabilir.

## Kontroller

```powershell
cd client; npm run build; npm run lint
cd server; npm run build; npm test
```
