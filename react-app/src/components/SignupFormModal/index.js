import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");

	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState([]);
	const { closeModal } = useModal();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password === confirmPassword) {

			const cashCents = 10000;

			const data = await dispatch(signUp(username, email, password, firstname, lastname, cashCents));
			if (data) {
				setErrors(data);
			} else {
				closeModal();
			}
		} else {
			setErrors([
				"Confirm Password field must be the same as the Password field",
			]);
		}
	};

	console.log("signup errors?", errors)

	return (
		<>
		<div className="sign-up-modal">
			<h1>Sign Up</h1>
			<form onSubmit={handleSubmit}>
				<ul className="modal-errors">
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
						// required
					/>
				</label>
				{/* <div>
					{errors['email'] ? errors['email'] : ''}
				</div> */}


				<label>
					Username
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						// required
					/>
				</label>

				<label>
					First Name
					<input
						type="text"
						value={firstname}
						onChange={(e) => setFirstname(e.target.value)}
						// required
					/>
				</label>

				<label>
					Last Name
					<input
						type="text"
						value={lastname}
						onChange={(e) => setLastname(e.target.value)}
						// required
					/>
				</label>


				<label>
					Password
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						// required
					/>
				</label>
				<label>
					Confirm Password
					<input
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						// required
					/>
				</label>
				<div>
					<br></br>
				</div>
				<button type="submit">Sign Up</button>
			</form>
		</div>
		</>
	);
}

export default SignupFormModal;
