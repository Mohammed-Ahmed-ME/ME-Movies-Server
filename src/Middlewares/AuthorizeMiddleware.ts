import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/Res";
import prisma from "../Models";

type TargetIdSource = "params" | "body" | "query";

interface AuthorizeOptions {
  allowedRoles?: string[];
  allowSelf?: boolean;
  targetIdKey?: string; // default: 'id'
  targetIdSource?: TargetIdSource; // default: 'params'
}

export const AuthorizeRoute = (options: AuthorizeOptions = {}) => {
  const {
    allowedRoles = [],
    allowSelf = false,
    targetIdKey = "id",
    targetIdSource = "params",
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return AppError(res, 401, "Unauthorized");

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return AppError(res, 404, "User not found");

      // ✅ Role-based access
      if (allowedRoles.includes(user.role as string)) {
        return next();
      }

      // ✅ Self access (optional)
      if (allowSelf) {
        const targetId = (req as any)[targetIdSource]?.[targetIdKey];

        if (!targetId) {
          return AppError(res, 400, "Target user id is required");
        }

        if (targetId === userId) {
          return next();
        }
      }

      return AppError(
        res,
        403,
        "You do not have permission to perform this action",
      );
    } catch (error) {
      next(error);
    }
  };
};

/*
router.put(
  '/medical-history/:id',
  authorize({
    allowSelf: true,
    allowedRoles: ['admin', 'doctor', 'receptionist'],
  }),
  updateMedicalHistory
);

authorize({
  allowSelf: true,
  targetIdSource: 'body',
  targetIdKey: 'UserId',
  allowedRoles: ['doctor'],
});
authorize({
  allowedRoles: ['admin'],
});
authorize({
  allowSelf: true,
});
 */
