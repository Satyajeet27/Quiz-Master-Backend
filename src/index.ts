import express from "express";
import quizRoute from "./routes/quiz.routes";
import userRoute from "./routes/user.routes";
import questionRoute from "./routes/question.routes";
import examRoute from "./routes/exam.routes";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT,
    credentials: true,
  })
);

app.get("/test", (req, res) => {
  res.send({ message: "Hello from server" });
});

//auth check

interface JwtPayload {
  email: string;
  // Add any other properties that your JWT payload includes
}

app.get("/api/v1/auth/check", (req, res) => {
  const token = req.cookies.token;
  // console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  try {
    const data = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as JwtPayload;
    res.status(200).json({ message: "Authenticated", email: data.email });
  } catch (error) {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/quiz", quizRoute);
app.use("/api/v1/question", questionRoute);
app.use("/api/v1/exam", examRoute);

export default app;
