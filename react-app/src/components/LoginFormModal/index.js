import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { Link } from "react-router-dom"
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
        closeModal()
    }
  };

  const handleDemoUser = async (demoUserId) => {
      switch (demoUserId) {
        case 1:
          await dispatch(login('demo@aa.io', 'password'));
          break;
        case 2:
          await dispatch(login('marnie@aa.io', 'password'))
          break;
        case 3:
          await dispatch(login('bobbie@aa.io', 'password'))
          break;
        default:
          console.log("Demo login not working?")
      }
    closeModal()
  }

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <div>
          <br></br>
        </div>

        <button type="submit">Log In</button>
      </form>

          <div className="login-form-demo-users">
        <Link to='/' onClick={() => handleDemoUser(1)}>Demo User 1</Link>


        <Link to='/' onClick={() => handleDemoUser(2)}>Demo User 2</Link>


        <Link to='/' onClick={() => handleDemoUser(3)}>Demo User 3</Link>
          </div>
    </>
  );
}

export default LoginFormModal;
