import mongoose from "mongoose";
import { QuizType } from "../../types/types";

const quizSchema = new mongoose.Schema<QuizType>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    uniqueLink: {
      type: String,
    },
  },
  { timestamps: true }
);
const Quiz = mongoose.model<QuizType>("quiz", quizSchema);

export default Quiz;
