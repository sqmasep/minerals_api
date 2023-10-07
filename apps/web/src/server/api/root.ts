import { createTRPCRouter } from "~/server/api/trpc";
import atomsRouter from "./routers/atoms";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  atoms: atomsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
