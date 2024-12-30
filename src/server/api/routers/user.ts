import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const UserRouter = createTRPCRouter({
  getUsers: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      return input;
    }),
});
