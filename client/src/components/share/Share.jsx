import "./share.scss";
import Image from "../../asset/img.png";
import Friend from "../../asset/friend.png";
import Map from "../../asset/map.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContex";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Share = () => {
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost) => makeRequest.post("/posts", newPost),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (err) => {
      console.error("Post error:", err.response?.data || err.message);
    },
  });

  // Upload image to server and return just the file name
  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      const fileUrl = res.data.fileUrl; // e.g. "/upload/1234.jpg"
      return fileUrl.split("/").pop(); // returns "1234.jpg"
    } catch (err) {
      console.error("Upload error:", err);
      return "";
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!desc) {
      alert("can not post empty");
      return;
    }

    let imgUrl = "";
    if (file) {
      imgUrl = await upload(); // gets just filename
    }

    const pad = (n) => (n < 10 ? "0" + n : n);
    const now = new Date();
    const createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
      now.getSeconds()
    )}`;

    mutation.mutate({
      desc,
      img: imgUrl,
      createdAt,
      userId: currentUser.id,
    });

    // Reset form
    setDesc("");
    setFile(null);
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <img src={"/upload/" + currentUser.profilePic} alt="" />
          <input
            type="text"
            value={desc}
            placeholder={`What's on your mind ${currentUser.name}?`}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        {file && (
          <div className="preview">
            <img src={URL.createObjectURL(file)} alt="preview" />
          </div>
        )}

        <hr />

        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
