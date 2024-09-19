import { Request, Response } from "express";
import Student from "../model/student.model";
import jwt from "jsonwebtoken";
import Question from "../model/question.model";
import Exam, { StudentAnswerSubmitType } from "../model/exam.model";

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { studentEmail, studentUsername } = req.body;
    const { quizId } = req.params;
    const existingStudent = await Student.findOne({ studentEmail });
    if (existingStudent) {
      return res.status(400).send({ message: "Student already exists" });
    }
    const student = await Student.create({
      studentUsername,
      studentEmail,
      quiz: quizId,
    });
    const payload = { sub: student._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string);
    return res
      .status(201)
      .cookie("exam_session", token, { httpOnly: true, secure: true })
      .send({ message: "student profile created" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Something went wrong with create student api" });
  }
};

export const studentAuthCheck = async (req: Request, res: Response) => {
  try {
    const token = req.cookies["exam_session"];
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    try {
      jwt.verify(token, process.env.JWT_SECRET_KEY as string);
      res.status(200).json({ message: "Authenticated" });
    } catch (error) {
      res.status(401).json({ message: "Not authenticated" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Something went wrong with student auth check api" });
  }
};

export const displayQuestion = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;
    // console.log(quizId);
    const questions = await Question.find({ quiz: quizId }).select(
      "-correctAnswer -updatedAt -createdAt"
    );
    // console.log(questions);
    if (questions.length === 0) {
      return res.status(400).send({ message: "no question created" });
    }
    return res.status(200).send(questions);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Something went wrong with display question api" });
  }
};

export const submitAnswer = async (req: Request, res: Response) => {
  try {
    const answer = req.body;
    const studentId = jwt.decode(req.cookies.exam_session)?.sub;
    const { quizId } = req.params;
    // console.log(answer, studentId, quizId);
    const haveSubmittedAnswer = await Exam.findOne({ studentId });
    // console.log("submit", haveSubmittedAnswer);
    if (haveSubmittedAnswer && haveSubmittedAnswer?.answer.length !== 0) {
      return res.status(400).send({ message: "Already submitted the answer" });
    }
    const exam = await Exam.create({ answer, studentId, quizId });

    // console.log(exam);
    res
      .status(200)
      .clearCookie("exam_session")
      .send({ message: "Exam Completed successflly!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Something went wrong with submitAnswer api" });
  }
};

type AnswerType = {
  answer: string;
  questionId: {
    correctAnswer: string;
    questionText: string;
    _id: string;
  };
};

export const studentAnswer = async (req: Request, res: Response) => {
  try {
    let { quizId } = req.params;

    // const student = await Student.find({ quiz: quizId });
    const answers = await Exam.find({ quizId })
      .populate({
        path: "studentId",
        select: "studentEmail",
      })
      .populate({
        path: "answer",
        populate: {
          path: "questionId",
          select: "questionText correctAnswer",
        },
      });
    // console.log(answers);
    answers.forEach((answer) => {
      let count = 0;
      if (answer.answer.length > 0) {
        answer.answer.forEach((ans) => {
          if (ans.answer === ans.questionId?.correctAnswer) {
            count++;
          }
        });
        answer.marksObtained = count;
        answer.save();
      }
    });
    if (!answers || answers.length === 0) {
      return res
        .status(400)
        .send({ message: "No Students have given exam yet" });
    }
    return res.status(200).send({ students: answers });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Something went wrong with studentAnswer api" });
  }
};
