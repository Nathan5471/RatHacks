import jwt from "jsonwebtoken";

const generateRefreshToken = (id: string) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const refreshToken = jwt.sign({ id, type: "refresh" }, JWT_SECRET, {
    expiresIn: "90d",
  });
  return refreshToken;
};

export default generateRefreshToken;
