import express from "express";
import env from "../env";
import atomsRouter from "./routers/atoms";

const app = express();
app.use(express.json());

app.use("/atoms", atomsRouter);

app.listen(env.PORT, () => console.log(`API running on port ${env.PORT}`));
