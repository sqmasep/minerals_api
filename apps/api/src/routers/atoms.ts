import express from "express";
import db from "../lib/db";
import { z } from "zod";

const atomsRouter = express.Router();

atomsRouter.get("/", async (req, res) => {
  const data = await db.atom.findMany();
  return res.status(200).send(data);
});

atomsRouter.get("/byAtomicNumber/:atomicNumber", async (req, res) => {
  try {
    const sanitizedAtomicNumber = z
      .number()
      .positive()
      .min(1)
      .parse(req.params.atomicNumber);

    const data = await db.atom.findUniqueOrThrow({
      where: { atomicNumber: sanitizedAtomicNumber },
    });

    return res.status(200).send(data);
  } catch (error) {}
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
