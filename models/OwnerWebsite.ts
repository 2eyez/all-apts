import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOwnerWebsite extends Document {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  phone?: string;
  email?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OwnerWebsiteSchema = new Schema<IOwnerWebsite>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    logo: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const OwnerWebsite =
  (mongoose.models.OwnerWebsite as Model<IOwnerWebsite>) ||
  mongoose.model<IOwnerWebsite>("OwnerWebsite", OwnerWebsiteSchema);

export default OwnerWebsite;