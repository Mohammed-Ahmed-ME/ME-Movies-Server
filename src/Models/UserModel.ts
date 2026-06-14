import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import validator from "validator";

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const TimeSlotSchema = new mongoose.Schema(
  {
    time: { type: String, required: true, trim: true }, // "04:00 to 05:00 PM"
    slots: { type: Number, required: true, min: 1, max: 50 },
  },
  { _id: false },
);


const userSchema = new mongoose.Schema(
  {
    // ── Basic Info ──────────────────────────────────────────────────────
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
      validate: {
        validator: (v: string) => validator.isStrongPassword(v),
        message: "Please provide a strong password",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      validate: {
        validator: (v: string) => validator.isMobilePhone(v),
        message: "Please provide a valid phone number",
      },
    },

    // ── Role & Auth ─────────────────────────────────────────────────────
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    avatar: { type: String },

    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
      max: [120, "Age cannot exceed 120"],
    },
    dateOfBirth: { type: Date },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },

    // ── Emergency Contact ───────────────────────────────────────────────
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },

    // ── Gynecological / UserObstetric ───────────────────────────────────────
    maritalStatus: {
      type: String,
        default: "Unknown",
      enum: ["Single", "Married", "Divorced", "Widowed", "Unknown"],
    }
  },
  { timestamps: true },
);

// ─── Middleware ───────────────────────────────────────────────────────────────

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password as string, 12);
    next();
  } catch (err: any) {
    next(err);
  }
});


// ─── Indexes ──────────────────────────────────────────────────────────────────

userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });



// ─── Virtuals ─────────────────────────────────────────────────────────────────

userSchema.virtual("profile").get(function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
    phone: this.phone,
  };
});


userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

// ─── Model (Next.js hot-reload safe) ─────────────────────────────────────────

const UserModel = mongoose.models.User ?? mongoose.model("User", userSchema);

export default UserModel;
