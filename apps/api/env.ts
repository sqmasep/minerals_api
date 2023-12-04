import type { ZodTypeAny } from "zod";
import { z } from "zod";
import "dotenv/config";

// Conventions that need to be used (e.g Uppercase string keys)
type EnvShape = Record<
  Uppercase<string>,
  | z.ZodString
  | z.ZodEnum<[string, ...string[]]>
  | z.ZodNumber
  | z.ZodDefault<ZodTypeAny>
>;

const envSchema = z.object({
  PORT: z.coerce
    .number({ description: "Please provide a port to run the API" })
    .positive(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  ATOMS_COUNT: z.coerce.number({
    description: "Please provide a number of atoms to generate",
  }),
} satisfies EnvShape);

const env = envSchema.parse({
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  ATOMS_COUNT: process.env.ATOMS_COUNT,
} as unknown as EnvSchema);

export default env;

export type EnvSchema = z.infer<typeof envSchema>;
