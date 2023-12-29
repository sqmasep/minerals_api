import db from "../lib/db";
import { z } from "zod";
import env from "../../env";
import { atomSchema } from "../validation/atoms";
import { Hono } from "hono";

const atomsRouter = new Hono();

atomsRouter.post("/create", async c => {
  try {
    const safeValues = atomSchema.parse(c.body({}));
    const data = await db.atom.create({
      data: {
        atomicNumber: safeValues.atomicNumber,
        symbol: safeValues.symbol,
        name: safeValues.name,
        phaseAtSTP: safeValues.phaseAtSTP,
        block: safeValues.block,
        atomicMass: safeValues.atomicMass,

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

    return c.json(data, 201);
  } catch (error) {
    console.error(error);
    return c.json({ message: error }, 500);
  }
});

atomsRouter.get("/", async c => {
  const data = await db.atom.findMany({ take: 118 });
  return c.json(data, 200);
});

atomsRouter.get("/byAtomicNumber/:atomicNumber", async c => {
  try {
    const sanitizedAtomicNumber = z.coerce
      .number()
      .positive()
      .min(1)
      .parse(c.req.param("atomicNumber"));

    const data = await db.atom.findUniqueOrThrow({
      where: { atomicNumber: sanitizedAtomicNumber },
    });

    return c.json(data, 200);
  } catch (error) {
    return c.json({ message: error }, 500);
  }
});

atomsRouter.get("/byId/:id", async c => {
  try {
    // WARN [VALIDATION] this may require more precision, like cuid or uuid or the correct id type
    const sanitizedId = z.string().parse(c.req.param("id"));

    const data = await db.atom.findUniqueOrThrow({
      where: {
        id: sanitizedId,
      },
    });

    return c.json(data, 200);
  } catch (error) {
    return c.json({ message: error }, 500);
  }
});

atomsRouter.get("/byDiscoveryYear/before/:date", async c => {
  try {
    const sanitizedDate = z
      .number()
      .int()
      .positive()
      .parse(Number(c.req.param("date")));

    const data = await db.atom.findMany({
      where: { discovery: { is: { year: { lt: sanitizedDate } } } },
    });

    return c.json(data, 200);
  } catch (error) {
    return c.json({ message: error }, 500);
  }
});

atomsRouter.get("/byDiscoveryYear/after/:date", async c => {
  try {
    const sanitizedDate = z
      .number()
      .int()
      .positive()
      .parse(Number(c.req.param("date")));

    const data = await db.atom.findMany({
      where: { discovery: { is: { year: { gt: sanitizedDate } } } },
    });

    return c.json(data, 200);
  } catch (error) {
    return c.json({ message: error }, 500);
  }
});

atomsRouter.get("/byPhaseAtSTP/:phase", async c => {
  try {
    const sanitizedPhase = z
      .enum(["gas", "liquid", "solid", "plasma"])
      .parse(c.req.param("phase"));

    const data = await db.atom.findMany({
      where: {
        phaseAtSTP: sanitizedPhase,
      },
    });

    return c.json(data, 200);
  } catch (error) {
    return c.json({ message: error }, 500);
  }
});

atomsRouter.get("/metals", async c => {
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

    return c.json(data, 200);
  } catch (error) {
    return c.json({ message: error }, 500);
  }
});

// TODO
atomsRouter.get("byBlock/:block", async c => {});

atomsRouter.get("/random", async c => {
  // TODO [FEATURE] if the user wants the extended table or not

  try {
    const data = await db.atom.findFirst({
      skip: Math.floor(Math.random() * env.ATOMS_COUNT),
    });
    console.log(data);

    return c.json(data, 200);
  } catch (error) {
    return c.json({ message: error }, 500);
  }
});

export default atomsRouter;
