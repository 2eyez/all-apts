import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAvailability extends Document {
  apartmentId: mongoose.Types.ObjectId;
  date: Date;
  status: "available" | "blocked";
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AvailabilitySchema = new Schema<IAvailability>(
  {
    apartmentId: {
      type: Schema.Types.ObjectId,
      ref: "Apartment",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "blocked"],
      default: "available",
    },

    reason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

AvailabilitySchema.index(
  { apartmentId: 1, date: 1 },
  { unique: true },
);

const Availability =
  (mongoose.models.Availability as Model<IAvailability>) ||
  mongoose.model<IAvailability>("Availability", AvailabilitySchema);

export default Availability;