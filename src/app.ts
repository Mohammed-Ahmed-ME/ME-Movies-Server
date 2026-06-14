import 'dotenv/config';
import cookieParser  from 'cookie-parser';
import cors          from 'cors';
import express, { Request, Response } from 'express';
import rateLimit     from 'express-rate-limit';
import favicon       from 'serve-favicon';
import helmet        from 'helmet';
import mongoose      from 'mongoose';
import morgan        from 'morgan';
import path          from 'node:path';

import { APITemplate, HealthTemplate, NotFoundTemplate } from './HTML/index';
import { AuthRoutes, UserRoutes }                        from './routes/index';
import MovieRoutes                                       from './routes/MovieRoutes';
import ErrorHandler                                      from './Middlewares/error';
import { RouteItem }                                     from './HTML/API';
import AuditMiddleware from "./Middlewares/AuditMiddleware";

const app = express();

/* ─────────────────────────────────────────
   Environment
   ───────────────────────────────────────── */
const NODE_ENV = process.env.NODE_ENV ?? 'development';
const isProd   = NODE_ENV === 'production';

/* ─────────────────────────────────────────
   CORS
   ───────────────────────────────────────── */

// Read allowed origins from env — no more hardcoded localhost
const ALLOWED_ORIGINS: string[] = [
  process.env.CLIENT_URL,
  process.env.LOCAL_URL,
].filter(Boolean) as string[];

if (ALLOWED_ORIGINS.length === 0) {
  throw new Error(
      '❌ CORS not configured. Set CLIENT_URL or LOCAL_URL in your .env file.'
  );
}

const CorsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: origin "${origin}" is not allowed.`));
    }
  },
  credentials:          true,
  optionsSuccessStatus: 200,
  methods:              ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders:       ['Content-Type', 'Authorization'],
};

/* ─────────────────────────────────────────
   Rate Limiters
   ───────────────────────────────────────── */

// General API traffic
const GlobalLimiter = rateLimit({
  windowMs:       15 * 60 * 1000,   // 15 minutes
  max:            500,
  standardHeaders: true,
  legacyHeaders:  false,
  message: { error: 'Too many requests. Please try again later.' },
});

// Auth endpoints — strict to prevent brute force / OTP abuse
const AuthLimiter = rateLimit({
  windowMs:       15 * 60 * 1000,   // 15 minutes
  max:            20,                // ← was 1000 (useless), now actually strict
  standardHeaders: true,
  legacyHeaders:  false,
  skipSuccessfulRequests: true,      // only count failed attempts
  message: { error: 'Too many authentication attempts. Please try again in 15 minutes.' },
});

/* ─────────────────────────────────────────
   Core Middleware
   ───────────────────────────────────────── */
app.use(cors(CorsOptions));
app.use(cookieParser());

// Trust proxy only in production to get real client IP behind load balancer
if (isProd) app.set('trust proxy', 1);

app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc:   ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          scriptSrc:  ["'self'"],
          imgSrc:     ["'self'", 'data:', 'https:'],
          fontSrc:    ["'self'", 'https://fonts.gstatic.com'],
        },
      },
      hsts: {
        maxAge:            31536000,
        includeSubDomains: true,
        preload:           true,
      },
      crossOriginEmbedderPolicy:  false,
      crossOriginResourcePolicy:  { policy: 'cross-origin' },
      crossOriginOpenerPolicy:    { policy: 'unsafe-none' },
    }),
);

app.use(GlobalLimiter);

/* ─────────────────────────────────────────
   Body Parsing
   ───────────────────────────────────────── */
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(AuditMiddleware)
app.use(express.static(path.join(__dirname, '../public')));

/* ─────────────────────────────────────────
   Logging
   ───────────────────────────────────────── */
app.use(
    morgan(
        isProd
            ? ':method :url :status :res[content-length] - :response-time ms'
            : 'dev'
    )
);

/* ─────────────────────────────────────────
   Favicon
   ───────────────────────────────────────── */
app.use(favicon(path.join(__dirname, '../public/favicon.ico')));

/* ─────────────────────────────────────────
   Info & Health Endpoints
   ───────────────────────────────────────── */
app.get('/health', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(HealthTemplate({
    timestamp:   new Date().toISOString(),
    uptime:      process.uptime(),
    environment: NODE_ENV,
    version:     process.env.npm_package_version ?? '1.0.0',
  }));
});

app.get(['/api', '/'], (_req: Request, res: Response) => {
  const routes: RouteItem[] = [
    { icon: '🩺', method: 'GET',  path: '/health',            description: 'System health & DB status' },
    { icon: '🔐', method: 'POST', path: '/api/auth/login',     description: 'Authenticate user' },
    { icon: '📝', method: 'POST', path: '/api/auth/register',  description: 'Create new account' },
    { icon: '🎬', method: 'GET',  path: '/api/movies',         description: 'Browse movies' },
    { icon: '👤', method: 'GET',  path: '/api/auth/user',      description: 'User profile & settings' },
    { icon: '📘', method: 'GET',  path: '/api/docs',           description: 'API documentation' },
  ];

  res.setHeader('Content-Type', 'text/html');
  res.send(APITemplate({
    message:     `${process.env.APP_NAME} API is running`,
    version:     process.env.npm_package_version ?? '1.0.0',
    environment: NODE_ENV,
    routes,
    docsLink:    '/api/docs',
  }));
});

/* ─────────────────────────────────────────
   API Routes
   ───────────────────────────────────────── */
app.use('/api/auth',       AuthLimiter, AuthRoutes);
app.use('/api/auth/user',               UserRoutes);
app.use('/api/movies',                  MovieRoutes);

/* ─────────────────────────────────────────
   404 Handler — after all routes
   ───────────────────────────────────────── */
app.use((req: Request, res: Response) => {
  res.status(404).setHeader('Content-Type', 'text/html');
  res.send(NotFoundTemplate({
    path:      req.originalUrl,
    method:    req.method,
    status:    404,
    timestamp: new Date().toISOString(),
  }));
});

/* ─────────────────────────────────────────
   Global Error Handler — ONE handler only
   Remove the duplicate inline handler that was here before.
   ErrorHandler middleware in Middlewares/error.ts handles everything.
   ───────────────────────────────────────── */
app.use(ErrorHandler);
/* ─────────────────────────────────────────
   Graceful Shutdown
   ───────────────────────────────────────── */
const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\n[${signal}] Shutting down gracefully...`);
  try {
    await mongoose.connection.close();
    console.log('✅ Database connection closed.');
  } catch (err) {
    console.error('❌ Error closing database connection:', err);
  }
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));

export default app;