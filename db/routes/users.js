import express from "express";
import { createUser, getUserByUsername } from "#db/queries/users";
import { hashPassword, comparePassword } from "#utils/passwords";
import { createToken } from "#utils/jwt";
import requireBody from "#middleware/requireBody";

const router = express.Router();

/** POST /users/register */
router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;

    try {
      // Check if username exists
      const existingUser = await getUserByUsername(username);
      if (existingUser) return res.status(400).send("Username taken.");

      const hashedPassword = await hashPassword(password);

      const user = await createUser({ username, password: hashedPassword });

      const token = createToken({ id: user.id });

      res.status(201).send(token);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

/** POST /users/login */
router.post("/login", requireBody(["username", "password"]), async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);
    if (!user) return res.status(401).send("Invalid credentials");

    const valid = await comparePassword(password, user.password);
    if (!valid) return res.status(401).send("Invalid credentials");

    const token = createToken({ id: user.id });
    res.send(token);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
