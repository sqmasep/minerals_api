import { z } from "zod";

export const atomicNumberSchema = z.number().positive().min(1).max(200);
export type AtomicNumber = z.infer<typeof atomicNumberSchema>;

export const symbolSchema = z.string().min(1).max(3);
export type AtomSymbol = z.infer<typeof symbolSchema>;

export const atomicMassSchema = z.string();
export type AtomicMass = z.infer<typeof atomicMassSchema>;

export const meltingPointSchema = z.object({
  kelvin: z.string(),
  celsius: z.string(),
  fahrenheit: z.string(),
});
export type MeltingPoint = z.infer<typeof meltingPointSchema>;

export const nameSchema = z.object({
  en: z.string(),
  fr: z.string(),
});
export type AtomName = z.infer<typeof nameSchema>;

export const phaseAtSTPSchema = z.enum(["gas", "liquid", "solid", "plasma"]);
export type PhaseAtSTP = z.infer<typeof phaseAtSTPSchema>;

export const blockSchema = z.enum(["s", "f", "d", "p"]);
export type Block = z.infer<typeof blockSchema>;

export const groupSchema = z.number().int().positive().min(1).max(18);
export type Group = z.infer<typeof groupSchema>;

export const periodSchema = z.number().int().positive().min(1).max(7);
export type Period = z.infer<typeof periodSchema>;

export const familySchema = z.object({
  isMetal: z.boolean(),
  name: z.string(),
});
export type Family = z.infer<typeof familySchema>;

export const discoverySchema = z.object({
  by: z.string(),
  country: z.string(),
  year: z.number().int().positive(),
});
export type Discovery = z.infer<typeof discoverySchema>;

// TODO [DB] electronLayer number[] <-- how many electrons per layer

export const atomSchema = z.object({
  atomicNumber: atomicNumberSchema,
  symbol: symbolSchema,
  atomicMass: atomicMassSchema,
  meltingPoint: meltingPointSchema,
  name: nameSchema,
  phaseAtSTP: phaseAtSTPSchema,
  block: blockSchema,
  group: groupSchema,
  period: periodSchema,
  family: familySchema,
  discovery: discoverySchema,
});
export type Atom = z.infer<typeof atomSchema>;
