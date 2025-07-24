import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Posts } from "../../components/posts/Posts";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContex";
import { useContext } from "react";
import { useState } from "react";
import { Test } from "../../test/Test";

export const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [openUpdate, setOpenUpdate] = useState(false);

  const userId = useLocation().pathname.split("/")[2];

  const { isLoading, error, data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => makeRequest.get(`/users/${userId}`).then((res) => res.data),
  });

  const { data: relationship } = useQuery({
    queryKey: ["relationship", userId],
    queryFn: () =>
      makeRequest
        .get(`/relationships?followedUserId=${userId}`)
        .then((res) => res.data),
  });

  const handleFollow = () => {};

  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <div>Error loading user data</div>;

  return (
    <>
      <div className="profile">
        <div className="images">
          <img src={"/upload/" + data.coverPic} alt="Cover" className="cover" />
          <img
            src={"/upload/" + data.profilePic}
            alt="Profile"
            className="profilePic"
          />
        </div>
        <div className="profileContainer">
          <div className="uInfo">
            <div className="left">
              <a href="http://facebook.com">
                <FacebookTwoToneIcon fontSize="large" />
              </a>
              <a href="http://instagram.com">
                <InstagramIcon fontSize="large" />
              </a>
              <a href="http://twitter.com">
                <TwitterIcon fontSize="large" />
              </a>
              <a href="http://linkedin.com">
                <LinkedInIcon fontSize="large" />
              </a>
              <a href="http://pinterest.com">
                <PinterestIcon fontSize="large" />
              </a>
            </div>
            <div className="center">
              <span>{data.name}</span>
              <div className="info">
                <div className="item">
                  <PlaceIcon />
                  <span>{data.city || "Unknown"}</span>
                </div>
                <div className="item">
                  <LanguageIcon />
                  <span>{data.website || "Not provided"}</span>
                </div>
              </div>
              {parseInt(userId) === currentUser.id ? (
                <button onClick={() => setOpenUpdate(true)}>Update</button>
              ) : (
                <button onClick={handleFollow}>
                  {relationship?.some(
                    (rel) => rel.followerUserId === currentUser.id
                  )
                    ? "Following"
                    : "Follow"}
                </button>
              )}
            </div>
            <div className="right">
              <EmailOutlinedIcon />
              <MoreVertIcon />
            </div>
          </div>
          <Posts />
        </div>
        {openUpdate && <Test setOpenUpdate={setOpenUpdate} user={data} />}
      </div>
    </>
  );
};
