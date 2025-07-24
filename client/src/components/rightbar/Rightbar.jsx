import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "./rightbar.scss";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/AuthContex";
import { useContext } from "react";

export default function Rightbar() {
  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();
  const { isLoading: loadingFollowings, data: followings } = useQuery({
    queryKey: ["followings"],
    queryFn: () =>
      makeRequest
        .get(`/relationships?userId=${currentUser.id}`)
        .then((res) => res.data),
  });

  const { isLoading, data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: () => makeRequest.get(`/users`).then((res) => res.data),
  });

  const { mutate } = useMutation({
    mutationFn: (data) => makeRequest.post("/relationships", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["followings"]);
    },
    onError: (err) => {
      console.error("Post error:", err.response?.data || err.message);
    },
  });

  if (isLoading || loadingFollowings) {
    return <div>loading</div>;
  }

  console.log({ followings });
  return (
    <div className="rightbar">
      <div className="container">
        <div className="item">
          <span>Suggestion For You</span>
          {usersData.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <img src={"/upload/" + user.profilePic} alt="" />
                <span>{user.name}</span>
              </div>
              <div className="buttons">
                <button
                  onClick={() =>
                    mutate({
                      userId: currentUser.id,
                      followingId: user.id,
                    })
                  }
                >
                  {followings.includes(user.id) ? "unfollow" : "follow"}
                </button>
               
              </div>
            </div>
          ))}
        </div>
      
      </div>
    </div>
  );
}
