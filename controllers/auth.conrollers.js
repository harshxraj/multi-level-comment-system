import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(500).json({ error: "Email already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = new User({ fullname, email, password: hashedPassword });

    const user = await newUser.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    const dataToSend = {
      email: user.email,
      fullname: user.fullname,
      token,
    };
    return res.status(200).json(dataToSend);
  } catch (error) {
    res.status(400).json({ error: "User creation failed", message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    bcrypt.compare(password, existingUser.password, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error occured while login, Please try again!" });
      }
      if (!result) {
        return res.status(403).json({ error: "Incorrect password!" });
      }

      const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET);
      const dataToSend = {
        email: existingUser.email,
        fullname: existingUser.fullname,
        token,
      };
      return res.status(200).json(dataToSend);
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
};
