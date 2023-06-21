
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getAuctionsThunk } from "../../store/auction"
import { getItemsThunk } from "../../store/item"
import Countdown from "react-countdown";

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
    const thisAuction = allAuctions ? allAuctions[auctionId] : ""

    console.log("all auctions?", allAuctions)
    console.log("this auction?", thisAuction)

    return (
        <>
        <h1>Auction page for {thisAuction ? thisAuction.auctionName : "undefined"}</h1>

        <div>
        <Countdown
            date={thisAuction.endTime}>
                <p>Auction Expired</p>
        </Countdown>
        </div>

        </>
    )
}

export default SingleAuctionPage;
