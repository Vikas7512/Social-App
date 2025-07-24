import { useQuery } from "@tanstack/react-query";
import { Post } from "../post/Post";
import { PostSkeleton } from "../post/PostSkeleton";
import "./post.scss";
import { makeRequest } from "../../axios";

export const Posts = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: () => makeRequest.get("/posts").then((res) => res.data),
  });
  if (isLoading) {
    return (
      <div className="posts">
        {[1, 2, 3, 4, 5].map((x) => (
          <PostSkeleton key={x} />
        ))}
      </div>
    );
  }

  if (error) return <div className="posts">Error loading posts</div>;

  return (
    <div className="posts">
      {data && data.map((post) => <Post post={post} key={post.postId} />)}
    </div>
  );
};
