import mongoose from "mongoose";

export type AnswerType = {
  answer: string;
  questionId: {
    correctAnswer: string;
    questionText: string;
    _id?: string;
  };
};

export type StudentAnswerSubmitType = {
  answer: Array<AnswerType>;
  studentId: {
    studentEmail: string;
    _id: string;
  };
  marksObtained?: number;
  quizId: object;
};

const examSchema = new mongoose.Schema<StudentAnswerSubmitType>(
  {
    answer: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "question",
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },

    marksObtained: {
      type: Number,
      default: 0,
    },

    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },
  },
  { timestamps: true }
);

const Exam = mongoose.model<StudentAnswerSubmitType>("exam", examSchema);
export default Exam;
