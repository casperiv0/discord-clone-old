import { Router, Response } from "express";
import { compareSync, hashSync } from "bcryptjs";
import { createDiscriminator, errorObj } from "../utils/utils";
import UserModel from "../models/User.model";
import IRequest from "../interfaces/IRequest";
import { useAuth, useToken } from "../hooks";
import logger from "../utils/logger";
const router = Router();

const cookieExpiresIn = 60 * 60 * 1000 * 24 * 7; /* 1week */

router.post("/login", async (req: IRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json(errorObj("Please fill in all fields"));
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.json(errorObj("No user was found with that email"));
  }

  const isPasswordCorrect = compareSync(password, user.password);

  if (!isPasswordCorrect) {
    return res.json(errorObj("Password is incorrect"));
  }

  const token = useToken({ _id: user._id }, cookieExpiresIn / 1000);

  res.cookie("session", token, {
    expires: new Date(Date.now() + cookieExpiresIn),
    httpOnly: true,
  });

  return res.json({
    status: "success",
    user: { _id: user._id },
  });
});

router.post("/register", async (req: IRequest, res: Response) => {
  const { email, username, password, password2 } = req.body;

  if (!email || !username || !password || !password2) {
    return res.json(errorObj("Please fill in all fields"));
  }

  if (password.length < 6) {
    return res.json(errorObj("Password must be more than 6 characters long"));
  }

  if (password !== password2) {
    return res.json(errorObj("Passwords do not match"));
  }

  if (username.length > 50) {
    return res.json(errorObj("Username must be less than 50 characters long"));
  }

  const user = await UserModel.findOne({ email });

  if (user) {
    return res.json(errorObj("That email is already in use"));
  }

  const hash = hashSync(password, 15);
  const discriminator = createDiscriminator();

  const newUser = await UserModel.create({
    password: hash,
    username,
    email,
    discriminator,
  });

  try {
    await newUser.save();
  } catch (e) {
    return res.json(errorObj("An unexpected error occurred, please try again later"));
  }

  const token = useToken({ _id: newUser._id }, cookieExpiresIn / 1000);

  res.cookie("session", token, {
    expires: new Date(Date.now() + cookieExpiresIn),
    httpOnly: true,
  });

  return res.json({ status: "success", user: { _id: newUser._id } });
});

router.post("/user", useAuth, async (req: IRequest, res: Response) => {
  const user = await UserModel.findById(req.user, { username: 1, _id: 1, discriminator: 1 });

  return res.json({ status: "success", user: user });
});

router.delete("/", useAuth, async (req: IRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.json(errorObj("You need to authenticated!"));
    }

    await UserModel.findByIdAndDelete(req.user);

    res.clearCookie("session", {
      httpOnly: true,
    });

    return res.json({
      status: "success",
      msg: "Successfully deleted your account",
    });
  } catch (e) {
    logger.error("DELETE_ACCOUNT", e);
    return res.json(errorObj("An unexpected error occurred"));
  }
});

export default router;
