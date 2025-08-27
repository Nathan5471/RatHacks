import jwt from "jsonwebtoken";

const generateToken = (id: string) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: "30d" });
  return token;
};

export default generateToken;
