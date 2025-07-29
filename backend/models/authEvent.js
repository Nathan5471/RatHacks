import mongoose from "mongoose";

const authEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventType: {
    type: String,
    enum: ["signup", "login", "logout", "tokenRefresh"],
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

const AuthEvent = mongoose.model("AuthEvent", authEventSchema);
export default AuthEvent;
