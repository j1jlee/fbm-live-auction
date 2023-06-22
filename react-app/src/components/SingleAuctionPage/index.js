
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getAuctionsThunk } from "../../store/auction"
import { getItemsThunk } from "../../store/item"
import { getBidsThunk, createBidThunk } from "../../store/bid"
import Countdown from "react-countdown";

import "./SingleAuctionPage.css"

//websocket???
import { io } from 'socket.io-client';
let socket;


function SingleAuctionPage() {

    const dispatch = useDispatch();
    const [ bidLogs, setBidLogs] = useState([]);

    useEffect(() => {
        dispatch(getAuctionsThunk());
        dispatch(getItemsThunk());
        dispatch(getBidsThunk());
    }, [dispatch])
    // }, [dispatch, bidLogs])


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

    const [ boolSwitch, setBoolSwitch ] = useState(true)
    const [bidInput, setBidInput] = useState(0);
    const [ highestBid, setHighestBid ] = useState(thisAuction?.startingBidCents)
    const [errors, setErrors] = useState({})

    console.log("BidLIst?", bidList)
    console.log("pre sort thisauctionbidlist?", thisAuctionBidList)
    const sortedBidList = sortBidByTime(thisAuctionBidList)


    console.log("sortedBidList?", sortedBidList)
    console.log("thisItem?", thisItem)
    console.log("thisAuction?", thisAuction)





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

            console.log("in sortBidByTime, aDate, bdate", aDateGetTime, bDateGetTime)


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
            if (bid.bidderId !== currentUser.id) {
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

    function newBid() {
        const newDate = new Date();

        const tempNewBid = {
            auctionId,
            bidderId: currentUser.id,
            timeOfBid: newDate.toString(),
            bidAmountCents: bidInput * 100
        }

        return tempNewBid;
    }

    function centsToDollars(cents) {
        return `${String(cents).substring(0, String(cents).length - 2)}.${String(cents).substring(String(cents).length - 2)}`
    }

    useEffect(() => {

        socket = io();
        //receiving
        socket.on("bidEvent", (bid) => {
            console.log("pre-bid bidlogs", bidLogs)
            console.log("\n\n\nBID?", bid)
            //socketAuctionId, bidderId, bidAmount, localHighestBid
            let newLog = "";
            // console.log("\n\n\nbid.bidderId?", bid.bidderId);
            // console.log("\n\n\ncurrentUser.Id?", currentUser.id);
            if (bid.bidderId == currentUser.id) {
                newLog = `You made the highest bid, with ${centsToDollars(bid.bidAmount)}!`
            } else {
                newLog = `User ${bid.bidderId} bid ${centsToDollars(bid.bidAmount)}!`
            }

            /* socketAuctionId: thisAuction.id, bidderId: currentUser.id, bidAmount: tempBidInput, localHighestBid: tempBidInput */
            //trigger refresh ONLY if auctionId is this iD
            return;

        })
        // when component unmounts, disconnect
        return (() => {
            socket.disconnect()
        })
        /*
        @socketio.on("bidEvent")
        def handle_bid(data):
        emit("bidEvent", data, broadcast=True)
 */
    }, [])
    // }, [dispatch])






    const updateBidInput = (e) => (
        setBidInput(e.target.value)
        )

    const sendBid = async (e) => {
        e.preventDefault();

        setErrors({});
        const tempErrors = {};

        console.log("\n\n\nstarting sendBid, tempErrors should be empty", tempErrors)
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

        // if (!sortedBidList.length) {
        //     console.log("First bid ever")
        //     const firstBid = newBid();
        //     await dispatch(createBidThunk(firstBid))
        //     return;
        // }
        const sendBid = newBid();
        await dispatch(createBidThunk(sendBid))

        socket.emit("bidEvent", { socketAuctionId: thisAuction.id, bidderId: currentUser.id, bidAmount: tempBidInput, localHighestBid: tempBidInput});

        setBidInput(0);
        return;
    }

    // console.log("all auctions?", allAuctions)
    // console.log("this auction?", thisAuction)
    // console.log("this item?", thisItem)
    // console.log("current highest bid?", highestBid)
    console.log("bidLogs?", bidLogs)

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
                {/* BID FEED */}
                {/* {bidLogs.map((log) => (
                    <div>
                        {`${log}`}
                        </div>
                ))
                } */}
                <ul>
                {sortedBidList ? bidLogMapper(sortedBidList) : <li>None yet!</li>}
                </ul>
            </div>
        </div>

        <div className="single-auction-right">

            <div className="single-auction-item-description">{thisItem ? thisItem.description : ''}</div>
            <div className="single-auction-countdown">
            <Countdown
                date={thisAuction.endTime}
                onComplete={<p>Auction Expired</p>}>

            </Countdown>
            </div>

            <div className="single-auction-highest">HIGHEST BID BY WHOM</div>
           <div className="single-auction-bidform">
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

           </div>

        </div>
        </div>





        </>
    )
}

export default SingleAuctionPage;
