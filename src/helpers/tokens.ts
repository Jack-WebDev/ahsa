import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import { type TokenPayload } from "~/types";
import { setCookie, getCookie } from "cookies-next";

export const tokenHelpers = {
  generateAccessToken: (payload: TokenPayload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });
  },

  generateRefreshToken: (payload: TokenPayload): string => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: "7d",
    });
  },

  verifyToken: (token: string, secret: string): TokenPayload => {
    try {
      return jwt.verify(token, secret) as TokenPayload;
    } catch (error) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid token",
        cause: error,
      });
    }
  },

  isTokenExpired: (token: string): boolean => {
    const decoded = jwt.decode(token) as TokenPayload;
    if (!decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  },
};

export const getTokensFromCookies = () => {
  const authToken = getCookie("authToken");
  const refreshToken = getCookie("refreshToken");
  return { authToken, refreshToken };
};

export const setTokensInCookies = (authToken: string, refreshToken: string) => {
  setCookie("authToken", authToken);
  setCookie("refreshToken", refreshToken);
};
