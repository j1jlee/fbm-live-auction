import React from 'react';
// import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

import { useHistory } from 'react-router-dom';

import { urlToImage } from '../aaaMiddleware';
import WalletDisplay from './WalletDisplay';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);

	const history = useHistory();

	return (
		<>
		<div className="navigation-wrapper">
		{/* <span>LOGO!</span> */}
		<span className="navigation-img-span">
			<img src="https://github.com/j1jlee/fbm-live-auction/blob/main/images/logo-cut.PNG?raw=true"
			alt="https://github.com/j1jlee/fbm-live-auction/blob/main/images/logo-cut.PNG?raw=true"
			className="navigation-img"

			onClick={() => history.push('/')}

			onError={(e)=> {
				e.currentTarget.src="logo-icon-square.png"
			}}

			></img>
		</span>
		{/* <span></span> */}

		<div className="navigation-wallet-and-user">
			<span className="navigation-wallet">
				{isLoaded && (<WalletDisplay user={sessionUser} />)}
			</span>

			<span className="navigation-user-button">
				{isLoaded && (
					<ProfileButton user={sessionUser} />
				)}

			</span>
		</div>


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
