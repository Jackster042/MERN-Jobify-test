import {
  UnauthenticatedError,
  BadRequestError,
} from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new UnauthenticatedError("Authentication invalid");

  try {
    const { userId, role } = verifyJWT(token);
    // CREATE VARIABLE TO SEE IF USERID CHECK TEST USER ID
    const testUser = userId === "66642352562ba3fa5511375b";
    req.user = { userId, role, testUser };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

export const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError("Demo User. Read Only!");
  }
  next();
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthenticatedError("Unauthorized to access this route");
    }
    next();
  };
};
