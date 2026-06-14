import express, { Request, Response } from "express";
import {
  Profile,
  UpdatePassword,
  UpdateProfile,
} from "../Controllers/Users.controller";
import { authenticateUser  } from "../Middlewares/AuthMiddleware";

const UserRoutes = express.Router();

// Get current user profile
UserRoutes.get("/Profile", authenticateUser , Profile);

UserRoutes.put("/Update-Profile", authenticateUser , UpdateProfile);
UserRoutes.patch("/Update-Password", authenticateUser , UpdatePassword);

UserRoutes.post("/Logout", authenticateUser , async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default UserRoutes;
