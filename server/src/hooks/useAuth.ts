import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import IRequest from "../interfaces/IRequest";
import UserModel from "../models/User.model";
import { errorObj } from "../utils/utils";

async function useAuth(req: IRequest, res: Response, next: NextFunction): Promise<void | Response> {
  const token: string = req.cookies.session;
  const secret = String(process.env.JWT_SECRET);

  if (!token) {
    return res.json({ ...errorObj("invalid_token"), invalid_token: true }).status(401);
  }

  try {
    const vToken = jwt.verify(token, secret) as { _id: string };
    const user = await UserModel.findById(vToken._id);

    if (!user) {
      return res.json(errorObj("User was not found")).status(401);
    }

    req.user = user._id;

    next();
  } catch (e) {
    return res.json({ ...errorObj("invalid_token"), invalid_token: true }).status(401);
  }
}

export default useAuth;
