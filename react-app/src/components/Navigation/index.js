import React from 'react';
// import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

import { urlToImage } from '../aaaMiddleware';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);

	return (
		<>
		<div className="navigation-wrapper">
		{/* <span>LOGO!</span> */}
		<span className="navigation-img-span">
			<img src="https://github.com/j1jlee/fbm-live-auction/blob/main/images/logo-cut.PNG?raw=true"
			alt="https://github.com/j1jlee/fbm-live-auction/blob/main/images/logo-cut.PNG?raw=true"
			className="navigation-img"

			onError={(e)=> {
				e.currentTarget.src="logo-icon-square.png"
			}}

			></img>
		</span>
		{/* <span></span> */}
		<span className="navigation-user-button">
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
