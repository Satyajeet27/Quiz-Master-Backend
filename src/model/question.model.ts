import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "quiz",
  },
  option: [{ type: String, required: true }],
  correctAnswer: {
    type: String,
    require: true,
  },
});

const Question = mongoose.model("question", questionSchema);
export default Question;
