import mongoose from "mongoose";

type StudentType = {
  studentUsername: string;
  studentEmail: string;
  quiz: object;
};

const studentSchema = new mongoose.Schema<StudentType>(
  {
    studentUsername: {
      type: String,
      required: true,
    },
    studentEmail: {
      type: String,
      required: true,
      unique: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "quiz",
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("student", studentSchema);
export default Student;
