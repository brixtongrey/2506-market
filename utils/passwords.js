import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/** Hashes a plaintext password */
export async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/** Compares a plaintext password with a hash */
export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
