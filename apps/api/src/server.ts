import { serve } from "@hono/node-server";
import { Hono } from "hono";
import atomsRouter from "./routers/atoms";
import env from "../env";

const app = new Hono();

app.route("/atoms", atomsRouter);

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  info => console.log("Server is running on port", info.port, "🚀"),
);

export default app;
