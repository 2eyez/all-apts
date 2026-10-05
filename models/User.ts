import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  companyName?: string;
  email: string;
  phone?: string;
  password: string;
  role: "guest" | "admin" | "owner";
  isVerified: boolean;

  status: "active" | "suspended" | "banned";
  suspensionReason?: string;
  suspendedUntil?: Date;
  banReason?: string;

  favoriteApartments: mongoose.Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["guest", "admin", "owner"],
      default: "guest",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },

    suspensionReason: {
      type: String,
      trim: true,
    },

    suspendedUntil: {
      type: Date,
    },

    banReason: {
      type: String,
      trim: true,
    },

    favoriteApartments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Apartment",
      },
    ],
  },
  { timestamps: true },
);

const User =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default User;
