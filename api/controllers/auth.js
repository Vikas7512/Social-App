import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const { username, email, password, name } = req.body;

  // Validate input
  if (!username || !email || !password || !name) {
    return res.status(400).json("All fields are required.");
  }

  // Check if user exists
  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [username], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.length) return res.status(409).json("User already exists!");

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Insert new user
    const q =
      "INSERT INTO users (`username`, `email`, `password`, `name`) VALUES (?)";
    const values = [username, email, hashedPassword, name];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";
  const secret = process.env.JWT_SECRET;

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.length === 0) {
      return res.status(404).json("User not found");
    }

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json("Wrong password or username!");
    }

    const token = jwt.sign({ id: data[0].id }, secret);

    const { password, ...others } = data[0];

    return res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been Logged out.");
};
