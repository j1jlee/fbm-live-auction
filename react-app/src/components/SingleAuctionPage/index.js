
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

    const thisAuction = allAuctions ? allAuctions[auctionId] : ""
    const thisItem = allItems && thisAuction ? allItems[thisAuction.auctionItemId] : ''

    const [ boolSwitch, setBoolSwitch ] = useState(true)
    const [bidInput, setBidInput] = useState(0);
    const [ highestBid, setHighestBid ] = useState(thisAuction?.startingBidCents)
    const [errors, setErrors] = useState({})


    console.log("BidLIst?", bidList)

    const sortedBidList = sortBidByTime(bidList)

    console.log("sortedBidList?", sortedBidList)
    // const test1 = bidList ? bidList[0].timeOfBid : '';

    // console.log("test1 gettime?", typeof test1)
    // const test1Date = new Date(test1);
    // console.log("test1 date", test1Date)
    // console.log("gettime", test1Date.getTime())


    // if (!highestBid) {
    //     try{
    //         setHighestBid(thisAuction.startingBidCents)
    //     }
    //     catch {
    //         console.log("useless")
    //     }
    // }

    function sortBidByTime(bids) {
        const tempBidList = [...bids]

        if (tempBidList.length <= 1) {
            return tempBidList;
        }

        tempBidList.sort((a, b) => {
            const aDate = new Date(a.timeOfBid);
            const bDate = new Date(b.timeOfBid);

            const aDateGetTime = aDate.getTime();
            const bDateGetTime = bDate.getTime()

            if (aDateGetTime < bDateGetTime) {
                return -1;
            }
            else if (aDateGetTime > bDateGetTime) {
                return 1;
            } else {
                return 0;
            }
        })
    }

    function bidLogMapper(bids) {
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

            console.log("new highest bid should be", bid.bidAmount)
            setHighestBid(bid.bidAmount);

            console.log("newLog coming through,", newLog);

            console.log("\n\nnewLogs created, what's bidlogs", bidLogs)


            // setBoolSwitch(!boolSwitch);
            const tempBidLogs = [...bidLogs, newLog]

            console.log("\n\n\ntempbidlogs", tempBidLogs);

            setBidLogs([tempBidLogs]);
            // setBidLogs([...bidLogs, newLog]);
            // setBoolSwitch(!boolSwitch);

            // console.log("\n\nsending, bidLogs changed?", bidLogs);

            return;
            // if (chat.chatNum) {
                //     if (chat.chatNum == 2) {
            //         setMessages(messages => [...messages, chat])
            //     }
            // } else return;
            /*
            if (bid.bidderId == auctionId) {
                //new message

                setBidLogs((bidLogs) => [...bidLogs, ])
            }



            */
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

    const sendBid = (e) => {
        e.preventDefault();

        if (!highestBid) {
            try {
                console.log("setting first highest bid")
                setHighestBid(thisAuction.startingBidCents);
            } catch {
                console.log("sending bid, attempting to apply first highest bid")
            }
        }

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

        if (highestBid && (tempBidInput <= highestBid)) {
            tempErrors.highestBid = `Must bid higher than current highest bid: ${String(highestBid).substring(0, String(highestBid).length - 2)}.
            ${String(highestBid).substring(String(highestBid).length - 2)}`
        }

        if (thisAuction && (tempBidInput <= thisAuction.startingBidCents)) {
            tempErrors.highestBid = `Must bid higher than initial bid: ${String(thisAuction.startingBidCents).substring(0, String(thisAuction.startingBidCents).length - 2)}.
            ${String(thisAuction.startingBidCents).substring(String(thisAuction.startingBidCents).length - 2)}`
        }

        if (thisAuction && (tempBidInput < thisAuction.startingBidCents)) {

            console.log("\n\n\nwhat is my bidinput? they think it's lower", tempBidInput)
            console.log("than this", thisAuction.startingBidCents)


            tempErrors.highestBid = `Must bid higher than the starting bid: ${String(thisAuction.startingBidCents).substring(0, String(thisAuction.startingBidCents).length - 2)}. ${String(thisAuction.startingBidCents).substring(String(thisAuction.startingBidCents).length - 2)}`
        }

        if (Object.values(tempErrors).length > 0) {
            setErrors(tempErrors);
            console.log("\n\n\nObject values blah blah", Object.values(tempErrors));setBidInput(0);
            return;
        }

        setHighestBid(tempBidInput);

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
                {bidLogMapper(sortedBidList)}
                </ul>
            </div>
        </div>

        <div className="single-auction-right">

            <div className="single-auction-item-description">{thisItem ? thisItem.description : ''}</div>
            <div className="single-auction-countdown">
            <Countdown
                date={thisAuction.endTime}>
                    <p>Auction Expired</p>
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
