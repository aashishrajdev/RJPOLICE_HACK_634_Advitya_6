import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { db } from "./client";
import { cors } from "hono/cors";
//
const app = new Hono();
app.use("*", cors({ origin: ["http://localhost:5173"] }));
app.get("/", (c) => c.text("Hello Hono!"));

app.get("/add", (c) => c.json({ hello: "world" }));

app.get("/user/:id", async (c) => {
  const { id } = c.req.param();
  try {
    const user = await db.user.findUnique({ where: { id: Number(id) } });
    return c.json({ data: user });
  } catch (error) {
    return c.json({ error: "something wrong happened" });
  }
});

app.get("/users", async (c) => {
  try {
    const users = await db.user.findMany();
    return c.json({ data: users });
  } catch (error) {
    return c.json({ error: "something wrong happened" });
  }
});

console.log("Server running at http://localhost:8787 🚀");

serve({
  fetch: app.fetch,
  port: 8787,
});
