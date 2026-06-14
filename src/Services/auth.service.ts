import bcrypt       from 'bcryptjs';
import crypto        from 'crypto';
import { Request }   from 'express';
import { UAParser } from 'ua-parser-js'
import { MailSender }                      from '../config/Mail/MailConfig.ts';
import { GetAgent, GetIP, GetOS }          from '../config/AuthProvider.ts';
import { OTPModel }                        from '../Models';
import { generateOtpSessionToken }         from '../utils/token.utils';
import { OtpPurpose, LoginNotificationPayload } from '../Types/auth.types.ts';
import {
    ForgetTemplate,
    LoginTemplate,
    OTPTemplate,
    WelcomeTemplate,
} from '../HTML';

/* ─────────────────────────────────────────
   Constants
   ───────────────────────────────────────── */

const MAX_OTP_ATTEMPTS = 5;
const OTP_LENGTH       = 6;

/* ─────────────────────────────────────────
   OTP Service
   ───────────────────────────────────────── */

export const createAndSendOtp = async (
    email:   string,
    userId:  string,
    purpose: OtpPurpose,
): Promise<string> => {
    // Generate cryptographically random 6-digit OTP
    const otpCode = crypto
        .randomInt(0, 10 ** OTP_LENGTH)
        .toString()
        .padStart(OTP_LENGTH, '0');

    // Ensure only one active OTP per user
    await OTPModel.deleteOne({ userId });
    await new OTPModel({ userId, otpCode, attempts: 0 }).save();

    const emailHtml =
        purpose === 'forgot'
            ? ForgetTemplate({ otp: otpCode })
            : OTPTemplate({ otp: otpCode });

    const emailSubject =
        purpose === 'forgot'
            ? `Reset Your ${process.env.APP_NAME} Password`
            : `Verify Your ${process.env.APP_NAME} Account`;

    await MailSender({ email, subject: emailSubject, html: emailHtml });

    // Session token carries only userId — OTP stays server-side
    return generateOtpSessionToken(userId);
};


export const verifyOtpCode = async (
    userId:  string,
    otpCode: string,
): Promise<void> => {
    const record = await OTPModel.findOne({ userId });

    if (!record) {
        throw new Error('OTP has expired or is invalid. Please request a new one.');
    }

    if (record.attempts >= MAX_OTP_ATTEMPTS) {
        await OTPModel.deleteOne({ userId });
        throw new Error(
            `Too many incorrect attempts. Your OTP has been invalidated. Please request a new one.`
        );
    }

    const isMatch = await bcrypt.compare(otpCode.toString(), record.otpCode);

    if (!isMatch) {
        record.attempts += 1;
        await record.save();

        const remaining = MAX_OTP_ATTEMPTS - record.attempts;
        throw new Error(
            remaining > 0
                ? `Invalid OTP. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`
                : `Invalid OTP. No attempts remaining. Please request a new one.`
        );
    }

    // Success — remove record so it can't be reused
    await OTPModel.deleteOne({ userId });
};

/* ─────────────────────────────────────────
   Email Notification Helpers
   ───────────────────────────────────────── */
export const sendLoginNotification = (
    payload: LoginNotificationPayload,
): void => {
    MailSender({
        email:   payload.email,
        subject: `New Login Detected – ${process.env.APP_NAME}`,
        html: LoginTemplate({
            username:   payload.username,
            deviceName: payload.deviceName,
            browser:    payload.browser,
            os:         payload.os,
            ip:         payload.ip,
            loginTime:  payload.loginTime,
        }),

    }).then((res)=> console.log('[sendLoginNotification] Email sent'))
        .catch((err) =>
        console.error('[sendLoginNotification] Failed to send email:', err)
    );
};

export const sendWelcomeEmail = (email: string, username: string): void => {
    MailSender({
        email,
        subject: `Welcome to ${process.env.APP_NAME}!`,
        html: WelcomeTemplate({ username }),
    }).catch((err) =>
        console.error('[sendWelcomeEmail] Failed to send email:', err)
    );
};


export const extractRequestMeta = (req: Request): Omit<LoginNotificationPayload, 'email' | 'username' | 'loginTime'> => ({
    deviceName: GetOS(req.headers['user-agent'] ?? ''),
    browser:    GetAgent(req.headers['user-agent'] ?? ''),
    os:         GetOS(req.headers['user-agent'] ?? ''),
    ip:         GetIP(req),
});

export const extractRequestMeta2 = (req: Request) => {
    const parser = new UAParser(req.headers['user-agent'] ?? '')
    const result = parser.getResult()

    return {
        deviceName: result.device.vendor
            ? `${result.device.vendor} ${result.device.model}`
            : 'Unknown Device',
        browser: result.browser.name ?? 'Unknown Browser',
        os:      result.os.name
            ? `${result.os.name} ${result.os.version ?? ''}`.trim()
            : 'Unknown OS',
        ip: GetIP(req),
    }
}