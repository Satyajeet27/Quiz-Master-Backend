import { Request, Response } from "express";
import Quiz from "../model/quiz.model";
import Question from "../model/question.model";
import Exam from "../model/exam.model";

export const createQuiz = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).send({ message: "All fields required" });
    }
    await Quiz.create({ title, description, host: req.userId });
    res.status(201).send({ message: "Quiz created" });
  } catch (error) {
    console.log("Create Quiz Error", error);
    res
      .status(500)
      .send({ message: "Something went wrong on create quiz api" });
  }
};

export const getQuizes = async (req: Request, res: Response) => {
  try {
    const quizes = await Quiz.find({ host: req.userId });
    // console.log(quizes);
    if (!quizes) {
      return res.status(400).send({ message: "No Quizes created" });
    }
    return res.send(quizes);
  } catch (error) {
    console.log("Create Quiz Error", error);
    res.status(500).send({ message: "Something went wrong on quiz api" });
  }
};

export const getSingleQuiz = async (req: Request, res: Response) => {
  try {
    //   console.log(req.userId);
    const { quizId } = req.params;
    const quiz = await Quiz.findOne({ _id: quizId });
    // console.log(quiz);
    if (!quiz) {
      return res.status(400).send({ message: "No Quiz found" });
    }
    return res.send(quiz);
  } catch (error) {
    console.log("Create Quiz Error", error);
    res
      .status(500)
      .send({ message: "Something went wrong on single quiz api" });
  }
};

export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;
    const studentExist = await Exam.find({ quizId });
    if (studentExist.length) {
      return res
        .status(404)
        .send({ message: "Cannot delete quiz: Student data exists." });
    }
    await Question.deleteMany({ quiz: quizId });
    await Quiz.findByIdAndDelete({ _id: quizId });
    return res.status(200).send({ message: "Succesfully deleted!" });
  } catch (error) {
    console.log("Create Quiz Error", error);
    res
      .status(500)
      .send({ message: "Something went wrong on delete quiz api" });
  }
};

export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const { quizId } = req.params;
    await Quiz.findByIdAndUpdate(
      { _id: quizId },
      {
        $set: {
          title,
          description,
        },
      }
    );
    res.status(200).send({ message: "Quiz updated!" });
  } catch (error) {
    console.log("Update Quiz Error", error);
    res
      .status(500)
      .send({ message: "Something went wrong on update quiz api" });
  }
};
