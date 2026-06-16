import { Request, Response } from "express";
import prisma from "../Models";
import bcrypt from "bcryptjs";
import { AppError, AppSuccess } from "../utils/Res";

/* ===============================
   UserModel Controllers
   =============================== */

export const Profile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return AppError(res, 404, "User not found");
    }

    return AppSuccess(res, 200, "Profile fetched successfully", { user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return AppError(res, 500, "Internal server error");
  }
};

export const UpdateProfile = async (req: Request, res: Response) => {
  const allowedFields = [
    "name",
    "phone",
    "dateOfBirth",
    "address",
    "emergencyContact",
    "bloodGroup",
    "maritalStatus",
    "lifestyle",
  ];
  try {
    const userId = (req as any).user.id;
    const updates = req.body;
    delete updates.password;
    delete updates.id;
    delete updates.createdAt;
    delete updates.updatedAt;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updates,
    });

    if (!updatedUser) {
      return AppError(res, 404, "User not found");
    }

    return AppSuccess(res, 200, "User updated successfully", {
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return AppError(res, 500, "Internal server error");
  }
};

export const UpdatePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { password, newPassword } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });
    if (!user) {
      return AppError(res, 404, "User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return AppError(res, 400, "Current password is incorrect");
    }
    await prisma.user.update({
        where: { id: userId },
        data: { password: await bcrypt.hash(newPassword, 12) }
    });
    return AppSuccess(res, 200, "Password updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    return AppError(res, 500, "Internal server error");
  }
};

