import mongoose, { Document, Model, Schema } from "mongoose";

export interface IVerification extends Document {
  userId: mongoose.Types.ObjectId;
  type: "identity" | "owner" | "business";
  status: "pending" | "approved" | "rejected";
  documentType?: string;
  documentUrl?: string;
  rejectionReason?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationSchema = new Schema<IVerification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["identity", "owner", "business"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    documentType: {
      type: String,
      trim: true,
    },

    documentUrl: {
      type: String,
      trim: true,
    },

    rejectionReason: {
      type: String,
      trim: true,
    },

    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Verification =
  (mongoose.models.Verification as Model<IVerification>) ||
  mongoose.model<IVerification>("Verification", VerificationSchema);

export default Verification;