import "dotenv/config";
import { createRemoteJWKSet, jwtVerify } from "jose";

const JWKS = createRemoteJWKSet(new URL(`${process.env.AUTH_URL}/api/auth/jwks`));

export async function verifyJWT(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Please log in to continue." });
  }
  try {
    const { payload } = await jwtVerify(header.split(" ")[1], JWKS, {
      issuer: process.env.AUTH_URL,
      audience: process.env.AUTH_URL,
    });
    req.user = payload;
    next();
  } catch {
    res.status(401).send({ message: "Your session is invalid or expired." });
  }
}