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
  },
  {
    timestamps: {
      createdOn: "createdOn",
      updatedOn: "updatedOn"
    }
  }
)

export const User = mongoose.model("user", userScheme);

