import { Router } from "express";
import {
  createStudent,
  displayQuestion,
  studentAnswer,
  studentAuthCheck,
  submitAnswer,
} from "../controller/exam.controller";
import authenticate from "../../middleware/authenticate";

const router = Router();

router.post("/:quizId/register", createStudent);
router.get("/auth/check", studentAuthCheck);
router.get("/:quizId", displayQuestion);
router.post("/:quizId", submitAnswer);
router.get("/:quizId/student", authenticate, studentAnswer);

export default router;
