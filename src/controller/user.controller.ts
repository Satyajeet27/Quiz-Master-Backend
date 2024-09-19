import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../model/user.model";
import jwt from "jsonwebtoken";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send({ message: "All fields are required" });
    }
    if (Number(password.length) < 6) {
      return res
        .status(400)
        .send({ message: "Password should be atleast 6 characters" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .send({ message: "User already exists, please login" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      role: "host",
      password: hashedPassword,
    });
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.log("Error in creating User", error);
    return res.status(500).send("Something went wrong with user creation api");
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Invalid email or password" });
    }
    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return res.status(400).send({ message: "Invalid email or password" });
    }
    const payload = { sub: user._id, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string);
    const domain = process.env.CLIENT?.split("//").at(-1);
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        domain,
        sameSite: "lax",
      })
      .send({ message: "Logged in successfull", token });
  } catch (error) {
    console.log("Error in User login", error);
    return res.status(500).send("Something went wrong with user login api");
  }
};
export const logout = async (req: Request, res: Response) => {
  try {
    return res.clearCookie("token").send({ message: "Logout Successfully" });
  } catch (error) {
    console.log("Error in logout", error);
    return res.status(500).send("Something went wrong with logout api");
  }
};
