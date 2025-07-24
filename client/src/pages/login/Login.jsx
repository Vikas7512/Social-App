import { Link, useNavigate } from "react-router-dom";
import "./login.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContex";
import { useState } from "react";

export function Login() {
  const { login } = useContext(AuthContext);

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const handleChanged = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate("/");
    } catch (err) {
      setErr(err.response.data);
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Hello World</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit,
            sunt? Voluptatem, modi dolores voluptas facilis ratione animi
            accusantium deleniti facere architecto fugit ex laudantium harum
            perferendis fugiat sequi magni rerum.
          </p>
          <span>Don't you have an account ?</span>
          <Link
            to={{
              pathname: "/register",
            }}
          >
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChanged}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChanged}
            />
            {err && err}
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
