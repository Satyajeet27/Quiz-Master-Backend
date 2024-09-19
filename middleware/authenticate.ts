import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    // console.log("middleware token", token);
    if (!token) {
      return res.sendStatus(401);
    }
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    // console.log(verifyToken);
    if (!verifyToken) {
      return res.sendStatus(401);
    }
    req.userId = verifyToken.sub as string;
    // return res.send("test");
    next();
  } catch (error) {
    console.log("Error in authentication", error);
    res.status(500).send("Something went wrong in authetication middleware");
  }
};
export default authenticate;
