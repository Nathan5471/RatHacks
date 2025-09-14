import mongoose from "mongoose";

interface UserModel extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  emailToken: string;
  emailVerified: boolean;
  password: string;
  firstName: string;
  lastName: string;
  validRefreshTokens?: string[];
}

const userSchema = new mongoose.Schema<UserModel>({
  email: { type: String, required: true, unique: true },
  emailToken: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  validRefreshTokens: { type: [String], default: [] },
});

const User = mongoose.model<UserModel>("User", userSchema);

export default User;
