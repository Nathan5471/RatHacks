import mongoose from "mongoose";

interface UserModel extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const userSchema = new mongoose.Schema<UserModel>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

const User = mongoose.model<UserModel>("User", userSchema);

export default User;
