import React from "react";
import Countdown from 'react-countdown';


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

    return (
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
        </>
    );
}


export default AaCountdownTest;
