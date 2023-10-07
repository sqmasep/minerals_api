import express from "express";
import db from "../lib/db";
import { z } from "zod";

const atomsRouter = express.Router();

atomsRouter.get("/", async (req, res) => {
  const data = await db.atom.findMany();
  res.status(200).send(data);
});

atomsRouter.get("/byAtomicNumber/:atomicNumber", async (req, res) => {
  try {
    const sanitizedAtomicNumber = z
      .number()
      .positive()
      .parse(req.params.atomicNumber);

    const data = await db.atom.findUniqueOrThrow({
      where: { atomicNumber: sanitizedAtomicNumber },
    });
  } catch (error) {}
});

atomsRouter.get("/byId/:id", async (req, res) => {
  try {
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

export default atomsRouter;
