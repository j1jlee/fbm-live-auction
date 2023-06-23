
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getAuctionsThunk } from "../../store/auction"
import { getItemsThunk } from "../../store/item"
import { getBidsThunk, createBidThunk, deleteJunkThunk } from "../../store/bid"

import { useHistory } from "react-router-dom";

import Countdown from "react-countdown";

import "./SingleAuctionPage.css"

//websocket???
import { io } from 'socket.io-client';
let socket;


function SingleAuctionPage() {

    const dispatch = useDispatch();
    // const [ bidLogs, setBidLogs] = useState([]);
    const [ numSwitch, setNumSwitch ] = useState(0)
    const [ boolSwitch, setBoolSwitch ] = useState(true)

    useEffect(() => {
        dispatch(getAuctionsThunk());
        dispatch(getItemsThunk());
        dispatch(getBidsThunk());
        // dispatch(getBidsThunk());
    }, [dispatch, boolSwitch, numSwitch])



    // useEffect(() => {
    //     dispatch(getBidsThunk());
    // }, [boolSwitch])


    const currentUser = useSelector(state => state.session.user)
    const { auctionId } = useParams();

    const allAuctions = useSelector(state => state.auctions)
    const allItems = useSelector(state => state.items)
    const allBids = useSelector(state => state.bids)

    const bidList = allBids ? Object.values(allBids) : [];
    const thisAuctionBidList = allBids ? Object.values(allBids).filter((bid) => {
        return bid.auctionId == auctionId
    }) : [];

    const thisAuction = allAuctions ? allAuctions[auctionId] : ""
    const thisItem = allItems && thisAuction ? allItems[thisAuction.auctionItemId] : ''

    const [bidInput, setBidInput] = useState(0);
    // const [ highestBid, setHighestBid ] = useState(thisAuction?.startingBidCents)
    const [auctionOver, setAuctionOver] = useState(false);
    const [errors, setErrors] = useState({})

    console.log("BidLIst?", bidList)
    console.log("pre sort thisauctionbidlist?", thisAuctionBidList)
    const sortedBidList = sortBidByTime(thisAuctionBidList)


    console.log("sortedBidList?", sortedBidList)
    console.log("thisItem?", thisItem)
    console.log("thisAuction?", thisAuction)


    // const history = useHistory();
    // if (!currentUser) {
    //     history.push("/");
    //     alert("Logged out! Redirecting to Main Page.");
    // }
    //
    //
    //HELPER FUNCTIONS
    function sortBidByTime(bids) {
        const tempBidList = [...bids]

        if (tempBidList.length <= 1) {
            return tempBidList;
        }

        const sortedTempBidList = tempBidList.sort((a, b) => {
            const aDate = new Date(a.timeOfBid);
            const bDate = new Date(b.timeOfBid);

            const aDateGetTime = aDate.getTime();
            const bDateGetTime = bDate.getTime()

            // console.log("in sortBidByTime, aDate, bdate", aDateGetTime, bDateGetTime)


            if (aDateGetTime < bDateGetTime) {
                return -1;
            }
            else if (aDateGetTime > bDateGetTime) {
                return 1;
            } else {
                return 0;
            }
        })
        return sortedTempBidList;
    }

    function bidLogMapper(bids) {
        if (!bids) {
            return (<li>No bids yet!</li>)
        }

        if (bids.length === 0) {
            return (<li>No current bids!</li>);
        }

        return ( bids.map((bid) => {
            let bidderVar = "You";
            if (!currentUser || bid.bidderId !== currentUser.id) {
                bidderVar = `User ${bid.bidderId}`
            }

            return (<li>{bidderVar} bid {centsToDollars(bid.bidAmountCents)}</li>)

        }))
    }

    function getHighestBid(bids) {
        let tempHighestBid = thisAuction.startingBidCents;

        // if (!bids) {
        //     console.log("No bids yet");
        //     return tempHighestBid
        // }

        for (let bid of bids) {
            if (bid.bidAmountCents > tempHighestBid) {
                tempHighestBid = bid.bidAmountCents;
            }
        }

        return tempHighestBid;
    }

    function junkBid() {
        const newDate = new Date();

        const junkBid = {
            auctionId: -1,
            bidderId: -1,
            timeOfBid: newDate.toString(),
            bidAmountCents: -1
        }

        return junkBid;
    }

    function newBid() {
        const newDate = new Date();

        const tempNewBid = {
            auctionId,
            bidderId: currentUser.id,
            timeOfBid: newDate.toString(),
            bidAmountCents: Math.floor(bidInput * 100)
        }

        return tempNewBid;
    }

    function centsToDollars(cents) {
        return `${String(cents).substring(0, String(cents).length - 2)}.${String(cents).substring(String(cents).length - 2)}`
    }

    function reasonBidDisabled() {
        if (!currentUser) {
            return ("Please login to participate in Bid");
        }
        if (currentUser.id == thisAuction.sellerId) {
            return ("This is your auction! ")
        }
        if (auctionOver == true) {
            return ("Cannot bid -- auction over!")
        }
        return ""
    }

    function resolveAuction(resAuctionId) {
        // const resThisAuction = allAuctions ? allAuctions[auctionId] : ""
        setAuctionOver(true);

        if (thisAuction.auctionOpen == false) {
            console.log(`Auction ${thisAuction.auctionId} is already closed! Skipping;`)
            return;
        }

        if (!thisAuctionBidList.length) {
            console.log(`Closing: No bids for ${thisAuction.auctionId}, setting auction to "Open: false`)

            //TODO: update auction to open:False
            return;
        }


        console.log("\n\n\npre-finding highest bid", thisAuctionBidList)
        console.log("\n\n\npre-finding highest bid", thisAuctionBidList)

        let highestBid = {bidAmountCents: 0};
        let latestBid = {timeOfBid: "Thu 01 Jan 1970 00:00:00 GMT"};
        for (let bid of thisAuctionBidList) {
            console.log("individual bids,", bid)

            if (bid.bidAmountCents > highestBid.bidAmountCents) {
                highestBid = bid;
            }
            const bidDate = new Date(bid.timeOfBid);
            const latestDate = new Date(latestBid.timeofBid);

            if (bidDate.getTime() > latestDate.getTime()) {
                latestBid = bid;
            }
        }

        console.log("highest bid:", highestBid)
        console.log("latest bid:", latestBid)

        // if (resThisAuction.auctionOpen == true) {
        //     console.log("\n\n\nthis auction is open, with timer over! closing:")
        // }
        console.log("\n\n\nthis auction is open, with timer over! closing:")



    }

    //END OF HELPER FUNCTIONS
    //
    //


    useEffect(() => {

        socket = io();
        //receiving
        socket.on("bidEvent", (bid) => {
            console.log("\n\n\nBID?", bid)

            if (bid.socketAuctionId == auctionId) {
                //trigger refresh?
                console.log("socketAuctionId matches auctionId, refresh")

                // const tempBool = boolSwitch;
                setBoolSwitch(!boolSwitch)

                // const testNum = numSwitch;
                // setNumSwitch(testNum + 1);
                // // dispatch(getBidsThunk);

                dispatch(createBidThunk(junkBid()));

                dispatch(deleteJunkThunk())

                dispatch(getBidsThunk())
            }
            return;

        })
        // when component unmounts, disconnect
        return (() => {
            socket.disconnect()
        })
    }, [])
    // }, [dispatch])






    const updateBidInput = (e) => (
        setBidInput(e.target.value)
        )

    const sendBid = (e) => {
        e.preventDefault();

        setErrors({});
        const tempErrors = {};

        console.log("\n\n\nstarting sendBid, tempErrors should be empty", tempErrors)

        console.log("bidInput before?", bidInput)

        const tempBidInput = bidInput * 100;

        // console.log("bidinput??", typeof bidInput)
        if (tempBidInput <= 0) {
            // console.log("bidinput is equal or less than zero")
            tempErrors.tempBidInput = "Can't bid a zero/negative amount"
        }

        if (String(bidInput).length > 6) {
            tempErrors.bidInput = "Can't bid over six figures"
        }

        const currentHighestBid = getHighestBid(thisAuctionBidList) //sortedBidList

        if (tempBidInput <= currentHighestBid) {
            tempErrors.currentHighestBid = `Must bid higher than ${centsToDollars(currentHighestBid)}`
        }


        if (Object.values(tempErrors).length > 0) {
            setErrors(tempErrors);
            return;
        }

        const sendBid = newBid();

        dispatch(createBidThunk(sendBid))
        .then(console.log("bid creating?"))
        .then(socket.emit("bidEvent", { socketAuctionId: thisAuction.id, bidderId: currentUser.id, bidAmount: parseInt(bidInput * 100), localHighestBid: tempBidInput})
        )


        setBidInput(0);
        return;
    }

    // console.log("all auctions?", allAuctions)
    // console.log("this auction?", thisAuction)
    // console.log("this item?", thisItem)
    // console.log("current highest bid?", highestBid)
    // console.log("bidLogs?", bidLogs)

    return (
        <>
        <h1>{thisAuction ? thisAuction.auctionName : ""}</h1>

        <div className="single-auction-grid">

        <div className="single-auction-left">
            <div>{thisItem ? thisItem.name : ''} </div>
            <div className="single-auction-image">
                IMAGE
            </div>
            <div className="single-auction-bidfeed">
                <ul>
                {sortedBidList ? bidLogMapper(sortedBidList) : <li>None yet!</li>}
                </ul>
            </div>
        </div>

        <div className="single-auction-right">

            <div className="single-auction-item-description">{thisItem ? thisItem.description : ''}</div>
            <div className="single-auction-countdown">
            {thisAuction ? <Countdown
                date={thisAuction.endTime}
                // onComplete={resolveAuction(auctionId)}>
                onComplete={thisAuction && (() => resolveAuction(auctionId))}>
                    <p>Auction Over!</p>
            </Countdown> : <p></p>}
            </div>

            <div className="single-auction-highest">Highest Bid: {centsToDollars(getHighestBid(thisAuctionBidList))}</div>
           <div className="single-auction-bidform">

            {reasonBidDisabled() ?
                <div className="single-auction-reason-block">{reasonBidDisabled()}</div> :
            <>
            <form onSubmit={sendBid}>
                <input
                    type="number"
                    step="0.01"
                    value={bidInput}
                    onChange={updateBidInput}
                />
                <button type="submit">Send Bid</button>
            </form>
                <div>
                {Object.values(errors).length ? Object.values(errors).map((error) => {
                   return <p key={error}>{error}</p>
                }) : ""}
                </div>
            </>

                }


           </div>

        </div>
        </div>





        </>
    )
}

export default SingleAuctionPage;
