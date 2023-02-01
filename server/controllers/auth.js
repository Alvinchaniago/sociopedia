/* EXTERNAL PACKAGES */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* PROJECT IMPORT */
import User from "../models/User.js";

/* REGISTER FUNCTION */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    /* RANDOM SALT FOR THE PASSWORD ENCRYPTION */
    /* PROVIDE A JWT TOKEN AFTER SUCCESSFUL PASSWORD MATCH */
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    /* DO NOT STORE THE REAL PASSWORD, USE THE HASHED VERSION INSTEAD */
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();

    /* 201 - CREATION SUCCESSFUL */
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGIN FUNCTION */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email,
    });
    if (!user) return res.status(400).json({ message: "User not found" });

    /* MATCH THE PASSWORD THEY SEND THROUGH REQ.BODY & USER.PASSWORD SAVED INSIDE THE DB */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    /* SIGNS AND GIVE THE JWT TOKEN */
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET
    );
    /* DELETE TO PREVENT THE PASSWORD TO BE SENT BACK TO THE FRONT END */
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
