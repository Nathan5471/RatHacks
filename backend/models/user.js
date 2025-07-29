import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  homeSchool: {
    type: String,
    enum: [
      "caveSpringHighSchool",
      "craigCountyHighSchool",
      "floydCountyHighSchool",
      "franklinCountyHighSchool",
      "glenvarHighSchool",
      "hiddenValleyHighSchool",
      "jamesRiverHighSchool",
      "libertyHighSchool",
      "lordBotetourtHighSchool",
      "northsideHighSchool",
      "patrickHenryHighSchool",
      "salemHighSchool",
      "StauntonRiverHighSchool",
      "williamByrdHighSchool",
      "williamFlemingHighSchool",
      "other",
    ],
    required: true,
  },
  otherHomeSchool: {
    type: String,
    default: "",
  },
  isGovSchool: {
    type: Boolean,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["student", "judge", "organizer", "admin"],
    default: "student",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  accountUpdates: [
    {
      changedAt: {
        type: Date,
        default: Date.now,
      },
      changed: {
        type: String,
        enum: [
          "email",
          "password",
          "firstName",
          "lastName",
          "homeSchool",
          "otherHomeSchool",
          "isGovSchool",
          "accountType",
        ],
        required: true,
      },
      previousValue: {
        type: String,
        required: true,
      },
      newValue: {
        type: String,
        required: true,
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);
export default User;
