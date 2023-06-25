import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";


import { getAuctionsThunk, closeAuctionThunk } from "../../store/auction";
import { getItemsThunk, tradeItemThunk } from "../../store/item";
import { getBidsThunk } from "../../store/bid";


import OpenModalButton from "../OpenModalButton";
import AuctionUpdateModal from "../AuctionUpdateModal";
import AuctionDeleteModal from "../AuctionDeleteModal";

import { centsToDollars } from "../aaaMiddleware";
import { urlToImage } from "../aaaMiddleware";
import { createAuctionThunk } from "../../store/auction";

import { sortBidByTime } from "../aaaMiddleware";

import Countdown from 'react-countdown';

import { imageHandle } from "../aaaMiddleware";

import "./LandingPageAuctionList.css"
// import ItemCreateModal from "../ItemCreateModal";
// import ItemDeleteModal from "../ItemDeleteModal";
// import ItemUpdateModal from "../ItemUpdateModal";
// import OpenModalButton from "../OpenModalButton";


function LandingPageAuctionList() {

    const dispatch = useDispatch();
    const allItems = useSelector(state => state.items)
    const allAuctions = useSelector(state => state.auctions)
    const allBids = useSelector(state => state.bids)
    // const currentUser = useSelector(state => state.session.user)
    // const history = useHistory();

    // const allItemsList = allItems ? Object.values(allItems) : []
    const allAuctionsList = allAuctions ? Object.values(allAuctions) : []
    const allItemsList = allItems ? Object.values(allItems) : []
    const auctionsPassed = []
    const auctionsCurrent = []

    const [switchBool, setSwitchBool] = useState(true);

    allAuctionsList ? allAuctionsList.forEach((auction) => {
        const nowTime = (new Date()).getTime();
        const auctionEndTime = new Date(auction.endTime);
        if (auctionEndTime.getTime() < nowTime) {
            //console.log("time is less?")
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
        dispatch(getBidsThunk());
    }, [dispatch, switchBool])


    function sortAuctions(auctionList) {
        const tempList = [...auctionList];

        tempList.sort((a, b) => {
            const aTime = (new Date(a.endTime)).getTime();
            const bTime = (new Date(b.endTime)).getTime();

            return aTime - bTime;
        })

        return tempList;
    }

    const demoSubmit = (demoSellerId) => {

        const timeNow = new Date();
        const timePlusMinute = new Date(timeNow.getTime() + 60000);

        const timeNowString = timeNow.toString();
        const timePlusMinuteString = timePlusMinute.toString();

        const demoAuction = {
          auctionName: "Demo Auction",
          auctionDescription: "This is a demo auction!",
          startingBidCents: 100,
          startTime: timeNowString,
          endTime: timePlusMinuteString,
          auctionItemId: allItemsList[0].id,
          sellerId: demoSellerId
        }

        dispatch(createAuctionThunk(demoAuction));
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

        // const tempDateTime = ''
        /* const dateTimeStr = returnDateTime.toString();
        return dateTimeStr.split(" ").slice(1, -1).join(" ")  */
        const dateTimeStr = returnDateTime.toString();
        // return dateTimeStr.split(" (").slice(0, -1).join(" ").split(" ").slice(1, -1).join(" ")
        return dateTimeStr.split(":").slice(0, -1).join(":").split(" ").slice(1).join(" ")
        // return returnDateTime.toString();
    }

    // function renderAuction(auctionList) {
    //     return (
    //         <div className="landing-page-auction-grid">
    //         {auctionList ? auctionList.map((auction) => (
    //         // {sortedAuctionsCurrent ? sortedAuctionsCurrent.map((auction) => ( */}
    //         // {allAuctionsList ? allAuctionsList.map((auction) => (
    //             <>
    //             <div className="landing-page-auction-node"
    //             onClick={() => {
    //                 history.push(`/auction/${auction.id}`)
    //             }}>


    //             <ul key={auction.id}>

    //             <li>
    //                 <Countdown
    //                     date={auction.endTime}>
    //                         <p>Auction Expired</p>
    //                 </Countdown>

    //             </li>

    //             <li>Auction ID: {auction.id}</li>
    //             <li>Name: {auction.auctionName}</li>
    //            <li>Description: {auction.auctionDescription}</li>
    //            <li>Item ID: {auction.auctionItemId}</li>
    //            <li>Item Name: {allItems ? allItems[auction.auctionItemId].name : "Item Not Found"}</li>

    //            <li>Open: {auction.auctionOpen === true ? "True" : "False"}</li>

    //            <li>startTime: {auction.startTime}</li>
    //            <li>startTimeType: {typeof auction.startTime}</li>
    //            <li> {timeUTCtoLocal(auction.startTime) }</li>
    //            <li>endTime: {auction.endTime}</li>
    //            <li>sellerId: {auction.sellerId}</li>

    //            <li>Starting Bid: {auction.startingBidCents}</li>
    //            <li>Current Highest Bid: TBA</li>
    //            </ul>
    //            </div>
    //             </>
    //         )) : <li>No auctions listed</li>
    //         }
    //         </div>
    //     )
    // }

    function pastTime(time) {

        const defTime = new Date(time);
        const timeMilli = defTime.getTime();

        const timeNow = new Date;
        const timeNowMilli = timeNow.getTime();

        if (timeMilli < timeNowMilli) {
            //console.log("timeMilli, timenowMilli", timeMilli, timeNowMilli)
            return true;
            // return "update-disabled";
        } else {
            return false;
            // return ""
        }
    }


    function resolveAuction(resAuctionId) {

        const thisAuction = allAuctions[resAuctionId];

        if (thisAuction.auctionOpen == false) {
            console.log(`Auction ${resAuctionId} is already closed! Skipping;`)
            return;
        }

        const thisAuctionBidList = allBids ? Object.values(allBids).filter((bid) => {
            return bid.auctionId == resAuctionId
        }) : [];


        if (!thisAuctionBidList.length) {
            console.log(`Closing: No bids for ${resAuctionId}, setting auction to "Open: false`)
            dispatch(closeAuctionThunk(thisAuction.id))
            //TODO: update auction to open:False
            return;
        }

        const sortedBidList = sortBidByTime(thisAuctionBidList)

        const lastBid = sortedBidList.length ? sortedBidList[sortedBidList.length - 1] : "nothing?"

        // console.log("\n\n\nlastBid found", lastBid)
        // if (resThisAuction.auctionOpen == true) {
        //     console.log("\n\n\nthis auction is open, with timer over! closing:")
        // }

        //trade item and close auction
        //HERE YALL
        dispatch(tradeItemThunk(thisAuction.auctionItemId,
            {
                lastKnownPriceCents : lastBid.bidAmountCents,
                 ownerId: lastBid.bidderId
            }
        ))
        .then(dispatch(closeAuctionThunk(thisAuction.id)))
        .then(
            // alert(congratsOrSorry(lastBid))
            console.log(`Traded item for auction ${thisAuction.id} to user ${lastBid.bidderId}`)
            )
        .then(dispatch(setSwitchBool(!switchBool)))

        console.log("\n\n\nthis auction is open, with timer over! closing:")
    }




    function renderAuctionNew(auctionList) {
        return (
            <>
           <div className="landing-page-auction-grid">

           {auctionList.map((auction) => (
            <>
            <div className="landing-page-auction-node"
            >

            <div className="landing-page-auction-node-link" onClick={() => {
                history.push(`/auction/${auction.id}`)
            }}>

            <div className="landing-page-auction-new-node-image">
                {/* item image? */}
                {allItems ?
                // allItems[auction.auctionItemId].imageUrl
                    imageHandle(allItems[auction.auctionItemId].imageUrl)

                : "Item Not Found"}</div>

            <div>
            {pastTime(auction.startTime) ?
                <>
                <div>
                <Countdown
                    date={auction.endTime}
                    onComplete={() => {
                        resolveAuction(auction.id)
                        // (setSwitchBool(!switchBool))
                    }
                    }>
    {/* ALSO HANDLE "STILL OPEN AUCTIONS, DEFINE WINNER, GIVE ITEM, ETC" */}
                    <p>Auction Expired</p>
                </Countdown>

                </div>
                <br></br>
                </>

            :
                <>
                <p className="landing-page-auction-node-start">Starting at: {timeUTCtoLocal(auction.startTime)}</p>
                <div className="landing-page-hidden">
                    <Countdown
                            date={auction.startTime}
                            onComplete={() => {setSwitchBool(!switchBool)}}
                    >
                         <div className="landing-page-inner-show">
                         <Countdown
                            date={auction.endTime}
                            onComplete={() => {setSwitchBool(!switchBool)}}>
                             <p>Auction Expired</p>
                        </Countdown>
                        </div>

                    </Countdown>

                </div>
                </>

        }
            </div>


            <div>$ {centsToDollars(auction.startingBidCents)}</div>
            <div>{auction.auctionName}</div>
            <div>{auction.auctionDescription}</div>

            </div>

            <span className={pastTime(auction.startTime) ? "update-disabled" : ""}>
            <OpenModalButton
            buttonText="Update Auction"
            modalComponent={<AuctionUpdateModal update_auction={auction} />} />
            </span>

            <span className={pastTime(auction.startTime) ? "update-disabled" : ""}>
            <OpenModalButton
            buttonText="Delete Auction"
            modalComponent={<AuctionDeleteModal auctionId={auction.id} />} />
            </span>

            <span className={pastTime(auction.endTime) ? "" : "update-disabled"}>
            <OpenModalButton
            buttonText="Delete Auction"
            modalComponent={<AuctionDeleteModal auctionId={auction.id} />} />
            </span>

            </div>


            </>
           ))
            }

            </div>
            </>
        )
    }


    return (
        <>
        {/* <h1>Auction List Page here!</h1> */}

        <h2>Today's picks</h2>
        <div>
            <button onClick={() => demoSubmit(2)}>Create Demo Auction (from User 2)</button>
        </div>
        <div className="landing-page-auction-wrapper">
            {renderAuctionNew(sortedAuctionsCurrent)}
            {/* {renderAuction(sortedAuctionsCurrent)} */}
        </div>

        <br></br>
        <hr></hr>
        <br></br>

        <h2>Past Auctions:</h2>
        <div className="landing-page-auction-wrapper">
            {renderAuctionNew(sortedAuctionsPassed)}
        </div>
        </>
    )
}


export default LandingPageAuctionList;
