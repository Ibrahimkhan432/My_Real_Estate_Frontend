import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const signUp = async (req, res) => {
  const { userName, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ userName, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("user created");
  } catch (error) {
    res
      .status(500)
      .json({ error: "User creation failed", message: error.message });
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const isPasswordValid = bcryptjs.compareSync(password, validUser.password);
    if (!isPasswordValid) {
      return next(errorHandler(401, "Wrong Credentials"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // Remove password from the user object before sending response
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(rest);
  } catch (error) {
    res.status(500).json({ error: "Login failed", message: error.message });
  }
  next();
};

export const googleSignIn = async (req, res, next) => {
  try {
    const { user } = req.body;
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      console.log("User already exists");
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      // remove password
      existingUser.password = undefined;
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({ user: existingUser, message: "Login successful" });
    } else {
      console.log("Creating new user");
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).toUpperCase().slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        userName: user.userName.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
        email: user.email,
        password: hashedPassword,
        img: user.img,
      });
      await newUser.save();
      // remove password
      newUser.password = undefined;
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({ user, message: "Login successful" });
    }
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    res
      .status(500)
      .json({ error: "Google Sign-In failed", message: error.message });
    next();
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("access_token").status(200).json("User signed out");
  } catch (error) {
    next(error)
  }

};