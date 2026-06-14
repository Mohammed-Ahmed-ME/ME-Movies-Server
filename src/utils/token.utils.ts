import { EncryptJWT, jwtDecrypt } from 'jose';
import { AccessTokenPayload, OtpSessionPayload } from '../Types/auth.types';

/* ─────────────────────────────────────────
   Secret Key Bootstrap
   ───────────────────────────────────────── */

const loadSecret = (envKey: string): Uint8Array => {
    const raw = process.env[envKey];
    if (!raw) throw new Error(`Missing env variable: ${envKey}`);

    const encoded = new TextEncoder().encode(raw);
    if (encoded.length !== 32) {
        throw new Error(
            `${envKey} must encode to exactly 32 bytes for A256GCM. ` +
            `Got ${encoded.length} bytes. Use a 32-character ASCII string.`
        );
    }
    return encoded;
};

// Loaded once at startup — throws immediately if misconfigured
const ACCESS_SECRET: Uint8Array = loadSecret('JWT_SECRET');
const OTP_SECRET:    Uint8Array = loadSecret('JWT_OTP_SECRET');

const JWE_HEADER = { alg: 'dir', enc: 'A256GCM' } as const;

/* ─────────────────────────────────────────
   Access Token  (7 days)
   ───────────────────────────────────────── */
export const generateAccessToken = async (
    userId: string,
    role: string,
): Promise<string> => {
    const payload: AccessTokenPayload = { userId, role };
    return new EncryptJWT(payload as any)
        .setProtectedHeader(JWE_HEADER)
        .setIssuedAt()
        .setExpirationTime('7d')
        .encrypt(ACCESS_SECRET);
};

export const decryptAccessToken = async (token: string): Promise<AccessTokenPayload> => {
    const { payload } = await jwtDecrypt(token, ACCESS_SECRET);
    return payload as unknown as AccessTokenPayload;
};

/* ─────────────────────────────────────────
   OTP Session Token  (5 minutes)
   ───────────────────────────────────────── */

export const generateOtpSessionToken = async (userId: string): Promise<string> => {
    const payload: OtpSessionPayload = { userId };
    return new EncryptJWT(payload as any)
        .setProtectedHeader(JWE_HEADER)
        .setIssuedAt()
        .setExpirationTime('5m')
        .encrypt(OTP_SECRET);
};

export const decryptOtpSessionToken = async (token: string): Promise<OtpSessionPayload> => {
    const { payload } = await jwtDecrypt(token, OTP_SECRET);
    return payload as unknown as OtpSessionPayload;
};