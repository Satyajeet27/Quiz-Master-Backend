import { Router } from "express";
import {
  createQuiz,
  deleteQuiz,
  getQuizes,
  getSingleQuiz,
  updateQuiz,
} from "../controller/quiz.controller";
import authenticate from "../../middleware/authenticate";

const router = Router();

router.post("/", authenticate, createQuiz);
router.get("/:quizId", authenticate, getSingleQuiz);
router.delete("/:quizId", authenticate, deleteQuiz);
router.put("/:quizId", authenticate, updateQuiz);
router.get("/", authenticate, getQuizes);

export default router;
