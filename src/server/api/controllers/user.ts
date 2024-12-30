import { type RegisterSchemaType, type LoginSchemaType } from "~/schema/User";
import { type Context } from "../trpc";
import { TRPCError } from "@trpc/server";
import { comparePassword, hashPassword } from "~/app/utils";
import {  tokenHelpers } from "~/helpers/tokens";

export const login = async (ctx: Context, input: LoginSchemaType) => {
  const { email, password } = input;
  const user = await ctx.db.user.findUnique({ where: { email } });

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  const passwordVerified = await comparePassword(password, user.password);

  if (!passwordVerified) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Invalid credentials",
    });
  }

  const accessToken = tokenHelpers.generateAccessToken({
    userId: user.id,
    role: user.role,
  });

  const refreshToken = tokenHelpers.generateRefreshToken({
    userId: user.id,
    role: user.role,
  });

  // setTokensInCookies(accessToken, refreshToken);

  return {
    accessToken,
    refreshToken,
    message: "Login successful",
  };
};

export const register = async (ctx: Context, input: RegisterSchemaType) => {
  const { email, ...others } = input;
  const user = await ctx.db.user.findUnique({ where: { email: email } });

  if (user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User already exists",
    });
  }

  const createUserPassword = await hashPassword(input.password, 10);

  await ctx.db.user.create({
    data: {
      email,
      ...others,
      password: createUserPassword,
    },
  });

  return {
    message: "Your account has been created successfully",
  };
};
