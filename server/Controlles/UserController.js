import userModel from "../ModelS/UserModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

// Sign up - Post

export const signUp = async (req, res) => {
  const { avatar, name, email, password, role } = req.body;

  try {
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res
        .status(409)
        .json({ status: 409, message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      avatar,
      name,
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();

    if (!savedUser) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    return res.status(201).json({
      status: 201,
      message: "User created successfully...",
      data: savedUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Sign in - Post

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ status: 401, message: "Invalid password" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .json({ status: 200, message: "User signed in successfully", token });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// User - GET
export const user = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get Users - GET
export const users = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");

    if (!users) {
      return res.status(404).json({ status: 404, message: "Users not found" });
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Update User - PUT // User Update - PUT
export const userUpdate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, avatar } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      { _id: userId },
      {
        name: name,
        email: email,
        avatar: avatar,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(400)
        .json({ status: 400, message: "User was not updated!" });
    }

    res.status(200).json({ status: 200, message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// User Delete - DELETE
export const userDelete = async (req, res) => {
  try {
    const userId = req.user.id;

    const deletedUser = await userModel.findByIdAndDelete({ _id: userId });

    if (!deletedUser) {
      return res
        .status(400)
        .json({ status: 400, message: "User was not deleted!" });
    }

    res.status(200).json({ status: 200, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
