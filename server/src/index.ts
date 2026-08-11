import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { config } from './config';
import { authRouter } from './routes/auth';

const app = express();
app.use(cors({ origin: config.clientOrigin }));
app.use(express.json({ limit: '10kb' }));
app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use((_request, response) => response.status(404).json({ message: 'Endpoint bulunamadı.' }));
app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  console.error(error);
  response.status(500).json({ message: 'Beklenmeyen bir sunucu hatası oluştu.' });
});

app.listen(config.port, () => console.log(`CamfroX API is listening on http://localhost:${config.port}`));
