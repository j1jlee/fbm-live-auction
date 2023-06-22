// import React from "react";
import Countdown from 'react-countdown';

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { io } from 'socket.io-client';
let socket;

// ALL CUSTOM COMPONENTS MUST BE IN UPPER CASE
// OR REACT WILL NOT REAAD THEM
function AaSocketTestTwo() {

    const testRenderer = ({ hours, minutes, seconds, completed}) => {
        if (completed) {
            return (<p>"test renderer complete"</p>)
        } else {
            // return <span>{hours < 10 ? 0 : ""}{hours}:{minutes < 10 ? 0 : ""}{minutes}:{seconds < 10 ? 0 : ""}{seconds}</span>;

            return <span>{hours}:{minutes}:{seconds}</span>
        }
    }

    //sockettest
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([]);
    const user = useSelector(state => state.session.user)

    useEffect(() => {
        // open socket connection
        // create websocket
        socket = io();

        //create websocket DEFINE what EVENT does?
        //receiving
        socket.on("chatEvent", (chat) => {
            console.log("CHAT?", chat)
            if (chat.chatNum) {
                if (chat.chatNum == 2) {
                    setMessages(messages => [...messages, chat])
                }
            } else return;
        })
        // when component unmounts, disconnect
        return (() => {
            socket.disconnect()
        })
    }, [])

    const updateChatInput = (e) => {
        setChatInput(e.target.value)
    };

    const sendChat = (e) => {
        e.preventDefault()
        //TO sockets.py, @socketio.on("chatEvent")
        socket.emit("chatEvent", { chatNum: 2, user: user.username, msg: chatInput });
        setChatInput("")
    }
    //sockettest



    return (user && (
        <>
        <h1>Socket Test here!</h1>




        {/* WEBSOCKETS CHAT */}
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
        </>
    )
    );
}


export default AaSocketTestTwo;
