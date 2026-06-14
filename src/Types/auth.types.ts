import { Request } from 'express';

/* ─────────────────────────────────────────
   JWT Payloads
   ───────────────────────────────────────── */

export interface AccessTokenPayload {
    userId: string;
    role:   string;
}


export interface OtpSessionPayload {
    userId: string;
}

/* ─────────────────────────────────────────
   Extended Express Requests
   ───────────────────────────────────────── */

export interface AuthenticatedRequest extends Request {
    user?: AccessTokenPayload;
}

export interface OtpSessionRequest extends Request {
    otpSession?: OtpSessionPayload;
}

/* ─────────────────────────────────────────
   Service layer types
   ───────────────────────────────────────── */

export type OtpPurpose = 'verify' | 'forgot';

export interface LoginNotificationPayload {
    email:      string;
    username:   string;
    deviceName: string;
    browser:    string;
    os:         string;
    ip:         string;
    loginTime:  Date;
}