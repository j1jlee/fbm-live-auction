import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';


import ItemCreateModal from "../ItemCreateModal";

import "./NavSideBar.css";
import OpenModalButton from '../OpenModalButton';


function NavSideBar({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);

    // console.log("nav sidebar!!! isLoaded??", isLoaded)

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

            <li>
                <OpenModalButton
                    buttonText="+ Create New Item"
                    modalComponent={<ItemCreateModal />}
                />
            </li>
		</ul>
        </div>
	);
}

export default NavSideBar;
