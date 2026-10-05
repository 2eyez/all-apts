import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  reference: string;
  amount: number;
  currency: string;
  status: "pending" | "successful" | "failed" | "refunded";
  paymentMethod?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      default: "NGN",
      uppercase: true,
    },

    status: {
      type: String,
      enum: ["pending", "successful", "failed", "refunded"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      trim: true,
    },

    paidAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Payment =
  (mongoose.models.Payment as Model<IPayment>) ||
  mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;