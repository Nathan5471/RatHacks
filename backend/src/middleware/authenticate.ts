import jwt from "jsonwebtoken";
import User from "../models/user";
import generateToken from "../utils/generateToken";
import generateRefreshToken from "../utils/generateRefreshToken";

const authenticate = async (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables");
    return res.status(500).json({ message: "Internal server error" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      type: string;
    };
    if (decoded.type !== "access") {
      res.clearCookie("token");
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      res.clearCookie("token");
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("token");
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, JWT_SECRET) as {
          id: string;
          type: string;
        };
        if (decoded.type !== "refresh") {
          res.clearCookie("refreshToken");
          return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await User.findById(decoded.id);
        if (!user) {
          res.clearCookie("refreshToken");
          return res.status(404).json({ message: "User not found" });
        }
        if (!user.validRefreshTokens?.includes(refreshToken)) {
          res.clearCookie("refreshToken");
          return res.status(401).json({ message: "Unauthorized" });
        }
        const newToken = generateToken(user._id.toString());
        const newRefreshToken = generateRefreshToken(user._id.toString());
        user.validRefreshTokens = user.validRefreshTokens?.concat(
          newRefreshToken
        ) || [newRefreshToken];
        await user.save();
        res.cookie("token", newToken, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 6 * 60 * 60 * 1000, // 6 hours
        });
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
        });
        req.user = user;
        return next();
      } catch (error) {
        res.clearCookie("refreshToken");
        return res.status(401).json({ message: "Unauthorized" });
      }
    }
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authenticate;
