import jwt from "jsonwebtoken";

function useToken(payload: { _id: string }, expires: number): string {
  const secret = String(process.env.JWT_SECRET);

  return jwt.sign(payload, secret, { expiresIn: expires });
}

export default useToken;
