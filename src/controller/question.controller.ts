import { Request, Response } from "express";
import Question from "../model/question.model";
import Student from "../model/student.model";
import Exam from "../model/exam.model";

export const createQuestions = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;
    // console.log(req.body);
    const questions = await Question.create({
      ...req.body,
      quiz: Object(quizId),
    });
    res.status(201).send(req.body);
  } catch (error) {
    console.log("Create Quiz Error", error);
    res
      .status(500)
      .send({ message: "Something went wrong on create quiz api" });
  }
};

export const getQuestionsByQuizId = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;
    const questions = await Question.find({ quiz: quizId }).populate({
      path: "quiz",
      select: "title description",
    });
    if (!questions) {
      return res.status(400).send({ message: "No Questions created" });
    }
    return res.send(questions);
  } catch (error) {
    console.log("Create Quiz Error", error);
    res
      .status(500)
      .send({ message: "Something went wrong on get question by quidId api" });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const { questionId } = req.params;
    console.log(questionId);
    const studentExist = await Exam.find({
      answer: {
        $elemMatch: {
          questionId,
        },
      },
    });
    // console.log("student delete", studentExist);
    if (studentExist.length) {
      return res
        .status(404)
        .send({ message: "Cannot delete question: Student data exists." });
    }
    await Question.findByIdAndDelete({ _id: questionId });
    return res.status(200).send({ message: "Succesfully deleted!" });
  } catch (error) {
    console.log("Create Quiz Error", error);
    res
      .status(500)
      .send({ message: "Something went wrong on delete question api" });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const { questionText, option, correctAnswer } = req.body;
    const { questionId } = req.params;

    if (!questionText.trim() || !correctAnswer.trim() || !option.length) {
      return res.status(400).send({ message: "All fields are required" });
    }
    const question = await Question.findById({ _id: questionId });
    if (!question) {
      return res
        .status(400)
        .send({ message: "Invalid question update request" });
    }

    await Question.updateOne(
      { _id: questionId },
      { $set: { questionText, correctAnswer, option } }
    );
    res.status(200).send({ message: "Question updated succeffully" });
  } catch (error) {
    console.log("Update Quiz Error", error);
    res
      .status(500)
      .send({ message: "Something went wrong on update question api" });
  }
};
