import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const atomsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.atom.findMany();
  }),
  byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.atom.findFirstOrThrow({
      where: {
        id: input,
      },
    });
  }),

  create: publicProcedure
    .input(
      z.object({
        atomicNumber: z.coerce
          .number()
          .positive()
          .refine((n) => n > 0, "Atomic number cannot be 0"),
        symbol: z.string().min(1).max(3),
        discovery: z.object({
          year: z.coerce.number(),
          by: z.string(),
        }),
        name: z.object({
          en: z.string().min(1),
          fr: z.string().min(1),
        }),
        family: z.object({
          isMetal: z.boolean(),
          name: z.string(),
        }),
        block: z.object({
          full: z.string().min(1, "Name must be at least 1 character"),
          shorten: z.string().min(1, "Name must be at least 1 character"),
          group: z.coerce.number(),
        }),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.atom.create({
        data: {
          ...input,
        },
      });
    }),
});

export default atomsRouter;
