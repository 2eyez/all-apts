import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPayout extends Document {
  ownerId: mongoose.Types.ObjectId;
  bookingId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "paid" | "failed";
  reference?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PayoutSchema = new Schema<IPayout>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
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
      enum: ["pending", "processing", "paid", "failed"],
      default: "pending",
    },

    reference: {
      type: String,
      trim: true,
    },

    paidAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Payout =
  (mongoose.models.Payout as Model<IPayout>) ||
  mongoose.model<IPayout>("Payout", PayoutSchema);

export default Payout;