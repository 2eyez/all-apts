import mongoose, { Document, Model, Schema } from "mongoose";

export interface IApartment extends Document {
  title: string;
  description: string;
  address: string;
  location: string;
  city: string;
  price: number;
  discount: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  amenities: string[];
  rules: string[];
  rating: number;
  ownerId: mongoose.Types.ObjectId;
  listedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApartmentSchema = new Schema<IApartment>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    bedrooms: {
      type: Number,
      required: true,
      min: 1,
    },

    bathrooms: {
      type: Number,
      required: true,
      min: 1,
    },

    images: {
      type: [String],
      required: true,
      default: [],
    },

    amenities: {
      type: [String],
      default: [],
    },

    rules: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    listedBy: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Apartment =
  (mongoose.models.Apartment as Model<IApartment>) ||
  mongoose.model<IApartment>("Apartment", ApartmentSchema);

export default Apartment;
