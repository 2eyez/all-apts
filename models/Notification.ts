import mongoose, { Document, Model, Schema } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type:
    | "booking"
    | "payment"
    | "review"
    | "verification"
    | "payout"
    | "account"
    | "system";
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "booking",
        "payment",
        "review",
        "verification",
        "payout",
        "account",
        "system",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    link: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

const Notification =
  (mongoose.models.Notification as Model<INotification>) ||
  mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;