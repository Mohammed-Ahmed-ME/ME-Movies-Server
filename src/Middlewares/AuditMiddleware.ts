// src/Middlewares/audit.middleware.ts
import { Request, Response, NextFunction } from 'express';
import mongoose                             from 'mongoose';
import {AuthenticatedRequest} from "../Types/auth.types";
import {AuditingModel} from "../Models";
import {extractRequestMeta} from "../Services/auth.service";

/* ─────────────────────────────────────────
   Sensitive keys — never stored in logs
   ───────────────────────────────────────── */
const SENSITIVE_KEYS = new Set([
    'password', 'confirmPassword', 'oldPassword', 'newPassword',
    'token', 'accessToken', 'otpCode', 'otp', 'refreshToken',
    'cardNumber', 'cvv', 'ssn', 'secret',
]);

const sanitize = (obj?: Record<string, unknown>): Record<string, unknown> => {
    if (!obj) return {};
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
            k,
            SENSITIVE_KEYS.has(k.toLowerCase()) ? '[REDACTED]' : v,
        ])
    );
};

/* ─────────────────────────────────────────
   Paths to skip — no need to audit these
   ───────────────────────────────────────── */
const SKIP_PATHS = new Set(['/health', '/favicon.ico', '/api/docs']);

const shouldSkip = (path: string): boolean =>
    SKIP_PATHS.has(path) ||
    path.startsWith('/public') ||
    path.startsWith('/static');

/* ─────────────────────────────────────────
   Middleware
   ───────────────────────────────────────── */
const AuditMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): void => {
    if (shouldSkip(req.path)) return next();
    const startedAt = Date.now();
    let responseBody: Record<string, unknown> | undefined;
    const originalJson = res.json.bind(res);

    res.json = (body: unknown): Response => {
        responseBody = typeof body === 'object' && body !== null
            ? (body as Record<string, unknown>)
            : { raw: body };
        return originalJson(body);
    };

    // Write the audit log after response is finished
    res.on('finish', () => {
        const duration = Date.now() - startedAt;
        const reqData = extractRequestMeta(req)

        // Fire-and-forget — never blocks the response
        if (mongoose.connection.readyState === 1) {
            AuditingModel.create({
                userId: req.user?.userId
                    ? new mongoose.Types.ObjectId(req.user.userId)
                    : undefined,
                action: `${req.method} ${req.path}`,
                request: {
                    ip:      reqData.ip,
                    agent:   reqData.browser,
                    os:      reqData.os,
                    device:  reqData.deviceName,
                    method:  req.method,
                    path:    req.originalUrl,
                    params:  req.params  ?? {},
                    query:   req.query   ?? {},
                    body:    sanitize(req.body),
                    // Headers: keep only safe, useful ones
                    headers: {
                        'content-type':  req.headers['content-type'],
                        'authorization': req.headers['authorization'] ? '[PRESENT]' : '[ABSENT]',
                        'x-forwarded-for': req.headers['x-forwarded-for'],
                    },
                },
                response: {
                    status:   res.statusCode,
                    message:  responseBody?.['message'] as string ?? '',
                    data:     responseBody?.['data'],
                    error:    responseBody?.['error']   as string ?? undefined,
                    duration,
                },
            }).catch((err) =>
                console.error('[AuditMiddleware] Failed to write audit log:', err)
            );
        } else {
            console.warn('[AuditMiddleware] Skipping audit log, DB not connected, state:', mongoose.connection.readyState);
        }
    });

    next();
};

export default AuditMiddleware;