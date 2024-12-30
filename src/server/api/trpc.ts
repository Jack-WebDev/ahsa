import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { getAuth, getAuthCookie, getRefreshTokenCookie } from "~/context";
import { db } from "~/server/db";
import { config } from "~/config";
import type { TokenPair, TokenPayload, AuthUserType } from "~/types";
import { tokenHelpers } from "~/helpers/tokens";

export const createTRPCContext = async (opts: { headers: Headers, authToken?: string, refreshToken?: string }) => {
  try {
    const authToken = await getAuthCookie();
    const refreshToken = await getRefreshTokenCookie();
    if (!authToken) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "No valid authentication token found",
      });
    }

    const authResponse = await getAuth(authToken);
    if (!authResponse) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Authentication validation failed",
      });
    }

    const auth = authResponse as AuthUserType;

    if (auth.exp * 1000 < Date.now()) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Authentication token has expired",
      });
    }

    return {
      db,
      ...opts,
      auth,
      authToken,
      refreshToken,
    };
  } catch (error) {
    console.log(error)
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error creating context",
      cause: error,
    });
  }
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
        additionalInfo: error instanceof TRPCError ? error.cause : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

const authMiddleware = t.middleware(async ({ ctx, next }) => {
  try {
    const { authToken, refreshToken } = ctx;

    if (!authToken) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "No authentication token provided",
      });
    }

    try {
    } catch (tokenError) {
      if (refreshToken) {
        try {
          const decoded = tokenHelpers.verifyToken(
            refreshToken,
            config.env.secrets.refreshSecret,
          );

          const { accessToken, refreshToken: newRefreshToken } =
            await refreshTokens(decoded.userId);

          const newAuth = await getAuth(accessToken);
          if (!newAuth) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Invalid authentication credentials after refresh",
            });
          }

          return next({
            ctx: {
              ...ctx,
              authToken: accessToken,
              refreshToken: newRefreshToken,
              auth: newAuth,
              tokensRefreshed: true,
            },
          });
        } catch (refreshError) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid refresh token",
            cause: refreshError,
          });
        }
      }
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
        cause: tokenError,
      });
    }

    const auth = await getAuth(authToken);
    if (!auth) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid authentication credentials",
      });
    }

    return next({
      ctx: {
        ...ctx,
        authToken,
        auth,
      },
    });
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Authentication middleware error",
      cause: error,
    });
  }
});

async function refreshTokens(userId = "jhfhfdfdsf"): Promise<TokenPair> {
  const user = {
    id: userId,
    role: "admin",
  };

  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not found",
    });
  }

  const payload: TokenPayload = {
    userId: user.id,
    role: user.role,
  };

  return {
    accessToken: tokenHelpers.generateAccessToken(payload),
    refreshToken: tokenHelpers.generateRefreshToken(payload),
  };
}

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(authMiddleware);
