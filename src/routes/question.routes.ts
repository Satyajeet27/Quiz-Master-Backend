import { Router } from "express";
import {
  createQuestions,
  deleteQuestion,
  getQuestionsByQuizId,
  updateQuestion,
} from "../controller/question.controller";
import authenticate from "../../middleware/authenticate";

const router = Router();

router.post("/:quizId", authenticate, createQuestions);
router.get("/:quizId", authenticate, getQuestionsByQuizId);
router.delete("/:questionId", authenticate, deleteQuestion);
router.put("/:questionId", authenticate, updateQuestion);

export default router;
