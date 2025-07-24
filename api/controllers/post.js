import moment from "moment/moment.js";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not vaild!");

    const q = `
         SELECT 
    p.id AS postId,
    p.desc,
    p.img,
    u.name,
    u.id as userId,
    p.createdAt,
    u.profilePic
    FROM posts p
    JOIN users u ON u.id = p.userId
    WHERE p.userId = ?
    OR p.userId IN (
       SELECT r.followingId  
       FROM relationship r 
       WHERE r.userId = ?
   )
   ORDER BY p.createdAt DESC;

            
`;

    db.query(q, [userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not vaild!");

    const q =
      "INSERT INTO posts (`desc`,`img`,`createdAt`,`userId`) VALUES (?)";

    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:MM:SS"),
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("post has been created");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not vaild!");

    const q = "DELETE FROM posts WHERE `id`= ? AND `userId`=?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("post has been delete");
      return res.status(403).json("you can delete only your post");
    });
  });
};
