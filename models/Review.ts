import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  apartmentId: mongoose.Types.ObjectId;
  bookingId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    apartmentId: {
      type: Schema.Types.ObjectId,
      ref: "Apartment",
      required: true,
    },

    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const Review =
  (mongoose.models.Review as Model<IReview>) ||
  mongoose.model<IReview>("Review", ReviewSchema);

export default Review;