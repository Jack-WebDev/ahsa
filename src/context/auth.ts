"use server";

import { jwtDecode, type JwtPayload as DefaultJwtPayload } from "jwt-decode";
import { cookies } from "next/headers";

interface JwtPayload extends DefaultJwtPayload {
  id: string;
  accessToken: string;
  refreshToken: string;
  status: string;
  role: string;
  iat: number;
  exp: number;
}

class TokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenError";
  }
}


export async function getAuthCookie(): Promise<string | null> {
  const cookieStore = cookies();
  const cookie = cookieStore.get("authToken");

  if (!cookie) {
    console.warn("Auth token cookie not found.");
    return null;
  }

  const token = cookie.value.trim();
  if (!token) {
    console.warn("Auth token is empty.");
    return null;
  }

  return token;
}

export async function getRefreshTokenCookie(): Promise<string | null> {
  const cookieStore = cookies();
  const cookie = cookieStore.get("refreshToken");

  if (!cookie) {
    console.warn("Refresh token cookie not found.");
    return null;
  }

  const token = cookie.value.trim();
  if (!token) {
    console.warn("Refresh token is empty.");
    return null;
  }

  return token;
}


function decodeAndValidateToken(token: string): JwtPayload {
  let decoded: JwtPayload;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    decoded = jwtDecode<JwtPayload>(token);
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "message" in error) {
      console.error("Error decoding JWT token:", (error as Error).message);
      throw new TokenError("Invalid token format.");
    } else {
      console.error("Unknown error during JWT decoding:", error);
      throw new TokenError("An unexpected error occurred.");
    }
  }

  const currentTime = Math.floor(Date.now() / 1000);
  if (decoded.exp && decoded.exp < currentTime) {
    throw new TokenError("Token has expired.");
  }

  return decoded;
}


export async function getAuth(token?: string): Promise<JwtPayload | null> {
  const authToken = token ?? (await getAuthCookie());

  if (!authToken) {
    console.info("No authentication token provided.");
    return null;
  }

  try {
    const decoded = decodeAndValidateToken(authToken);
    return decoded;
  } catch (error) {
    if (error instanceof TokenError) {
      console.error(`Token error: ${error.message}`);
    } else {
      console.error("Unexpected error during token decoding:", error);
    }
    return null;
  }
}


