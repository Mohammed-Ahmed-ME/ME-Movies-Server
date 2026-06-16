import { Request, Response }  from 'express';
import bcrypt                  from 'bcryptjs';

import { AppError, AppSuccess }  from '../utils/Res';
import prisma from '../Models/index';
import { generateAccessToken }   from '../utils/token.utils';
import {
  createAndSendOtp,
  verifyOtpCode,
  sendLoginNotification,
  sendWelcomeEmail,
  extractRequestMeta,
} from '../Services/auth.service';
import {
  AuthenticatedRequest,
  OtpSessionRequest,
} from '../Types/auth.types';

/* ─────────────────────────────────────────
   Register
   ───────────────────────────────────────── */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, phone } = req.body;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });

    if (existing) {
      AppError(res, 409, 'An account with this email or phone already exists.');
      return;
    }

    const user = await prisma.user.create({ data: req.body });

    const otpSessionToken = await createAndSendOtp(user.email, user.id, 'verify');

    AppSuccess(
        res, 201,
        'Account created. Please check your email for the verification code.',
        { otpSessionToken },
    );
  } catch (err) {
    console.error('[register]', err);
    AppError(res, 500, 'Registration failed. Please try again.', err);
  }
};

/* ─────────────────────────────────────────
   Login
   ───────────────────────────────────────── */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      AppError(res, 400, 'Email and password are required.');
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Use a generic message to avoid user enumeration
    if (!user || !(await bcrypt.compare(password, user.password))) {
      AppError(res, 401, 'Invalid email or password.');
      return;
    }

    // Account not verified — restart OTP flow
    if (!user.isVerified) {
      const otpSessionToken = await createAndSendOtp(user.email, user.id, 'verify');
      AppSuccess(
          res, 200,
          'Account not verified. A new verification code has been sent to your email.',
          { otpSessionToken, isVerified: false },
      );
      return;
    }

    // Update last login
    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
    });

    const accessToken = await generateAccessToken(updatedUser.id, updatedUser.role);

    // Fire-and-forget login notification — doesn't block the response
    sendLoginNotification({
      email:     updatedUser.email,
      username:  updatedUser.name,
      loginTime: updatedUser.lastLogin!,
      ...extractRequestMeta(req),
    });

    AppSuccess(res, 200, 'Login successful.', {
      user:        updatedUser,
      accessToken,
      isVerified:  true,
    });
  } catch (err) {
    console.error('[login]', err);
    AppError(res, 500, 'Login failed. Please try again.', err);
  }
};

/* ─────────────────────────────────────────
   Verify Account
   ───────────────────────────────────────── */
export const verifyAccount = async (
    req: OtpSessionRequest,
    res: Response,
): Promise<void> => {
  try {
    const { userId }  = req.otpSession!;  // guaranteed by authenticateOtpSession
    const { otpCode } = req.body;

    if (!otpCode) {
      AppError(res, 400, 'OTP code is required.');
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      AppError(res, 404, 'User not found.');
      return;
    }

    if (user.isVerified) {
      AppError(res, 400, 'Account is already verified.');
      return;
    }

    // Throws descriptive error on invalid/expired/too-many-attempts
    await verifyOtpCode(userId, otpCode);

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { isVerified: true, lastLogin: new Date() }
    });

    const accessToken = await generateAccessToken(updatedUser.id, updatedUser.role);

    // Fire-and-forget welcome email
    sendWelcomeEmail(updatedUser.email, updatedUser.name);

    AppSuccess(res, 200, 'Account verified successfully.', {
      user:       updatedUser,
      accessToken,
      isVerified: true,
    });
  } catch (err: any) {
    // Service throws plain errors with user-friendly messages
    if (err instanceof Error && !err.message.includes('Internal')) {
      AppError(res, 400, err.message);
      return;
    }
    console.error('[verifyAccount]', err);
    AppError(res, 500, 'Verification failed. Please try again.', err);
  }
};

/* ─────────────────────────────────────────
   Resend OTP
   ───────────────────────────────────────── */

export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      AppError(res, 400, 'Email is required.');
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Generic message to avoid user enumeration
      AppSuccess(res, 200, 'If this email exists, a new OTP has been sent.');
      return;
    }

    if (user.isVerified) {
      AppError(res, 400, 'Account is already verified.');
      return;
    }

    const otpSessionToken = await createAndSendOtp(email, user.id, 'verify');

    AppSuccess(res, 200, 'A new verification code has been sent to your email.', {
      otpSessionToken,
      isVerified: false,
    });
  } catch (err) {
    console.error('[resendOtp]', err);
    AppError(res, 500, 'Failed to resend OTP. Please try again.', err);
  }
};

/* ─────────────────────────────────────────
   Forgot Password
   ───────────────────────────────────────── */

export const requestPasswordReset = async (
    req: Request,
    res: Response,
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      AppError(res, 400, 'Email is required.');
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Don't reveal whether this email is registered
      AppSuccess(res, 200, 'If this email exists, a reset code has been sent.');
      return;
    }

    const otpSessionToken = await createAndSendOtp(email, user.id, 'forgot');

    AppSuccess(res, 200, 'Password reset code sent to your email.', {
      otpSessionToken,
    });
  } catch (err) {
    console.error('[requestPasswordReset]', err);
    AppError(res, 500, 'Failed to initiate password reset. Please try again.', err);
  }
};

/* ─────────────────────────────────────────
   Reset Password
   ───────────────────────────────────────── */

export const resetPassword = async (
    req: OtpSessionRequest,
    res: Response,
): Promise<void> => {
  try {
    const { userId }         = req.otpSession!;
    const { otpCode, password } = req.body;

    if (!otpCode || !password) {
      AppError(res, 400, 'OTP code and new password are required.');
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      AppError(res, 404, 'User not found.');
      return;
    }

    // Throws on invalid OTP, expired, or too many attempts
    await verifyOtpCode(userId, otpCode);

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    });

    AppSuccess(res, 200, 'Password reset successfully. You can now log in.');
  } catch (err: any) {
    if (err instanceof Error && !err.message.includes('Internal')) {
      AppError(res, 400, err.message);
      return;
    }
    console.error('[resetPassword]', err);
    AppError(res, 500, 'Failed to reset password. Please try again.', err);
  }
};