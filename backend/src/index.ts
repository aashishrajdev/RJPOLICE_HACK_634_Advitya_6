import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { db } from "./client";
import { cors } from "hono/cors";
import { Camera } from "@prisma/client";
//
const app = new Hono();
app.use("*", cors({ origin: ["http://localhost:5173"] }));
app.get("/", (c) => c.text("This is the backend server ! 🚀"));

app.get("/add", (c) => c.json({ hello: "world" }));

app.get("/user/:id", async (c) => {
  const { id } = c.req.param();
  try {
    const user = await db.user.findUnique({ where: { id: Number(id) } });
    return c.json({ data: user });
  } catch (error) {
    //@ts-ignore
    return c.json({ error: error.message });
  }
});

app.delete("/user/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const user = await db.user.delete({
      where: { id: Number(id) },
    });
    return c.json({ data: user });
  } catch (error) {
    console.error(error);
    //@ts-ignore
    return c.json({ error: error.message });
  }
});

app.get("/user/camera/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const camera = await db.camera.findMany({ where: { ownerId: Number(id) } });
    return c.json({ data: camera });
  } catch (error) {
    console.error(error);
    //@ts-ignore
    return c.json({ error: error.message });
  }
});

app.post("/user", async (c) => {
  try {
    const body = await c.req.json<{
      email: string;
      name: string;
      contact: string; // Keep it as a string
    }>();

    // Perform additional validation in your application code
    if (!isValidContact(body.contact)) {
      return c.json({ error: "Invalid contact" });
    }

    const { email, name } = body;
    const contact = Number(body.contact); // Convert back to number

    // Check if a user with the same email already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return c.json({ error: "A user with this email already exists" });
    }

    const user = await db.user.create({
      data: { email, name, contact }, // Include contact
    });

    return c.json({ data: user });
  } catch (error) {
    //@ts-ignore
    return c.json({ error: error.message });
  }
});

function isValidContact(contact: string): boolean {
  // Perform your contact validation logic here
  return contact.length === 10 && /^\d+$/.test(contact); // Checks for 10 digits
}

app.get("/users", async (c) => {
  try {
    const users = await db.user.findMany();
    return c.json({ data: users });
  } catch (error) {
    //@ts-ignore
    return c.json({ error: error.message });
  }
});

app.get("/cameras", async (c) => {
  try {
    const cameras = await db.camera.findMany();
    return c.json({ data: cameras });
  } catch (error) {
    //@ts-ignore
    return c.json({ error: error.message });
  }
});

app.get("/camera/:id", async (c) => {
  const { id } = c.req.param();
  try {
    const camera = await db.camera.findUnique({ where: { id: Number(id) } });
    return c.json({ data: camera });
  } catch (error) {
    //@ts-ignore
    return c.json({ error: error.message });
  }
});

app.delete("/camera/:id", async (c) => {
  const { id } = c.req.param();
  try {
    const camera = await db.camera.delete({
      where: { id: Number(id) },
    });
    return c.json({ data: camera });
  } catch (error) {
    console.error(error);
    //@ts-ignore
    return c.json({ error: error.message });
  }
});

// ...

type CameraBody = Omit<Camera, "id"> & {
  ownerId: number;
  latitude?: number;
  longitude?: number;
};

app.post("/camera", async (c) => {
  try {
    const body = await c.req.json<CameraBody>();
    const { ownerId, visibilityRange, resolution, latitude, longitude } = body;

    let camera: any;
    if (visibilityRange && resolution) {
      camera = await db.camera.create({
        data: {
          ownerId: Number(ownerId),
          visibilityRange,
          resolution,
          latitude,
          longitude,
        },
      });
    } else {
      camera = await db.camera.create({
        data: { ownerId: Number(ownerId), latitude, longitude },
      });
    }

    return c.json({ data: camera });
  } catch (error) {
    //@ts-ignore
    return c.json({ error: error.message });
  }
});

console.log("Server running at http://localhost:8787 🚀");

serve({
  fetch: app.fetch,
  port: 8787,
});
