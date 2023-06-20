
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getAuctionsThunk } from "../../store/auction";
import { getItemsThunk } from "../../store/item";

import Countdown from "react-countdown";

function SingleAuctionPage() {

    const dispatch = useDispatch();

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
