import mongoose from "mongoose";

interface UserModel extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  emailToken: string;
  emailVerified: boolean;
  accountType: "student" | "judge" | "organizer";
  password: string;
  firstName: string;
  lastName: string;
  schoolDivision: string;
  gradeLevel: "9" | "10" | "11" | "12";
  isGovSchool: boolean;
  skillLevel: "beginner" | "intermediate" | "advanced";
  techStack: string;
  previousHackathon: boolean;
  validRefreshTokens?: string[];
}

const userSchema = new mongoose.Schema<UserModel>({
  email: { type: String, required: true, unique: true },
  emailToken: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  accountType: {
    type: String,
    enum: ["student", "judge", "organizer"],
    required: true,
    default: "student",
  },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  schoolDivision: { type: String, required: true },
  gradeLevel: { type: String, enum: ["9", "10", "11", "12"], required: true },
  isGovSchool: { type: Boolean, required: true },
  validRefreshTokens: { type: [String], default: [] },
});

const User = mongoose.model<UserModel>("User", userSchema);

export default User;
