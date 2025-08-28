import bcrypt from "bcrypt";
import User from "../models/user";
import generateToken from "../utils/generateToken";

export const register = async (req: any, res: any) => {
  const { email, password, firstName, lastName } = req.body as {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });

  await newUser.save();
  return res.status(201).json({ message: "User registered successfully" });
};

export const login = async (req: any, res: any) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = generateToken(user._id.toString());
  return res.status(200).json({ message: "Login successful", token });
};
