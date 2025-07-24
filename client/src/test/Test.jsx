import { useEffect, useState } from "react";
import "./test.scss";
import { makeRequest } from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const Test = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);

  const [texts, setTexts] = useState({
    name: "",
    city: "",
    website: "",
  });

  useEffect(() => {
    setTexts({
      name: user.name || "",
      city: user.city || "",
      website: user.website || "",
    });
  }, [user]);

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data.fileUrl.split("/").pop();
    } catch (err) {
      console.error("Upload error:", err);
      return "";
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (user) => makeRequest.put("/users", user),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
    onError: (err) => {
      console.error("Post error:", err.response?.data || err.message);
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    let coverUrl;
    let profileUrl;

    if (cover) coverUrl = cover ? await upload(cover) : user.coverPic;
    if (profile) profileUrl = profile ? await upload(profile) : user.profilePic;

    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
    setOpenUpdate(false);
  };

  return (
    <div className="update">
      <div className="wrapper">
        <form>
          <input
            type="file"
            placeholder="upload your new Cover Pic"
            onChange={(e) => setCover(e.target.files[0])}
          />
          <input
            type="file"
            placeholder="upload your new profile Pic"
            onChange={(e) => setProfile(e.target.files[0])}
          />
          <input
            type="text"
            name="name"
            value={texts.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="city"
            value={texts.city}
            onChange={handleChange}
          />
          <input
            type="text"
            name="website"
            value={texts.website}
            onChange={handleChange}
          />
          <button type="submit" onClick={handleClick}>
            Update
          </button>
        </form>
        <button type="button" onClick={() => setOpenUpdate(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
};
