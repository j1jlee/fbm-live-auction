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
// import { urlToImage } from "../aaaMiddleware";
import { createAuctionThunk } from "../../store/auction";
import { createItemThunk } from "../../store/item";

import { getAllUsersThunk } from "../../store/session";

import { sortBidByTime } from "../aaaMiddleware";

import Countdown from 'react-countdown';

import { imageHandle } from "../aaaMiddleware";

import { demoItems } from "./DemoAuctionSeed";

import "./LandingPageAuctionList.css"
import { io } from 'socket.io-client';
let socket;


// import ItemCreateModal from "../ItemCreateModal";
// import ItemDeleteModal from "../ItemDeleteModal";
// import ItemUpdateModal from "../ItemUpdateModal";
// import OpenModalButton from "../OpenModalButton";


function LandingPageAuctionList() {

    const dispatch = useDispatch();
    const allItems = useSelector(state => state.items)
    const allAuctions = useSelector(state => state.auctions)
    const allBids = useSelector(state => state.bids)
    const thisSession = useSelector(state => state.session)
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
    const sortedAuctionsPassed = auctionsPassed.length ? sortAuctionsReverse(auctionsPassed) : [];



    useEffect(() => {
        // open socket connection
        // create websocket
        socket = io();

        //create websocket DEFINE what EVENT does?
        socket.on("newAuctionEvent", (newAuction) => {
            //setMessages(messages => [...messages, chat])
            // console.log("new auction, refresh all", newAuction);

            dispatch(getAuctionsThunk())
            .then(setSwitchBool(!switchBool));
            // dispatch(getAuctionsThunk())
            // (setSwitchBool(() => {
            //     dispatch(getAuctionsThunk());
            //     return !switchBool;
            // }));
        })
        // when component unmounts, disconnect
        return (() => {
            socket.disconnect()
        })
    }, [])

    useEffect(() => {

        dispatch(getAuctionsThunk())
        .then(dispatch(getItemsThunk()))
        .then(dispatch(getBidsThunk()));

        // socket.emit("newAuctionEvent", { note: "create auction thunk auction refresh"});
    }, [dispatch, switchBool])

    // useEffect(() => {
    //     console.log("\n\n\ndoes this work? create auction thunk");

    //     socket.emit("newAuctionEvent", { note: "create auction thunk auction refresh"})
    // }, [createAuctionThunk])

    function randomKeyText(auctionId) {
        const resText = `${auctionId}
        ${Math.floor(Math.random() * 1000)}
        ${['a', 'b', 'c', 'd', 'e'][Math.floor(Math.random() * 5)]}`;

        // console.log(`\n\n\nresText for auction ${auctionId}, ${resText}`);
        return resText;
    }

    function sortAuctions(auctionList) {
        const tempList = [...auctionList];

        tempList.sort((a, b) => {
            const aTime = (new Date(a.endTime)).getTime();
            const bTime = (new Date(b.endTime)).getTime();

            return aTime - bTime;
        })

        return tempList;
    }

    function sortAuctionsReverse(auctionList) {
        const reverseTempList = [...auctionList];

        reverseTempList.sort((a, b) => {
            const aTime = (new Date(a.endTime)).getTime();
            const bTime = (new Date(b.endTime)).getTime();

            return bTime - aTime;
        })

        return reverseTempList;
    }

    function getRandomInt(min, max) {
        if ((!max && max !== 0) ||
            (!min && min !== 0) ||
            (min > max))
         {
            return null;
        }


        const minMaxDiff = max - min;

        return Math.floor(Math.random() * minMaxDiff) + min;
    }

    const handleGetUsersButton = async () => {

        console.log("handling getusers")

        // e.preventDefault();



        const allUsersRes = await dispatch(getAllUsersThunk());
        const allUsersArray = allUsersRes.users;
        const allUsersLength = allUsersArray.length;

        const demoItemsTemp = [...demoItems];
        const demoItemsTempLength = demoItemsTemp.length

        const itemIndexStarter = getRandomInt(0, demoItemsTempLength)
        const userIndexStarter = getRandomInt(0, allUsersLength)

        const handleTimeNow = new Date();

        console.log("demoitemstemp length?", demoItemsTemp.length)
        console.log("itemindex starter?", itemIndexStarter)

        for (let i = 0; i < 10; i++) {
            //console.log("whee", i);

            //starterpoint is [...demoItems], index 0~ length - 1
            const tempItemIndex = (itemIndexStarter + i) % demoItemsTempLength;
            const tempUserIndex = (userIndexStarter + i) % allUsersLength;

            const tempItem = demoItemsTemp[tempItemIndex];
            const tempUser = allUsersArray[tempUserIndex];

            const tempDatePlus = new Date(handleTimeNow.getTime() + getRandomInt(90000, 300000));

            //apply ownerId to tempItem
            tempItem.ownerId = tempUser.id

            console.log("tempItem?", tempItem.name)
            console.log("tempItem ownerid?", tempItem.ownerId)

            //
            const tempDemoItem = await dispatch(createItemThunk(tempItem));

            // console.log("tempDemoItem?", tempDemoItem)

            if (tempDemoItem) {
                // console.log("trying to create demo auction")

                const tempDemoAuction = {
                  auctionName: `Auction for ${tempItem.name}`,
                  auctionDescription: tempItem.description,
                  startingBidCents: tempItem.lastKnownPriceCents % 1000000,
                  startTime: handleTimeNow.toString(),
                  endTime: tempDatePlus.toString(),
                  auctionItemId: tempDemoItem.id,
                //   auctionItemId: allItemsList[0].id,
                  sellerId: tempUser.id
                }
                await dispatch(createAuctionThunk(tempDemoAuction))

                // await dispatch(createAuctionThunk(demoAuction));
            }
        }

        socket.emit("newAuctionEvent", { note: "mass auction refresh"});
    }

    const demoSubmit = async (demoSellerId) => {

        const timeNow = new Date();
        const timePlusMinute = new Date(timeNow.getTime() + 60000);

        const timeNowString = timeNow.toString();
        const timePlusMinuteString = timePlusMinute.toString();

        const demoItem = {
            name: "testItem",
            description: "this is an item made for test auctions! Buyers beware",
            lastKnownPriceCents: 9900,
            imageUrl: "https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/SCARF_1_resized.jpg",
            ownerId: demoSellerId
        }


        const createDemoItem = await dispatch(createItemThunk(demoItem));

        // console.log("createDemoItem?", createDemoItem)

        if (createDemoItem) {
            // console.log("trying to create demo auction")

            const demoAuction = {
              auctionName: "Demo Auction",
              auctionDescription: "This is a demo auction!",
              startingBidCents: 100,
              startTime: timeNowString,
              endTime: timePlusMinuteString,
              auctionItemId: createDemoItem.id,
            //   auctionItemId: allItemsList[0].id,
              sellerId: demoSellerId
            }
            dispatch(createAuctionThunk(demoAuction))
            .then(socket.emit("newAuctionEvent", { note: "new auction refresh"}));
            // await dispatch(createAuctionThunk(demoAuction));
        }
      }



    // currentUser ? console.log("currentUser exists") : history.push("/");

    // console.log("all items at auction?", allItems)

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

    //no current user, OR currentUser.id does NOT match auction.sellerId
    function currentUserIsNotSeller(sellerAuction) {
        const currentUser = thisSession.user;

        if (!currentUser) {
            // console.log("currentUserIsSeller, currentUser doesn't exist/not logged in")
            return true;
        }

        if (currentUser.id != sellerAuction.sellerId) {
            // console.log(`currentUserIsSeller, not seller, user id ${currentUser.id}, auction sellerId ${sellerAuction.sellerId}`);
            return true;
        }
        return false;
    }



    async function resolveAuction(resAuctionId) {

        const thisAuction = allAuctions[resAuctionId];

        if (thisAuction.auctionOpen == false) {
            // console.log(`Auction ${resAuctionId} is already closed! Skipping;`)
            return;
        }

        const thisAuctionBidList = allBids ? Object.values(allBids).filter((bid) => {
            return bid.auctionId == resAuctionId
        }) : [];


        if (!thisAuctionBidList.length) {
            // console.log(`Closing: No bids for ${resAuctionId}, setting auction to "Open: false`)
            const noBidClose = await dispatch(closeAuctionThunk(resAuctionId))
            // const noBidClose = await dispatch(closeAuctionThunk(thisAuction.id))

            // console.log("noBidClose", noBidClose)

            setSwitchBool(!switchBool);

            socket.emit("newAuctionEvent", { note: "no bid close refresh"})
            // const switchBoolAgain = await dispatch(setSwitchBool(!switchBool))
            // console.log('switchBool', switchBoolAgain)
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

        // FIX LATER
        const closer = await dispatch(closeAuctionThunk(resAuctionId))
        //DO NOT---
        //DO NOT REMOVE THIS CONSOLE LOG
        console.log("closer?", closer)
        //DO NOT REMOVE THIS CONSOLE LOG



        // await dispatch(closeAuctionThunk(thisAuction.id))
        // await dispatch(setSwitchBool(!switchBool))


            console.log(`Traded item for auction ${thisAuction.id} to user ${lastBid.bidderId}`)
        // .then(dispatch(closeAuctionThunk(thisAuction.id)))
        // .then(dispatch(setSwitchBool(!switchBool)))


        //     console.log(`Traded item for auction ${thisAuction.id} to user ${lastBid.bidderId}`)

        console.log("\n\n\nthis auction is open, with timer over! closing:")
    }




    function renderAuctionNew(auctionList) {
        return (
            <>
           <div className="landing-page-auction-grid">

           {auctionList.map((auction) => (
            <>
            {() => console.log("\n\n\ndumb", auction)}


            <div className="landing-page-auction-node"
            >

            <div className="landing-page-auction-node-link" onClick={() => {
                history.push(`/auction/${auction.id}`)
            }}>

            {/* {() => {
                console.log("\n\n\nauction?", auction)
            }}
            {() => {
                console.log("\n\n\nauction.endTime?", auction.endTime)
            }} */}

            <div className= { pastTime(auction.endTime) ? "landing-page-auction-new-node-image landing-page-image-passed" : "landing-page-auction-new-node-image"}>

                {/* item image? */}
                {allItems ?
                // allItems[auction.auctionItemId].imageUrl
                        (allItems[auction.auctionItemId] ? imageHandle(allItems[auction.auctionItemId].imageUrl) : imageHandle('none'))

                        : "Item Not Found"}</div>


            <div>
            {pastTime(auction.startTime) ?
                <>
                <div>
                <Countdown
                    //add key to prevent countdown stop issue?
                    key={randomKeyText(auction.id)}
                    date={auction.endTime}
                    onComplete={() => {
                        resolveAuction(auction.id)
                        // (setSwitchBool(!switchBool))
                    }
                    }>
    {/* ALSO HANDLE "STILL OPEN AUCTIONS, DEFINE WINNER, GIVE ITEM, ETC"
    DONE ABOVE WITH resolveAuction*/}
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
                            key={randomKeyText(auction.id)}
                            date={auction.startTime}
                            onComplete={() => {setSwitchBool(!switchBool)}}
                    >
                         <div className="landing-page-inner-show">
                         <Countdown
                            key={randomKeyText(auction.id)}
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
            {/* <div>{auction.auctionName}</div> */}
            <div>{auction.auctionName.length > 30 ? auction.auctionName.substring(0, 25) + "..." : auction.auctionName}</div>


            </div>

            <span className="landing-page-buttons">

            <span className={pastTime(auction.startTime) || currentUserIsNotSeller(auction) ? "update-disabled" : "landing-page-update-button"}>
            <OpenModalButton
            buttonText="Update Auction"
            modalComponent={<AuctionUpdateModal update_auction={auction} />} />
            </span>

            <span className={pastTime(auction.startTime) || currentUserIsNotSeller(auction)? "update-disabled" : "landing-page-delete-button"}>
            <OpenModalButton
            buttonText="Delete Auction"
            modalComponent={<AuctionDeleteModal auctionId={auction.id} />} />
            </span>

            <span className={pastTime(auction.endTime) && !currentUserIsNotSeller(auction) ? "landing-page-delete-button-solo" : "update-disabled"}>
            <OpenModalButton
            buttonText="Delete Auction"
            modalComponent={<AuctionDeleteModal auctionId={auction.id} />} />
            </span>

            </span>

            </div>



            </>
           ))
            }

            </div>
            </>
        )
    }
    function renderAuctionPassedNew(auctionList) {
        return (
            <>
           <div className="landing-page-auction-grid">

           {auctionList.map((auction) => (
            <>
            <div className="landing-page-auction-node">

            <div className="landing-page-auction-node-link" onClick={() => {
                history.push(`/auction/${auction.id}`)
            }}>

            {/* {() => {
                console.log("\n\n\nauction?", auction)
            }}
            {() => {
                console.log("\n\n\nauction.endTime?", auction.endTime)
            }} */}

            <div className={"landing-page-auction-new-node-image landing-page-image-passed"}>

                {/* item image? */}
                {allItems ?
                // allItems[auction.auctionItemId].imageUrl
                        (allItems[auction.auctionItemId] ? imageHandle(allItems[auction.auctionItemId].imageUrl) : imageHandle('none'))

                        : "Item Not Found"}</div>
            <div>
                <p className="landing-page-expired-time">Expired at: {new Intl.DateTimeFormat('en-US',
                {
                    month: '2-digit',
                    day: '2-digit',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                }
                ).format(new Date(auction.endTime))}</p>
                {/* time utc to local??? */}
                {/* <p>Expired at: {new Intl.DateTimeFormat('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                }).format(auction.endTime)}</p> */}
            </div>


            <div>$ {centsToDollars(auction.startingBidCents)}</div>
            {/* <div>{auction.auctionName}</div> */}
            <div>{auction.auctionName.length > 30 ? auction.auctionName.substring(0, 25) + "..." : auction.auctionName}</div>


            </div>

            <span className="landing-page-buttons">

            <span className={"landing-page-delete-button-solo"}>
            <OpenModalButton
            buttonText="Delete Auction"
            modalComponent={<AuctionDeleteModal auctionId={auction.id} />} />
            </span>
            {/* <span className={currentUserIsNotSeller(auction) ? "update-disabled" : "landing-page-delete-button-solo"}>
            <OpenModalButton
            buttonText="Delete Auction"
            modalComponent={<AuctionDeleteModal auctionId={auction.id} />} />
            </span> */}

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
        <p className="landing-page-title-description">
            Select an auction to participate in, bid and win!
        </p>
        <div>
            <button onClick={() => demoSubmit(2)}>Create Demo Auction (from User 2)</button>
            <button onClick={() => handleGetUsersButton()}>get all users maybe</button>
        </div>
        <div className="landing-page-auction-wrapper">
            {sortedAuctionsCurrent.length ? renderAuctionNew(sortedAuctionsCurrent)
            :
            "No current auctions!"}
            {/* {renderAuction(sortedAuctionsCurrent)} */}
        </div>

        <br></br>
        <hr></hr>
        <br></br>

        <h2>Past Auctions:</h2>
        <div className="landing-page-auction-wrapper">
            {sortedAuctionsPassed.length && renderAuctionPassedNew(sortedAuctionsPassed)}
        </div>
        </>
    )
}


export default LandingPageAuctionList;

export { socket };
