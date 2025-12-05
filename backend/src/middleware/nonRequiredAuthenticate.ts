import jwt from "jsonwebtoken";
import prisma from "../prisma/client";
import generateToken from "../utils/generateToken";
import generateRefreshToken from "../utils/generateRefreshToken";

const nonRequiredAuthenticate = async (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;
  if (!token && !refreshToken) {
    req.user = null;
    next();
  }
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables");
    return res.status(500).json({ message: "Internal server error" });
  }
  try {
    if (!token) {
      throw new Error("No token found");
    }
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      type: string;
    };
    if (decoded.type !== "access") {
      res.clearCookie("token");
      req.user = null;
      return next();
    }
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) {
      res.clearCookie("token");
      req.user = null;
      return next();
    }
    if (!user.validAccessTokens?.includes(token)) {
      res.clearCookie("token");
      throw new Error("Token not valid");
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
          req.user = null;
          return next();
        }
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
        });
        if (!user) {
          res.clearCookie("refreshToken");
          req.user = null;
          return next();
        }
        if (!user.validRefreshTokens?.includes(refreshToken)) {
          res.clearCookie("refreshToken");
          req.user = null;
          return next();
        }
        const newToken = generateToken(user.id.toString());
        const newRefreshToken = generateRefreshToken(user.id.toString());
        const updatedUser = await prisma.user.update({
          where: { id: decoded.id },
          data: {
            validAccessTokens: user.validAccessTokens?.concat(newToken) || [
              newToken,
            ],
            validRefreshTokens: user.validRefreshTokens?.concat(
              newRefreshToken
            ) || [newRefreshToken],
          },
        });
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
        req.user = updatedUser;
        return next();
      } catch (error) {
        res.clearCookie("refreshToken");
        res.user = null;
        return next();
      }
    }
    req.user = null;
    return next();
  }
};

export default nonRequiredAuthenticate;
