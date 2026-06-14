import express, { RequestHandler } from 'express';
import {
  login,
  register,
  resendOtp,
  verifyAccount,
  requestPasswordReset,
  resetPassword,
} from '../Controllers/Auth.controller';
import {
  authenticateOtpSession,
} from '../Middlewares/AuthMiddleware';
import {
  LoginValidator,
  RegisterValidator,
} from '../validators/Auth-Validator';

const AuthRoutes = express.Router();

// ── Public routes ─────────────────────────────────────────────
AuthRoutes.post('/login',           LoginValidator,    login);
AuthRoutes.post('/register',        RegisterValidator, register);
AuthRoutes.post('/resend-otp',                         resendOtp);
AuthRoutes.post('/forgot-password',                    requestPasswordReset);

// ── OTP-session protected routes ──────────────────────────────
// authenticateOtpSession decrypts the session token → attaches req.otpSession
AuthRoutes.post(
    '/verify-account',
    authenticateOtpSession,
    verifyAccount as RequestHandler,   // OtpSessionRequest extends Request — safe cast
);

AuthRoutes.post(
    '/reset-password',
    authenticateOtpSession,
    resetPassword as RequestHandler,
);

export default AuthRoutes;