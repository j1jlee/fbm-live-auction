import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
//
/* <i className="fa-solid fa-shop navsidebar-auction-icon"></i> */

import ItemCreateModal from "../ItemCreateModal";
import AuctionCreateModal from '../AuctionCreateModal';

import "./NavSideBar.css";
import OpenModalButton from '../OpenModalButton';



function NavSideBar({ isLoaded }){
    const sessionUser = useSelector(state => state.session.user);

    // console.log("nav sidebar!!! isLoaded??", isLoaded)
    function noUserDisable() {
        if (!sessionUser) {
            return ("navsidebar-hidden")
        }
        else {
            return ""
        }
    }

	return (
		<div className="navsidebar-wrapper">

        <h2 className="navsidebar-title">Live Auction</h2>

        <ul>

			<li>
				<NavLink exact to="/"> Auctions</NavLink>
			</li>
            {sessionUser ? (
			<li>
				<NavLink exact to="/items">Items</NavLink>
			</li>
            ) : <li><a id="navsidebar-items-disabled">Login to see Items</a></li> }

            <li className={noUserDisable()}>
                <OpenModalButton
                    buttonText="+ Create New Item"
                    modalComponent={<ItemCreateModal />}
                />
            </li>

            <li className={noUserDisable()}>
                <OpenModalButton
                    buttonText="+ Schedule New Auction"
                    modalComponent={<AuctionCreateModal />}
                />
            </li>

            <br></br>
            <hr></hr>
            <br></br>
            <li>
                <NavLink exact to="/howtobid">How To Bid</NavLink>
            </li>
            <li>
                <NavLink exact to="/about">About</NavLink>
            </li>


            {/* <li>
				<NavLink to="/test">Countdown Test</NavLink>
			</li>

            <li>
				<NavLink to="/test2">Socket Test</NavLink>
			</li> */}


		</ul>
        </div>
	);
}

export default NavSideBar;
