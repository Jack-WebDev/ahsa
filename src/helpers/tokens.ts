import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import { type TokenPayload } from "~/types";
import { getCookie } from "cookies-next";
import { config } from "~/config";

export const tokenHelpers = {
  generateAccessToken: (payload: TokenPayload): string => {
    return jwt.sign(payload, config.env.secrets.accessSecret, {
      expiresIn: 5,
    });
  },

  generateRefreshToken: (payload: TokenPayload): string => {
    return jwt.sign(payload, config.env.secrets.refreshSecret, {
      expiresIn: config.duration.refreshTokenExp,
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

// export const setTokensInCookies = (authToken: string, refreshToken: string) => {
//   setCookie('accessToken', authToken, {
//     path: '/',
//     secure: true,
//     sameSite: 'strict',
//     maxAge: config.duration.authTokenExp
//   });
  
//   setCookie('refreshToken', refreshToken, {
//     path: '/',
//     secure: true,
//     sameSite: 'strict',
//     maxAge: config.duration.refreshTokenExp
//   });
// };
