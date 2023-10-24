import express from "express";
import db from "../lib/db";
import { z } from "zod";

const atomsRouter = express.Router();
const schema = z.object({
  atomicNumber: z.number().positive().min(1).max(200),
  symbol: z
    .string()
    .trim()
    .refine(v => v.length >= 1 && v.length <= 3),
  atomicMass: z.string(),
  meltingPoint: z.object({
    kelvin: z.string(),
    celsius: z.string(),
    fahrenheit: z.string(),
  }),
  name: z.object({
    en: z.string(),
    fr: z.string(),
  }),
  phaseAtSTP: z.enum(["gas", "liquid", "solid", "plasma"]),
  block: z.object({
    full: z.string(),
    shorten: z.string(),
  }),
  discovery: z.object({
    by: z.string(),
    country: z.string(),
    year: z.number().int().positive(),
  }),
  family: z.object({
    isMetal: z.boolean(),
    name: z.string(),
  }),
  group: z.number().int().positive().min(1).max(18),
  period: z.number().int().positive().min(1).max(7),
});

atomsRouter.post("/create", async (req, res) => {
  try {
    const safeValues = schema.parse(req.body);
    const data = await db.atom.create({
      data: {
        atomicNumber: safeValues.atomicNumber,
        symbol: safeValues.symbol,
        name: safeValues.name,
        phaseAtSTP: safeValues.phaseAtSTP,
        block: {
          set: {
            full: safeValues.block.full,
            shorten: safeValues.block.shorten,
          },
        },
        discovery: {
          set: {
            by: safeValues.discovery.by,
            country: safeValues.discovery.country,
            year: safeValues.discovery.year,
          },
        },
        family: {
          set: {
            isMetal: safeValues.family.isMetal,
            name: safeValues.family.name,
          },
        },
        group: safeValues.group,
        period: safeValues.period,
      },
    });

    return res.status(200).send(data);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: error });
  }
});

atomsRouter.get("/", async (req, res) => {
  const data = await db.atom.findMany();
  return res.status(200).send(data);
});

atomsRouter.get("/byAtomicNumber/:atomicNumber", async (req, res) => {
  try {
    const sanitizedAtomicNumber = z.coerce
      .number()
      .positive()
      .min(1)
      .parse(req.params.atomicNumber);

    const data = await db.atom.findUniqueOrThrow({
      where: { atomicNumber: sanitizedAtomicNumber },
    });

    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
});

atomsRouter.get("/byId/:id", async (req, res) => {
  try {
    // WARN [VALIDATION] this may require more precision, like cuid or uuid or the correct id type
    const sanitizedId = z.string().parse(req.params.id);

    const data = await db.atom.findUniqueOrThrow({
      where: {
        id: sanitizedId,
      },
    });

    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
});

atomsRouter.get("/byDiscoveryYear/before/:date", async (req, res) => {
  try {
    const sanitizedDate = z
      .number()
      .int()
      .positive()
      .parse(Number(req.params.date));

    const data = await db.atom.findMany({
      where: { discovery: { is: { year: { lt: sanitizedDate } } } },
    });

    return res.status(200).send(data);
  } catch (error) {}
});

atomsRouter.get("/byDiscoveryYear/after/:date", async (req, res) => {
  try {
    const sanitizedDate = z
      .number()
      .int()
      .positive()
      .parse(Number(req.params.date));

    const data = await db.atom.findMany({
      where: { discovery: { is: { year: { gt: sanitizedDate } } } },
    });

    return res.status(200).send(data);
  } catch (error) {}
});

atomsRouter.get("/byPhaseAtSTP/:phase", async (req, res) => {
  try {
    const sanitizedPhase = z
      .enum(["gas", "liquid", "solid", "plasma"])
      .parse(req.params.phase);

    const data = await db.atom.findMany({
      where: {
        phaseAtSTP: sanitizedPhase,
      },
    });

    return res.status(200).send(data);
  } catch (error) {}
});

atomsRouter.get("/metals", async (req, res) => {
  try {
    const data = await db.atom.findMany({
      where: {
        family: {
          is: {
            isMetal: true,
          },
        },
      },
    });

    return res.status(200).send(data);
  } catch (error) {}
});

atomsRouter.get("/byBlock/:block", async (req, res) => {});
atomsRouter.get("/byBlock/:block", async (req, res) => {});

export default atomsRouter;
