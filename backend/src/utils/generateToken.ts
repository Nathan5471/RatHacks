import jwt from "jsonwebtoken";

const generateToken = (id: string) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign({ id, type: "access" }, JWT_SECRET, {
    expiresIn: "6h",
  });
  return token;
};

export default generateToken;
