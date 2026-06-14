import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/Res";

const handleCastErrorDB = (res: Response, error: any) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  AppError(res, 400, message);
};

const handleDuplicateFieldsDB = (res: Response, error: any) => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];
  const message = `Duplicate field value: ${field} = "${value}". Please use another value!`;
  AppError(res, 400, message);
};

const handleValidationErrorDB = (res: Response, error: any) => {
  const errors = Object.values(error.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  AppError(res, 400, message);
};

const handleJWTError = (res: Response) =>
  AppError(res, 401, "Invalid token. Please log in again!");

const handleJWTExpiredError = (res: Response) =>
  AppError(res, 401, "Your token has expired! Please log in again.");

const sendErrorDev = (res: Response, error: any) => {
  res.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProd = (res: Response, error: any) => {
  // Operational, trusted error: send a message to a client
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.error("ERROR 💥", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

export const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "CastError") error = handleCastErrorDB(res, error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(res, error);
    if (err.name === "ValidationError")
      error = handleValidationErrorDB(res, error);
    if (err.name === "JsonWebTokenError") error = handleJWTError(res);
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError(res);

    sendErrorProd(error, res);
  }
};
export default ErrorHandler;
