import React, { useContext, useState } from "react";
import "./comment.scss";
import { AuthContext } from "../../context/AuthContex";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";

const Comment = ({ postId, commentLoading, data }) => {
  const [desc, setDesc] = useState("");

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComment) => makeRequest.post("/comments", newComment),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
      setDesc("");
    },
    onError: (err) => {
      console.error("Comment post error:", err.response?.data || err.message);
    },
  });

  const handleClick = () => {
    if (desc.trim()) {
      mutation.mutate({ desc, postId });
    }
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="Write a comment..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>

      {commentLoading ? (
        <span>Loading comments...</span>
      ) : (
        data.map((comment) => (
          <div className="comment" key={comment.id}>
            <img src={comment.profilePic} alt="" />
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.desc}</p>
            </div>
            <span className="date">{moment(comment.createdAt).fromNow()}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Comment;
