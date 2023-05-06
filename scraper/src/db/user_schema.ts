import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  authetication: {
    password: { type: String, required: true, select: true },
    salt: { type: String, required: false },
    sessionToken: { type: String, required: false },
  },
});

export const UserModel = mongoose.model("User", UserSchema);
