import React from 'react';
// import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);

	return (
		<>
		<div className="navigation-wrapper">
		<span>LOGO!</span>
		<span></span>
		<span>
		{isLoaded && (
			<ProfileButton user={sessionUser} />
		)}
		</span>
		</div>
		</>

		// <ul>
		// 	{isLoaded && (
		// 		<li className="navigation-li">
		// 			<ProfileButton user={sessionUser} />
		// 		</li>
		// 	)}

		// </ul>
	);
}

export default Navigation;
