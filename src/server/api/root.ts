import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { UserRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
  user: UserRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
