import { db } from "../connect.js";

// Get all likes for a post
export const getLikes = (req, res) => {
  const q = `SELECT userId FROM likes WHERE postId = ?`;

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((like) => like.userId));
  });
};

// Toggle like/unlike
export const likePost = (req, res) => {
  const { userId, postId } = req.body;

  // Check if already liked
  const checkQuery = `SELECT * FROM likes WHERE userId = ? AND postId = ?`;
  db.query(checkQuery, [userId, postId], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.length > 0) {
      // Already liked => unlike
      const deleteQuery = `DELETE FROM likes WHERE userId = ? AND postId = ?`;
      db.query(deleteQuery, [userId, postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post unliked");
      });
    } else {
      // Not liked => like
      const insertQuery = `INSERT INTO likes (userId, postId) VALUES (?, ?)`;
      db.query(insertQuery, [userId, postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post liked");
      });
    }
  });
};
