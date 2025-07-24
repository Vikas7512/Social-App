import { Link } from "react-router-dom";
import "./register.scss";
import { useState } from "react";
import axios from "axios";

export const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });

  const [err, setErr] = useState(null);

  const handleChanged = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/auth/register", inputs);
      setErr(null);
      alert("Registration successful. You can now login.");
    } catch (err) {
      setErr(err.response?.data || "Something went wrong.");
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Social App</h1>
          <p>
            Connect, share, and engage with your friends and community using our
            vibrant social media platform.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChanged}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChanged}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChanged}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChanged}
            />
            {err && (
              <span style={{ color: "red", fontSize: "14px" }}>{err}</span>
            )}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};
