import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";

import { getAuctionsThunk } from "../../store/auction";
import { getItemsThunk } from "../../store/item";

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

    useEffect(() => {
        dispatch(getAuctionsThunk());
        dispatch(getItemsThunk());
    }, [dispatch])


    // currentUser ? console.log("currentUser exists") : history.push("/");

    console.log("all items at auction?", allItems)

    const testTime = "Thu, 20 Jul 2023 16:30:00 GMT"
    const testDateTime = new Date(testTime)

    const nowTime = new Date();

    console.log("nowTime", nowTime)
    console.log("\n\n\nNOWTIME OFFSET", nowTime.getTimezoneOffset())

    console.log("does this work?", testDateTime)

    console.log("getTIme??", nowTime.getTime())

    function timeUTCtoLocal(utcDateTime) {
        const returnDateTime = new Date(utcDateTime);
        return returnDateTime.toString();
    }


    return (
        <>
        <h1>Auction List Page here!</h1>


        <div>
            {allAuctionsList ? allAuctionsList.map((auction) => (
                <>
                <ul key={auction.id}>
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
               {/* <OpenModalButton
                    buttonText="Update Item"
                    modalComponent={<ItemUpdateModal update_item={item}/>}
                />

               <OpenModalButton
                    buttonText="Delete Item"
                    modalComponent={<ItemDeleteModal itemId={item.id}/>}
                /> */}
                </>
            )) : <li>No auctions listed</li>
            }
        </div>
        </>
    )
}


export default LandingPageAuctionList;
