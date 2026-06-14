import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../utils/Res";

const MaxAge = new Date();
MaxAge.setFullYear(MaxAge.getFullYear() - 50);

const UserUpdateSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  phone: z.string().optional(),
  dateOfBirth: z.coerce
    .date()
    .min(MaxAge, "Date of birth cannot be more than 50 years ago")
    .max(new Date(), "Date of birth cannot be in the future")
    .optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  maritalStatus: z
    .enum(["Single", "Married", "Divorced", "Unknown"])
    .optional(),
});

export const UserUpdateValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = UserUpdateSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((err) => err.message);
    return AppError(res, 400, "Validation Error", errors.join(", "));
  }

  next();
};
