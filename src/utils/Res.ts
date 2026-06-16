import { Response } from "express";
import prisma from "../Models";
const NODE_ENV = process.env.NODE_ENV || 'development';

export const AppError = (res:Response , code:number,message:string,data?:any ) => {
    res.status(code).json({
        statusCode: code,
        status: code >= 400 && code < 500 ? 'fail' : 'error',
        message,
        data: NODE_ENV==='development' ? data : undefined,
        timestamp: new Date().toISOString(),
    });
}


export const AppSuccess  = (res:Response, code: number,message?: string, data?: any ) =>  {
    res.status(code).json({
        statusCode: code,
        status: 'success',
        message,
        data,
        timestamp: new Date().toISOString(),
    });

}

export const CheckAllow = async (
    res: Response,
    requesterId: string,
    userId: string,
    allowed: string[]
) => {
    const requester = await prisma.user.findUnique({ where: { id: requesterId } });

    if (!requester) {
        AppError(res, 404, 'Requester not found');
        return false;
    }

    const requesterRole = requester.role;

    // Check if requester's role is in the allowed list
    if (allowed.includes(requesterRole as string)) {
        return true;
    }

    // If not in allowed list, reject even if same user
    AppError(res, 403, 'Forbidden: You do not have permission to perform this action');
    return false;
};