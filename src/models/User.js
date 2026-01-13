import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Don't include password by default
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    lastLogin: {
      type: Date,
    },
    oauth: {
      google: {
        id: String,
        displayName: String,
      },
      github: {
        id: String,
        displayName: String,
      },
      facebook: {
        id: String,
        displayName: String,
      },
    },
    phoneNumber: {
      type: String,
      default: null,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
      trim: true,
      maxlength: [300, "Bio cannot exceed 300 characters"],
    },
    defaultShippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
