import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBooking extends Document {
  apartmentId: mongoose.Types.ObjectId;

  // Optional because guests can book without an account
  userId?: mongoose.Types.ObjectId;

  // Required for every booking
  guestName: string;
  guestEmail: string;
  guestPhone: string;

  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: number;
  pricePerNight: number;
  totalAmount: number;

  status: "pending" | "confirmed" | "cancelled";

  paymentStatus: "unpaid" | "paid" | "failed";

  paymentReference?: string;

  paidAt?: Date;

  expiresAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    apartmentId: {
      type: Schema.Types.ObjectId,
      ref: "Apartment",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    guestName: {
      type: String,
      required: true,
      trim: true,
    },

    guestEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    guestPhone: {
      type: String,
      required: true,
      trim: true,
    },

    checkIn: {
      type: Date,
      required: true,
    },

    checkOut: {
      type: Date,
      required: true,
    },

    nights: {
      type: Number,
      required: true,
      min: 1,
    },

    guests: {
      type: Number,
      required: true,
      min: 1,
    },

    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed"],
      default: "unpaid",
    },

    paymentReference: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },

    paidAt: {
      type: Date,
      required: false,
    },

    expiresAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
);

const Booking =
  (mongoose.models.Booking as Model<IBooking>) ||
  mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
