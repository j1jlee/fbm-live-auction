import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import "./NavSideBar.css";


function NavSideBar({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);

    console.log("nav sidebar!!! isLoaded??", isLoaded)

	return (
		<div className="navsidebar-wrapper">
        <ul>

			<li>
				<NavLink exact to="/">Home</NavLink>
			</li>
            {sessionUser ? (
			<li>
				<NavLink exact to="/items">Items</NavLink>
			</li>
            ) : "Items Disabled"}
		</ul>
        </div>
	);
}

export default NavSideBar;
