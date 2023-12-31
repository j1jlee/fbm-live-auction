import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";


import { getAuctionsThunk } from "../../store/auction";
import { getItemsThunk } from "../../store/item";

import Countdown from 'react-countdown';

import "./LandingPageAuctionList.css"
// import ItemCreateModal from "../ItemCreateModal";
// import ItemDeleteModal from "../ItemDeleteModal";
// import ItemUpdateModal from "../ItemUpdateModal";
// import OpenModalButton from "../OpenModalButton";


function LandingPageAuctionList() {

    const dispatch = useDispatch();
    const allItems = useSelector(state => state.items)
    const allAuctions = useSelector(state => state.auctions)
    // const currentUser = useSelector(state => state.session.user)
    // const history = useHistory();

    // const allItemsList = allItems ? Object.values(allItems) : []
    const allAuctionsList = allAuctions ? Object.values(allAuctions) : []
    const auctionsPassed = []
    const auctionsCurrent = []

    allAuctionsList ? allAuctionsList.forEach((auction) => {
        const nowTime = (new Date()).getTime();
        const auctionEndTime = new Date(auction.endTime);
        if (auctionEndTime.getTime() < nowTime) {
            console.log("time is less?")
            auctionsPassed.push(auction)
        } else {
            auctionsCurrent.push(auction)
        }
    }) : console.log("");

    const sortedAuctionsCurrent = auctionsCurrent.length ? sortAuctions(auctionsCurrent) : [];
    const sortedAuctionsPassed = auctionsPassed.length ? sortAuctions(auctionsPassed) : [];

    useEffect(() => {
        dispatch(getAuctionsThunk());
        dispatch(getItemsThunk());
    }, [dispatch])


    function sortAuctions(auctionList) {
        const tempList = [...auctionList];

        tempList.sort((a, b) => {
            const aTime = (new Date(a.endTime)).getTime();
            const bTime = (new Date(b.endTime)).getTime();

            return aTime - bTime;
        })

        return tempList;
    }



    // currentUser ? console.log("currentUser exists") : history.push("/");

    console.log("all items at auction?", allItems)

    const testTime = "Thu, 20 Jul 2023 16:30:00 GMT"
    const testDateTime = new Date(testTime)
    const nowTime = new Date();

    const history = useHistory();
    // console.log("nowTime", nowTime)
    // console.log("\n\n\nNOWTIME OFFSET", nowTime.getTimezoneOffset())

    // console.log("does this work?", testDateTime)

    // console.log("getTIme??", nowTime.getTime())

    function timeUTCtoLocal(utcDateTime) {
        const returnDateTime = new Date(utcDateTime);
        return returnDateTime.toString();
    }

    function renderAuction(auctionList) {
        return (
            <div className="landing-page-auction-grid">
            {sortedAuctionsCurrent ? sortedAuctionsCurrent.map((auction) => (
            // {allAuctionsList ? allAuctionsList.map((auction) => (
                <>
                <div className="landing-page-auction-node"
                onClick={() => {
                    history.push(`/auction/${auction.id}`)
                }}>


                <ul key={auction.id}>

                <li>
                    <Countdown
                        date={auction.endTime}>
                            <p>Auction Expired</p>
                    </Countdown>

                </li>

                <li>Auction ID: {auction.id}</li>
                <li>Name: {auction.auctionName}</li>
               <li>Description: {auction.auctionDescription}</li>
               <li>Item ID: {auction.auctionItemId}</li>
               <li>Item Name: {allItems ? allItems[auction.auctionItemId].name : "Item Not Found"}</li>

               <li>Open: {auction.auctionOpen === true ? "True" : "False"}</li>

               <li>startTime: {auction.startTime}</li>
               <li>startTimeType: {typeof auction.startTime}</li>
               <li> {timeUTCtoLocal(auction.startTime) }</li>
               <li>endTime: {auction.endTime}</li>
               <li>sellerId: {auction.sellerId}</li>

               <li>Starting Bid: {auction.startingBidCents}</li>
               <li>Current Highest Bid: TBA</li>
               </ul>
               </div>
                </>
            )) : <li>No auctions listed</li>
            }
            </div>
        )
    }


    return (
        <>
        <h1>Auction List Page here!</h1>

        {/* https://www.npmjs.com/package/react-countdown */}
        {/* <div className="landing-page-timer-test">
            <Countdown date={Date.now() + 10000}>
                {<p>Countdown complete??</p>}
                </Countdown>

        </div> */}

        <h2>Current Auctions:</h2>
        <div className="landing-page-auction-wrapper">
            {renderAuction(sortedAuctionsCurrent)}
            {/* <div className="landing-page-auction-grid">
            {sortedAuctionsCurrent ? sortedAuctionsCurrent.map((auction) => (
            // {allAuctionsList ? allAuctionsList.map((auction) => (
                <>
                <div className="landing-page-auction-node"
                onClick={() => {
                    history.push(`/auction/${auction.id}`)
                }}>


                <ul key={auction.id}>

                <li>
                    <Countdown
                        date={auction.endTime}>
                            <p>Auction Expired</p>
                    </Countdown>

                </li>

                <li>Auction ID: {auction.id}</li>
                <li>Name: {auction.auctionName}</li>
               <li>Description: {auction.auctionDescription}</li>
               <li>Item ID: {auction.auctionItemId}</li>
               <li>Item Name: {allItems ? allItems[auction.auctionItemId].name : "Item Not Found"}</li>

               <li>Open: {auction.auctionOpen === true ? "True" : "False"}</li>

               <li>startTime: {auction.startTime}</li>
               <li>startTimeType: {typeof auction.startTime}</li>
               <li> {timeUTCtoLocal(auction.startTime) }</li>
               <li>endTime: {auction.endTime}</li>
               <li>sellerId: {auction.sellerId}</li>

               <li>Starting Bid: {auction.startingBidCents}</li>
               <li>Current Highest Bid: TBA</li>
               </ul>
               </div>


                </>
            )) : <li>No auctions listed</li>
        }
            </div> */}
        </div>


        {/* <OpenModalButton
             buttonText="Update Item"
             modalComponent={<ItemUpdateModal update_item={item}/>}
         />

        <OpenModalButton
             buttonText="Delete Item"
             modalComponent={<ItemDeleteModal itemId={item.id}/>}
         /> */}



        <h2>Previous Auctions:</h2>
        <div className="landing-page-auction-wrapper">
            {renderAuction(sortedAuctionsPassed)}
            {/* <div className="landing-page-auction-grid">
            {sortedAuctionsPassed ? sortedAuctionsPassed.map((auction) => (
            // {allAuctionsList ? allAuctionsList.map((auction) => (
                <>
                <div className="landing-page-auction-node"
                    onClick={() => {
                    history.push(`/auction/${auction.id}`)
                    }}
                >
                <ul key={auction.id}>

                <li>
                    <Countdown
                        date={auction.endTime}>
                            <p>Auction Expired</p>
                    </Countdown>

                </li>

                <li>Auction ID: {auction.id}</li>
                <li>Name: {auction.auctionName}</li>
               <li>Description: {auction.auctionDescription}</li>
               <li>Item ID: {auction.auctionItemId}</li>
               <li>Item Name: {allItems ? allItems[auction.auctionItemId].name : "Item Not Found"}</li>

               <li>Open: {auction.auctionOpen === true ? "True" : "False"}</li>

               <li>startTime: {auction.startTime}</li>
               <li>startTimeType: {typeof auction.startTime}</li>
               <li> {timeUTCtoLocal(auction.startTime) }</li>
               <li>endTime: {auction.endTime}</li>
               <li>sellerId: {auction.sellerId}</li>

               <li>Starting Bid: {auction.startingBidCents}</li>
               <li>Current Highest Bid: TBA</li>
               </ul>
               </div>

                </>
            )) : <li>No auctions listed</li>
            }
            </div> */}
        </div>
        </>
    )
}


export default LandingPageAuctionList;
