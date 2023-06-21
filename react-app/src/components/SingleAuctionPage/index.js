
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getAuctionsThunk } from "../../store/auction"
import { getItemsThunk } from "../../store/item"
import Countdown from "react-countdown";

import "./SingleAuctionPage.css"

//websocket???
// import { io } from 'socket.io-client';
// let socket;


function SingleAuctionPage() {

    const dispatch = useDispatch();

    // const [bidLog, setBidLog] = useState([]);

    // useEffect(() => {
    //     socket = io();

    //     socket.on("socket-bid", (bidMessage) => {
    //         setBidLog(bidLogs => [...bidLogs, bidMessage])

    //         return (() => {
    //             socket.disconnect()
    //         })
    //     })
    // })



/*  const updateChatInput = (e) => {
        setChatInput(e.target.value)
    };

    const sendChat = (e) => {
        e.preventDefault()
        socket.emit("chat", { user: user.username, msg: chatInput });
        setChatInput("")
    }

    return (user && (
        <div>
            <div>
                {messages.map((message, ind) => (
                    <div key={ind}>{`${message.user}: ${message.msg}`}</div>
                ))}
            </div>
            <form onSubmit={sendChat}>
                <input
                    value={chatInput}
                    onChange={updateChatInput}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    )
    )
};


export default Chat; */


    useEffect(() => {
        dispatch(getAuctionsThunk());
        dispatch(getItemsThunk());
    }, [dispatch])

    const { auctionId } = useParams();
    const allAuctions = useSelector(state => state.auctions)
    const allItems = useSelector(state => state.items)

    const thisAuction = allAuctions ? allAuctions[auctionId] : ""
    const thisItem = allItems && thisAuction ? allItems[thisAuction.auctionItemId] : ''



    console.log("all auctions?", allAuctions)
    console.log("this auction?", thisAuction)
    console.log("this item?", thisItem)

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
                BID FEED
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
           <div className="single-auction-bidform">BIDFORM</div>

        </div>
        </div>





        </>
    )
}

export default SingleAuctionPage;
