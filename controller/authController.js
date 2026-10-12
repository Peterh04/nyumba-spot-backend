import User from "../models/User.js";
import { checkPositiveNumberFields } from "../utils/validation/checkPositiveNumberFields.js";
import { checkRequiredFields } from "../utils/validation/checkRequiredFields.js";
import { checkStringFields } from "../utils/validation/checkStringFields.js";
import checkIntegerFields from "../utils/validation/checkIntegerFields.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const fields = {
      name,
      email,
      password,
    };

    const invalidRequiredFields = checkRequiredFields(fields);

    if (invalidRequiredFields.length > 0)
      return res.status(400).json({
        message: "Missing required fields",
        fields: invalidRequiredFields,
      });

    const invaidStringFields = checkStringFields(fields);

    if (invaidStringFields.length > 0)
      return res.status(400).json({
        message: "Invalid String fields",
        fields: invaidStringFields,
      });

    let modifiedName = name.trim().split(/\s+/);
    const lastName = modifiedName[1];

    if (lastName === undefined)
      return res
        .status(400)
        .json({ message: "Please provide your first name and surname" });

    let modifiedEmail = email.toLowerCase().trim();

    if (!validator.isEmail(modifiedEmail))
      return res.status(400).json({ message: "Invalid email format" });

    if (password.length < 8 || password.length > 20)
      return res.status(400).json({
        message:
          "Password should have a minimum of 8 characters and a maximum of 20 characters",
      });

    const passwordRequirements = {
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialCharacter: /[^A-Za-z0-9]/.test(password),
    };

    if (passwordRequirements.uppercase === false)
      return res
        .status(400)
        .json({ message: "Password should contain an upperCase character" });

    if (passwordRequirements.lowercase === false)
      return res
        .status(400)
        .json({ message: "Password should contain a lowercase character" });

    if (passwordRequirements.number === false)
      return res
        .status(400)
        .json({ message: "Password should contain a number character" });

    if (passwordRequirements.specialCharacter === false)
      return res
        .status(400)
        .json({ message: "Password should contain a special character" });

    const existingUser = await User.findOne({
      where: {
        email: modifiedEmail,
      },
      attributes: ["id"],
    });

    if (existingUser)
      return res.status(409).json({
        message: "User already exists. Please login",
      });

    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: modifiedName.join(" "),
      email: modifiedEmail,
      password: hashPassword,
    });
    res.status(201).json({ message: "Successfully created the user" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const fields = {
      email,
      password,
    };

    const invalidRequiredFields = checkRequiredFields(fields);

    if (invalidRequiredFields.length > 0)
      return res.status(400).json({
        message: "Missing required fields",
        fields: invalidRequiredFields,
      });

    const invaidStringFields = checkStringFields(fields);

    if (invaidStringFields.length > 0)
      return res.status(400).json({
        message: "Invalid String fields",
        fields: invaidStringFields,
      });

    const modifiedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      where: { email: modifiedEmail },
    });

    if (!user)
      return res.status(404).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    if (user.email_verified === false)
      return res.status(409).json({ message: "Please verify account" });

    const simplifiedUser = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    const token = jwt.sign(simplifiedUser, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const refresh_token = jwt.sign(
      simplifiedUser,
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      // secure: false, //cause I am still on development not yet hosted the backend
      // sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Successfully logged in",
      token,
      user: simplifiedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to login user" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refresh_token", {
      httpOnly: true,
      // secure: false, //cause I am still on development not yet hosted the backend
      // sameSite: "none",
    });

    res.status(200).json({ message: "Successfully logout user" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to logout user" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refresh_token;
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized : No refresh_token" });

    const user = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const simplifiedUser = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    const newToken = jwt.sign(simplifiedUser, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ token: newToken });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid or expired refresh_token" });
  }
};
