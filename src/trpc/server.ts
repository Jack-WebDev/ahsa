import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";

import { createCaller, type AppRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { createQueryClient } from "./query-client";


const createContext = cache(() => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");
  const authToken = heads.get("Authorization")?.split(" ")[1];
  const refreshToken = heads.get("X-Refresh-Token");



  return createTRPCContext({
    headers: heads,
    authToken: authToken ?? undefined,
    refreshToken: refreshToken ?? undefined,
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: serverApi, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient
);
