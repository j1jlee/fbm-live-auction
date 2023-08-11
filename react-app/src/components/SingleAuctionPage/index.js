
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getAuctionsThunk, closeAuctionThunk } from "../../store/auction"
import { getItemsThunk, tradeItemThunk } from "../../store/item"
import { getBidsThunk, createBidThunk, deleteJunkThunk } from "../../store/bid"
import { editWalletThunk, getUserThunk } from "../../store/session";

import { useHistory } from "react-router-dom";

import Countdown from "react-countdown";

import { imageHandle } from "../aaaMiddleware";

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
    const [chatMessage, setChatMessage] = useState("");

    const [chatLog, setChatLog] = useState([]);

    // const [ highestBid, setHighestBid ] = useState(thisAuction?.startingBidCents)
    const [auctionStarted, setAuctionStarted] = useState(false);
    const [auctionOver, setAuctionOver] = useState(false);
    const [errors, setErrors] = useState({})

    // console.log("BidLIst?", bidList)
    // console.log("pre sort thisauctionbidlist?", thisAuctionBidList)
    const sortedBidList = sortBidByTime(thisAuctionBidList)

    const testBidChatList = sortBidByTime([...thisAuctionBidList, ...chatLog])
    // console.log("test testBidChatList", testBidChatList)

    // console.log("sortedBidList?", sortedBidList)
    // console.log("thisItem?", thisItem)
    // console.log("thisAuction?", thisAuction)

    // console.log("chatLog?", chatLog)
    // const history = useHistory();
    // if (!currentUser) {
    //     history.push("/");
    //     // alert("Logged out! Redirecting to Main Page.");
    // }


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

    // function bidLogMapper(bids) {
    //     if (!bids) {
    //         return (<li>No bids yet!</li>)
    //     }

    //     if (bids.length === 0) {
    //         return (<li>No current bids!</li>);
    //     }

    //     return ( bids.map((bid) => {
    //         let bidderVar = "You";
    //         let youOrOther = "single-auction-you"
    //         if (!currentUser || bid.bidderId !== currentUser.id) {
    //             bidderVar = `User ${bid.bidderId}`
    //             youOrOther = "single-auction-other"
    //         }

    //         return (<li className="youOrOther">{bidderVar} bid {centsToDollars(bid.bidAmountCents)}</li>)

    //     }))
    // }

    function bidChatMapper(entries) {
        if (!entries) {
            return (<li>No bids yet!</li>)
        }

        if (entries.length === 0) {
            return (<li>No current bids!</li>);
        }

        return ( entries.map((entry) => {
            let userLabel = "You";
            let auctionEntryClass = "single-auction-bid-you"
            let additionalMessage = "--You're in the lead!"

            if (entry.chatterId === 0) {
                return (<li className="single-auction-gray-text">Please login to participate in chat!</li>)
            }

            if (entry.bidderId) {
                if (!currentUser || currentUser.id === thisAuction.sellerId) {
                    userLabel = `User ${entry.bidderId}`;
                    auctionEntryClass = "single-auction-bid-neutral"
                    additionalMessage = "";
                }
                else if (entry.bidderId !== currentUser.id) {
                    userLabel = `User ${entry.bidderId}`
                    auctionEntryClass = "single-auction-bid-other"
                    additionalMessage = "--Hurry, bid again!"
                }
                return (<li className={auctionEntryClass}>{userLabel} bid {centsToDollars(entry.bidAmountCents)} {additionalMessage}</li>)

            } else if (entry.chatterId) {
                if (!currentUser || entry.chatterId !== currentUser.id) {
                    userLabel = `User ${entry.chatterId}`
                }
                if (entry.chatterId == thisAuction.sellerId) {
                    userLabel = userLabel + " (owner)";
                }

                return (<li>{userLabel}: {entry.chatMessage}</li>)
            }
        }))

    }

    // function chatMapper(chatlog) {
    //     for (let chat of chatlog) {
    //         //console.log("chatmapper?", chat)

    //         let chatterVar = "You";
    //         if (!currentUser || chat.chatterId !== currentUser.id) {
    //             chatterVar = `User ${chat.chatterId}`;
    //         }

    //         console.log(`${chatterVar}: ${chat.chatMessage}`)
    //     }
    // }

    //chatMapper(chatLog);


    function getHighestBid(bids) {
        if (!thisAuction) {
            return 0;
        }
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
        if (auctionStarted == false) {
            return ("Auction not started yet")
        }

        if (auctionOver == true) {
            return ("Cannot bid -- auction over!")
        }

        //     thisAuction ? console.log("\n\n\nThis auction starttime", thisAuction.startTime) : console.log("")


        return ""
    }

    // function countDownToStart() {
    //     const nowDateTime = new Date();

    //     const startDateTime = Date(thisAuction.startTime);


    // }

    async function resolveAuction(resAuctionId) {
        // const resThisAuction = allAuctions ? allAuctions[auctionId] : ""
        setAuctionOver(true);

        if (thisAuction.auctionOpen == false) {
            console.log(`Auction ${resAuctionId} is already closed! Skipping;`)
            return;
        }

        if (!thisAuctionBidList.length) {
            console.log(`Closing: No bids for ${resAuctionId}, setting auction to "Open: false`)
            alert(`No one bid for the ${thisItem.name}! Returning to owner.`)
            dispatch(closeAuctionThunk(thisAuction.id))
            //TODO: update auction to open:False
            return;
        }


        console.log("\n\n\npre-finding highest bid", thisAuctionBidList)


        const lastBid = sortedBidList.length ? sortedBidList[sortedBidList.length - 1] : "nothing?"

        console.log("\n\n\nlastBid found", lastBid)
        // if (resThisAuction.auctionOpen == true) {
        //     console.log("\n\n\nthis auction is open, with timer over! closing:")
        // }

        //trade item and close auction
        //HERE YALL
        const finalSeller = await dispatch(getUserThunk(thisAuction.sellerId));
        const finalBuyer = await dispatch(getUserThunk(lastBid.bidderId));
        const finalBidAmount = lastBid.bidAmountCents;



        const finalSellerCashCents = finalSeller.cashCents;
        const finalBuyerCashCents = finalBuyer.cashCents;
        // console.log("final seller?", finalSeller)
        // console.log("final buyer?", finalBuyer)
        // console.log("finalBidAMount?", finalBidAmount)
        // console.log("finalseller cashcents?", finalSeller.cashCents)
        // console.log("finalbuyer cashcents?", finalBuyer.cashCents)
        // console.log("finalSeller after deal?", finalSeller.cashCents + finalBidAmount)
        // console.log("finalBuyer after deal?", finalBuyer.cashCents + finalBidAmount)

        if (!thisItem) {
            // console.log(`item doesn't exist at close time of auction ${thisAuction.id}, closing:`);
            dispatch(closeAuctionThunk(thisAuction.id))
            .then(alert("Item doesn't exist at close of auction! Item must have been erroneously deleted. Closing auction."))

            return;
        }

        dispatch(tradeItemThunk(thisItem.id,
            {
                lastKnownPriceCents : lastBid.bidAmountCents,
                 ownerId: lastBid.bidderId
            }
        ))
        .then(dispatch(editWalletThunk(finalSeller.id, (finalBidAmount))))
        .then(dispatch(editWalletThunk(finalBuyer.id, finalBidAmount * -1)))
        // .then(dispatch(editWalletThunk(finalSeller.id, (finalSeller.cashCents + finalBidAmount))))
        // .then(dispatch(editWalletThunk(finalBuyer.id, (finalBuyer.cashCents - finalBidAmount))))
        .then(dispatch(closeAuctionThunk(thisAuction.id)))
        .then(
            alert(congratsOrSorry(lastBid))
            // console.log(`Traded item ${thisItem.id} ${thisItem.name} to user ${lastBid.bidderId}`)
            )

        // console.log("\n\n\nthis auction is open, with timer over! closing:")
    }

    function congratsOrSorry(lastestBid) {
        let message = "";
        try {
            if (currentUser.id == lastestBid.bidderId) {
                message = `Congrats! You just won the ${thisItem.name}! It's been added to your Item list.`
            } else if (currentUser.id == thisAuction.sellerId) {
                message = `Your item ${thisItem.name} has just been won by User ${lastestBid.bidderId}! The bid amount $${centsToDollars(lastestBid.bidAmountCents)} has been added to your wallet!`
            } else {
                message = `Bidding is over! Sadly, seems like User ${lastestBid.bidderId} got away with the ${thisItem.name}! It's been added to their inventory; Better luck next time!`
            }
        } catch {
            message = `Bidding is over! User ${lastestBid.bidderId} won the ${thisItem.name}! It's been added to their inventory!`
        }
        return message;
    }
    //END OF HELPER FUNCTIONS
    //
    //


    useEffect(() => {

        socket = io();
        //receiving
        socket.on("bidEvent", (bid) => {
            // console.log("\n\n\nBID?", bid)

            if (bid.socketAuctionId == auctionId) {
                //trigger refresh?
                // console.log("socketAuctionId matches auctionId, refresh")

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

        socket.on("chatEvent", (chat) => {
            // console.log("\n\n\nCHAT?", chat)


            if (chat.socketAuctionId == auctionId) {
                // console.log("socketAuctionId matches auctionId, adding to current chatlog")

                // let currentChatLog = [...chatLog]
                // currentChatLog.push(chat)

                // console.log("pre setChatLog, currentChatLog", currentChatLog)

                //thank you, set state documentation
                //https://legacy.reactjs.org/docs/react-component.html#setstate

                setChatLog((chatLog) => {
                    let currentChatLog = [...chatLog]
                    currentChatLog.push(chat)

                    //console.log("pre setChatLog, currentChatLog", currentChatLog)
                    return currentChatLog;
                });
                // }currentChatLog);

            }
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

        // console.log("\n\n\nstarting sendBid, tempErrors should be empty", tempErrors)

        // console.log("bidInput before?", bidInput)

        const tempBidInput = bidInput * 100;

        // console.log("bidinput??", typeof bidInput)
        if (tempBidInput <= 0) {
            // console.log("bidinput is equal or less than zero")
            tempErrors.tempBidInput = "Can't bid a zero/negative amount"
        }

        if (String(bidInput).length > 6) {
            tempErrors.bidInput = "Can't bid over six figures"
        }

        const walletAmount = currentUser.cashCents;

        if (tempBidInput > walletAmount) {
            tempErrors.walletAmount = "Can't bid more than amount in wallet"
        }


        const currentHighestBid = getHighestBid(thisAuctionBidList)//sortedBidList

        if (tempBidInput <= currentHighestBid) {
            tempErrors.currentHighestBid = `Must bid higher than ${centsToDollars(currentHighestBid)}`
        }


        if (Object.values(tempErrors).length > 0) {
            setErrors(tempErrors);
            return;
        }

        const sendBid = newBid();

        dispatch(createBidThunk(sendBid))
        // .then(console.log("bid creating?"))
        .then(socket.emit("bidEvent", { socketAuctionId: thisAuction.id, bidderId: currentUser.id, bidAmount: parseInt(bidInput * 100), localHighestBid: tempBidInput})
        )


        setBidInput(0);
        return;
    }

    const sendChat = (e) => {
        e.preventDefault();

        if (!currentUser) {
            setChatLog((chatLog) => {
                let currentChatLog = [...chatLog]
                currentChatLog.push({ socketAuctionId: thisAuction.id, chatterId: 0, chatMessage:'Invalid message', timeOfBid:(new Date()).toString() })

                //console.log("pre setChatLog, currentChatLog", currentChatLog)
                return currentChatLog;
            });
            setChatMessage('');
            return;
        }


        if (chatMessage.length) {
            setChatMessage('');

            socket.emit("chatEvent", { socketAuctionId: thisAuction.id, chatterId: currentUser.id, chatMessage:chatMessage, timeOfBid:(new Date()).toString() })

        }

        return;
    }

    // console.log("auctionover?", auctionOver)
    // console.log("all auctions?", allAuctions)
    // console.log("this auction?", thisAuction)
    // console.log("this item?", thisItem)
    // console.log("current highest bid?", highestBid)
    // console.log("bidLogs?", bidLogs)

    // thisAuction ? console.log("\n\n\nThis auction starttime", thisAuction.startTime) : console.log("")

    return ( thisAuction ? (
        <>
        <h1 className="single-auction-title">{thisAuction ? thisAuction.auctionName : ""}</h1>

        <div className="single-auction-grid">

        <div className="single-auction-left">
            <div>{thisItem ? thisItem.name : 'Item Name not found'} </div>
            <div className="single-auction-image">
                {/* IMAGE */}
                {thisItem ? imageHandle(thisItem.imageUrl) : ''}
            </div>
            <div className={testBidChatList.length < 9 ? "single-auction-bidfeed" : "single-auction-bidfeed single-auction-bidfeed-overflow"}>
                <ul>
                {testBidChatList ? bidChatMapper(testBidChatList) : <li>None yet!</li>}
                {/* {sortedBidList ? bidLogMapper(sortedBidList) : <li>None yet!</li>} */}
                </ul>
                <div id="single-auction-bidfeed-anchor">

                </div>
            </div>

            <div className={`single-auction-chat-wrapper` + (auctionOver == true ? " single-auction-display-none" : "")}>
            <form onSubmit={sendChat} className="single-auction-chat-form">
                <input
                    className="single-auction-chat-input"
                    type="textbox"
                    value={chatMessage}
                    onChange={(e) => {setChatMessage(e.target.value)}}
                />
                <button type="submit" className="single-auction-chat-button">Send Chat</button>
            </form>
            </div>
        </div>

        <div className="single-auction-right">

            <div className="single-auction-item-description">{thisItem ? thisItem.description : 'Description not found'}</div>
            <div className="single-auction-countdown">
            {thisAuction ?
                (auctionStarted ?
                    <Countdown
                        key={`${thisAuction.id}active`}
                        date={thisAuction.endTime}
                        // onComplete={resolveAuction(auctionId)}>
                        onComplete={thisAuction && (() => resolveAuction(thisAuction.id))}>
                            <p>Expired at: {new Intl.DateTimeFormat('en-US',
                                {
                                    month: '2-digit',
                                    day: '2-digit',
                                    year: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }
                            ).format(new Date(thisAuction.endTime))}</p>
                            {/* <p>Auction Over!</p> */}
                    </Countdown>
                    :
                    (
                    <>
                    Auction Starting in:_
                    <Countdown
                        key={`${thisAuction.id}prior`}
                        date={thisAuction.startTime}
                        // onComplete={resolveAuction(auctionId)}>
                        onComplete={thisAuction && (() => setAuctionStarted(true))}>
                    </Countdown>
                    </>
                    )
                )
            : <p></p>}
            </div>

            <div className="single-auction-highest">Highest Bid: {centsToDollars(getHighestBid(thisAuctionBidList))}


            {/* remove later
            <button onClick={() => dispatch(closeAuctionThunk(thisAuction.id))}>Try closing</button> */}


            </div>
           <div className="single-auction-bidform">

            {reasonBidDisabled() ?
                <div className="single-auction-reason-block">{reasonBidDisabled()}</div> :
            <>
            <form onSubmit={sendBid}>
                <input
                    className="single-auction-bidform-input"
                    type="number"
                    step="0.01"
                    value={bidInput}
                    onChange={updateBidInput}
                />
                <button type="submit" className="single-auction-bid-button">Send Bid</button>
            </form>
                <div>
                {Object.values(errors).length ? Object.values(errors).map((error) => {
                   return <p key={error}className="single-auction-error">
                            {error}
                        </p>
                }) : ""}
                </div>
            </>

                }


           </div>

        </div>
        </div>





        </>
    ) : <h1>Auction doesn't exist!</h1>)
}

export default SingleAuctionPage;
