import { NextFunction, Request, Response } from "express";
import { z } from "zod";
/* ===============================
   Helper Functions
   =============================== */

const MaxAge = new Date();
MaxAge.setFullYear(MaxAge.getFullYear() - 50);

/* ===============================
   ZOD Objects
   =============================== */

// Login Object Validator

const LoginObject = z.object({
  email: z.string("Must Be String").email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password cannot exceed 32 characters"),
});

// Register Object Validator

const RegisterObject = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(32)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  phone: z.string(),
  age: z.number().min(18).max(100).optional(),
  dateOfBirth: z.coerce
    .date()
    .min(MaxAge, "Date of birth cannot be more than 50 years ago")
    .max(new Date(), "Date of birth cannot be in the future")
    .optional(),
  maritalStatus: z
    .enum(["Single", "Married", "Divorced", "Unknown"])
    .optional(),
});

/* ===============================
   ZOD Validators
   =============================== */

export const LoginValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = LoginObject.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((err) => err.message);
    return res
      .status(400)
      .json({ status: "fail", message: "Validation Error", data: errors });
  }
  next();
};

export const RegisterValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = RegisterObject.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((err) => err.message);
    return res
      .status(400)
      .json({ status: "fail", message: "Validation Error", data: errors });
  }

  next();
};
