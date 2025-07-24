import { db } from "../connect.js";
import jwt from "jsonwebtoken";
export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = `SELECT * FROM users WHERE id = ?`;

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found");

    const { password, ...info } = data[0];
    return res.status(200).json(info);
  });
};

export const getUsers = (req, res) => {
  const q = `SELECT * FROM users`;
  db.query(q, [], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found");
    const result = data.map(({ password, ...info }) => info);
    return res.status(200).json(result);
  });
};

export const updateuser = (req, res) => {
  const secret = process.env.JWT_SECRET;
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("not authenticated!");

  jwt.verify(token, secret, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not vaild");
    const q =
      "UPDATE users SET `name`=?,`city`=?,`profilePic`=?,`coverPic`=? WHERE id=?";
    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.profilePic,
        req.body.coverPic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("you can update only your post");
      }
    );
  });
};
