import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { UnauthenticatedError } from "../errors/customErrors.js";
import { createJWT } from "../utils/tokenUtils.js";

export const register = async (req, res) => {
  // FIRST REGISTERED USER IS ADMIN
  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? "admin" : "user";

  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;
  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: "user created" });
};

export const login = async (req, res) => {
  // CHECK IF USER EXISTS
  // IF WE GET THE USER WE HAVE ACCESS TO USER OBJECT
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new UnauthenticatedError("Invalid Credentials");
  // CHECK IF PASSWORD IS CORRECT
  const isPasswordCorrect = await comparePassword(
    req.body.password,
    user.password
  );
  if (!isPasswordCorrect) throw new UnauthenticatedError("Invalid Credentials");

  // JWT TOKEN
  const token = createJWT({
    userId: user._id,
    role: user.role,
  });

  const oneDay = 1000 * 60 * 60 * 24;

  // SET COOKIE
  res.cookie("token", token, {
    // RETURNS THE COOKIE WITH EVERY REQUEST
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });

  res.status(StatusCodes.CREATED).json({ msg: "user logged in" });
};

export const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};

// ONE-LINER WITH AND OPERATOR

// const isValidUser = user && (await comparePassword(password, user.password));
// if (!isValidUser) throw new UnauthenticatedError('invalid credentials');
