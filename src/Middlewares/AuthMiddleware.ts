import { Response, NextFunction } from 'express';
import { decryptAccessToken, decryptOtpSessionToken } from '../utils/token.utils';
import { AuthenticatedRequest, OtpSessionRequest }    from '../Types/auth.types';

/* ─────────────────────────────────────────
   Access Token Middleware
   ───────────────────────────────────────── */
export const authenticateUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Access token is required.' });
        return;
    }

    try {
        req.user = await decryptAccessToken(token);
        next();
    } catch (err: any) {
        if (err.code === 'ERR_JWE_INVALID') {
            res.status(403).json({ error: 'Token is invalid or has been tampered with.' });
            return;
        }
        if (err.code === 'ERR_JWT_EXPIRED') {
            res.status(403).json({ error: 'Session has expired. Please log in again.' });
            return;
        }
        res.status(403).json({ error: 'Token verification failed.' });
    }
};

/* ─────────────────────────────────────────
   OTP Session Token Middleware
   ───────────────────────────────────────── */

export const authenticateOtpSession = async (
    req: OtpSessionRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'OTP session token is required.' });
        return;
    }

    try {
        req.otpSession = await decryptOtpSessionToken(token);
        next();
    } catch (err: any) {
        if (err.code === 'ERR_JWE_INVALID') {
            res.status(403).json({ error: 'OTP session is invalid.' });
            return;
        }
        if (err.code === 'ERR_JWT_EXPIRED') {
            res.status(403).json({
                error: 'OTP session has expired. Please request a new OTP.',
            });
            return;
        }
        res.status(403).json({ error: 'OTP session verification failed.' });
    }
};

/* ─────────────────────────────────────────
   Role Guard
   ───────────────────────────────────────── */

export const requireRole = (...allowedRoles: string[]) =>
    (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                error: `Access denied. Required role: ${allowedRoles.join(' or ')}.`,
            });
            return;
        }
        next();
    };