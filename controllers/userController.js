import { StatusCodes } from "http-status-codes";

// MODEL IMPORT
import Job from "../models/JobMOdel.js";
import User from "../models/UserModel.js";

import cloudinary from "cloudinary";
// FILE SYSTEM MODULE
// WERE USING PROMISE IN ORDER TO USE ASYNC AWAIT INSTEAD OF CALLBACKnewUser
import { promises as fs } from "fs";

// CURRENT USER
export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

// APPLICATION STATS
export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments();
  const jobs = await Job.countDocuments();
  res.status(StatusCodes.OK).json({ users, jobs });
};

// UPDATE USER
export const updateUser = async (req, res) => {
  // console.log(req.file);
  const newUser = { ...req.body };
  delete newUser.password;

  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
    newUser.avatar = response.secure_url;
    newUser.avatarPublicId = response.public_id;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser);

  if (req.file && updatedUser.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId);
  }

  res.status(StatusCodes.OK).json({ msg: "update user" });
};
