// import React from "react";
import Countdown from 'react-countdown';

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { io } from 'socket.io-client';
let socket;

// ALL CUSTOM COMPONENTS MUST BE IN UPPER CASE
// OR REACT WILL NOT REAAD THEM
function AaCountdownTest() {

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

        socket.on("chat", (chat) => {
            setMessages(messages => [...messages, chat])
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
        socket.emit("chat", { user: user.username, msg: chatInput });
        setChatInput("")
    }
    //sockettest



    return (user && (
        <>
        <h1>Countdown Test here!</h1>

        {/* https://www.npmjs.com/package/react-countdown */}
        <div className="landing-page-timer-test">

        <Countdown date={Date.now() + 10000}>
        {<p>Countdown complete??</p>}
        {() => console.log("countdown 1 complete!")}
        </Countdown>

        </div>

        <div>
            <Countdown
            date={Date.now() + 11000}
            zeroPadTime={2}
            /* onMount
            onStart
            onPause
            onStop
            onTick
            onComplete */
            renderer={testRenderer}
            />
        </div>

        <p>Milliseconds test</p>
        <Countdown
            date={Date.now() + 10000}
            intervalDelay={0}
            precision={3}
            renderer={props => <div>{props.total}</div>}
        />


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


export default AaCountdownTest;
