import { Router } from "express";
import {
  validateJobInput,
  validateIdParam,
} from "../middleware/validationMiddleware.js";
const router = new Router();

import {
  getAllJobs,
  createJob,
  getSingleJob,
  updateJob,
  deleteJob,
  showStats,
} from "../controllers/jobController.js";
import { checkForTestUser } from "../middleware/authMiddleware.js";

// router.get("/", gettAllJobs);
// router.post("/", createJob);
// router.get("/:id", getSingleJob);
// router.patch("/:id", updateJob);
// router.delete("/:id", deleteJob);

router
  .route("/")
  .get(getAllJobs)
  .post(checkForTestUser, validateJobInput, createJob);

router.route("/stats").get(showStats);

router
  .route("/:id")
  .get(validateIdParam, getSingleJob)
  .patch(checkForTestUser, validateJobInput, validateIdParam, updateJob)
  .delete(checkForTestUser, validateIdParam, deleteJob);

export default router;
