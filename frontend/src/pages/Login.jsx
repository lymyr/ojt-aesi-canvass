import { useState } from "react";
import { useNavigate } from "react-router-dom";
import s from "./Login.module.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await onLogin?.({ username, password });
      navigate("/canvass");
    } catch (err) {
      alert("Login failed.");
    }
  };

  return (
    <div className={s.container}>
      <form onSubmit={handleSubmit} className={s.form}>
        <h2 className={s.title}>CaTinko Login</h2>

        <label className={s.label}>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={s.input}
            required
          />
        </label>

        <label className={s.label}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={s.input}
            required
          />
        </label>

        <button type="submit" className={s.button}>Log In</button>
      </form>
    </div>
  );
}

export default Login;
