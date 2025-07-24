import "./post.scss";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Comment from "../comments/Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/AuthContex";

export const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery({
    queryKey: ["likes", post.postId],
    queryFn: () =>
      makeRequest.get(`/likes?postId=${post.postId}`).then((res) => res.data),
  });

  const { mutate } = useMutation({
    mutationFn: (data) => makeRequest.post("/likes", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["likes"]);
    },
    onError: (err) => {
      console.error("Post error:", err.response?.data || err.message);
    },
  });

  const { isLoading: commentLoading, data: commentData } = useQuery({
    queryKey: ["comments", post.postId],

    queryFn: () =>
      makeRequest
        .get(`/comments?postId=${post.postId}`)
        .then((res) => res.data),
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: (postId) => makeRequest.delete(`/posts/${postId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["likes"]);
    },
    onError: (err) => {
      console.error("Post error:", err.response?.data || err.message);
    },
  });

  if (isLoading) {
    return <div>Loading</div>;
  }

  const handleDelete = (postId) => {
    deleteMutate(postId);
  };

  return (
    <>
      <div className="post">
        <div className="container">
          <div className="user">
            <div className="userInfo">
              <img src={"/upload/" + post.profilePic} alt="" />
              <div className="details">
                <Link
                  to={`/profile/${post.userId}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span className="name">{post.name}</span>
                </Link>
                <span className="date">{moment(post.createdAt).fromNow()}</span>
              </div>
            </div>
            <MoreHorizOutlinedIcon onClick={() => setMenu(!menu)} />
            {menu && (
              <button onClick={() => handleDelete(post.postId)}>Delete</button>
            )}
          </div>
          <div className="content">
            <p>{post.desc}</p>
            {post.img && <img src={`/upload/${post.img}`} alt="Post" />}
          </div>
          <div className="info">
            <div className="item">
              {data.includes(currentUser.id) ? (
                <FavoriteOutlinedIcon
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() =>
                    mutate({
                      userId: currentUser.id,
                      postId: post.postId,
                    })
                  }
                />
              ) : (
                <FavoriteBorderOutlinedIcon
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    mutate({
                      userId: currentUser.id,
                      postId: post.postId,
                    })
                  }
                />
              )}
              {data.length} likes
            </div>

            <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
              <TextsmsOutlinedIcon />
              {commentLoading ? 0 : commentData.length}
            </div>
            <div className="item">
              <ShareOutlinedIcon />
              Share
            </div>
          </div>
          {commentOpen && (
            <Comment
              postId={post.postId}
              commentLoading={commentLoading}
              data={commentData}
            />
          )}
        </div>
      </div>
    </>
  );
};
