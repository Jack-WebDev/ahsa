import { LoginSchema, RegisterSchema } from "~/schema/User";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { login, register } from "../controllers";

export const UserRouter = createTRPCRouter({
  register: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({ input, ctx }) => {
      return await register(ctx, input);
    }),
  login: publicProcedure.input(LoginSchema).mutation(async ({ input, ctx }) => {
    return await login(ctx, input);
  }),
});
