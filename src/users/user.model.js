import { string } from "joi";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * User Entity
 */
const userScheme = new Schema(
  {
    id: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    secretCode: { type: String, default: null },
    secretCodeExpiry: { type: Date, default: null },
    // refreshToken: { type: string, default: null },
    // accesToken: { type: string, default: null }
  },
  {
    timestamps: {
      createdOn: "createdOn",
      updatedOn: "updatedOn"
    }
  }
)

export const User = mongoose.model("user", userScheme);

