import bcrypt from "bcryptjs";
import mongoose, { Document } from 'mongoose';
export interface IOTPDocument extends Document {
    userId:   mongoose.Schema.Types.ObjectId;
    otpCode:  string;
    attempts: number;
    createdAt: Date;
}
const OTPSchema = new mongoose.Schema<IOTPDocument>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        unique:true,
        required: true
    },
    otpCode: {
        type: String,
        required: true
    },
    attempts: {
        type:    Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }

}, {
    timestamps: true,
});


OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });
OTPSchema.pre('save', async function () {
    if (this.isModified('otpCode')) {
        this.otpCode = await bcrypt.hash(this.otpCode, 10);
    }
});

const OTPModel = mongoose.model("OTP", OTPSchema);

export default OTPModel;