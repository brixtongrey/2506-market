import express from "express";
import bcrypt from "bcrypt";
import db from "#db/client";
import { createToken } from "#utils/jwt";
import requireBody from "#middleware/requireBody";
import getUserFromToken from "#middleware/getUserFromToken";

const router = express.Router();

// Attach user from token if exists
router.use(getUserFromToken);

async function createUserInDB(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING *
  `;
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);
  return user;
}

async function getUserByUsername(username) {
  const sql = `
    SELECT * FROM users
    WHERE username = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [username]);
  return user;
}

// register new user
router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const user = await createUserInDB(username, password);
    const token = createToken({ id: user.id });
    res.status(201).send(token);
  }
);

// login
router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (!user) return res.status(401).send("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).send("Invalid credentials");

    const token = createToken({ id: user.id });
    res.send(token);
  }
);

export default router;

