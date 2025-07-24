import { db } from "../connect.js";

// Toggle Follow / Unfollow
export const followUnfollowUser = (req, res) => {
  const { userId, followingId } = req.body;

  const checkQuery = `
    SELECT followingId FROM relationship 
    WHERE userId = ? and followingId = ?
  `;

  db.query(checkQuery, [userId, followingId], (err, data) => {
    if (err) {
      return res.status(500).json("Error checking relationship.");
    }

    if (data.length > 0) {
      // Already following → Unfollow
      const deleteQuery = `
        DELETE FROM relationship 
        WHERE userId = ? and followingId = ?
      `;

      db.query(deleteQuery, [userId, followingId], (err) => {
        if (err) return res.status(500).json("Failed to unfollow user.");
        return res.status(200).json("You unfollowed this user.");
      });
    } else {
      // Not following → Follow
      const insertQuery = `
        INSERT INTO relationship (userId, followingId) 
        VALUES (?, ?)
      `;

      db.query(insertQuery, [userId, followingId], (err) => {
        if (err) return res.status(500).json("Failed to follow user.");
        return res.status(201).json("You started following this user.");
      });
    }
  });
};

// Get Followers by User ID
export const getFollowers = (req, res) => {
  const userId = req.query.userId;

  const query = `
    SELECT followingId
    FROM relationship 
    where userId = ?
  `;

  db.query(query, [userId], (err, data) => {
    if (err) {
      return res.status(500).json("Failed to fetch followers.");
    }

    return res.status(200).json(data.map((x) => x.followingId));
  });
};
