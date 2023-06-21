import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';


import ItemCreateModal from "../ItemCreateModal";
import AuctionCreateModal from '../AuctionCreateModal';

import "./NavSideBar.css";
import OpenModalButton from '../OpenModalButton';


function NavSideBar({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);

    // console.log("nav sidebar!!! isLoaded??", isLoaded)

	return (
		<div className="navsidebar-wrapper">

        <h2 className="navsidebar-title">Live Auction</h2>

        <ul>

			<li>
				<NavLink exact to="/">Auctions</NavLink>
			</li>
            {sessionUser ? (
			<li>
				<NavLink exact to="/items">Items</NavLink>
			</li>
            ) : <li><a>Items Disabled</a></li> }

            <li>
                <OpenModalButton
                    buttonText="+ Create New Item"
                    modalComponent={<ItemCreateModal />}
                />
            </li>

            <li>
                <OpenModalButton
                    buttonText="+ Schedule New Auction"
                    modalComponent={<AuctionCreateModal />}
                />
            </li>

            {/* <li>
				<NavLink to="/test">Countdown Test</NavLink>
			</li> */}


		</ul>
        </div>
	);
}

export default NavSideBar;
