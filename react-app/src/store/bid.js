// constants
const CREATE_BID = "session/CREATE_BID";
const GET_BIDS = "session/GET_BIDS";
// const UPDATE_BID = "session/UPDATE_BID";
const DELETE_BID = "session/DELETE_BID";
const DELETE_BIDS_AUCTION = "session/DELETE_BIDS_AUCTION"

const getBids = (bids) => ({
    type: GET_BIDS,
    payload: bids
})

const createBid = (bid) => ({
    type: CREATE_BID,
    payload: bid
})

// const updatebid = (bid) => ({
//     type: UPDATE_BID,
//     payload: bid
// })

const deleteBid = (bidId) => ({
    type: DELETE_BID,
    payload: bidId
})


//thunk here
export const getBidsThunk = () => async (dispatch) => {
    const response = await fetch("/api/bids/");
    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return ({"error": "Failed retrieving bids fetch"})
        }
        dispatch(getBids(data.bids));
        return data.bids;
    }

}

export const createBidThunk = (bid) => async (dispatch) => {

    console.log("At create bid thunk, what is bid", bid)

    const response = await fetch("/api/bids/new",
    {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(bid)
    })

    if (response.ok) {
        const newBid = await response.json();
        dispatch(createBid(newBid))
        return newBid;
    } else {
        const errors = await response.json();
        console.log("\n\n\nerrors from create bid thunk", errors)
        return errors;
    }
}

// export const updateBidThunk = (bid, oldbidId) => async (dispatch) => {
//     //bid here is an object containing JUST the attributes to change
//     //oldbidId refers to the bid we're updating
//     console.log("at update bid thunk, bid", bid)
//     console.log("thunk, bid.id??", oldbidId)

//     const response = await fetch(`/api/bids/${oldbidId}`, {
//         method: "PUT",
//         // method: "UPDATE",
//         headers: {"Content-Type": "application/json"},
//         // body: bid
//         body: JSON.stringify(bid)
//     })

//     if (response.ok) {
//         const editedbid = await response.json();

//         console.log("edited bid?", editedbid)

//         dispatch(updatebid(editedbid))
//         return editedbid;
//     } else {
//         const errors = await response.json();
//         console.log('\n\n\nerrors from update bid thunk')
//         return errors;
//     }
// }

export const deleteBidThunk = (bidId) => async (dispatch) => {
    const response = await fetch(`/api/bids/${bidId}`, {
        method: "DELETE"})

    if (response.ok) {
        dispatch(deleteBid(bidId));
        return {"message": `Bid ${bidId} successfully deleted`}
    } else {
        const errors = await response.json();
        return errors;
    }

}

export const deleteAllBidsAuctionThunk = (auctionId) => async (dispatch) => {
    const response = await fetch(`/api/bids/auctions/${auctionId}`, {
        method: "DELETE"})

    if (response.ok) {
        // dispatch(deleteBid(bidId));
        return {"message": `All bids of ${auctionId} successfully deleted`}
    } else {
        const errors = await response.json();
        return errors;
    }

}



const initialState = null;

export default function bidReducer(state = initialState, action) {
    switch (action.type) {
        case GET_BIDS:
            const newBids = {}

            console.log("bid action?", action)
            if (action.payload.length) {
                action.payload.forEach((bid) => {
                    newBids[bid.id] = bid
                })
            }
            return newBids;
        case CREATE_BID:
            const resState = {...state};

            console.log("\n\nreducer: bid?", action.payload);

            resState[action.payload.id] = action.payload;
            return resState;

        case DELETE_BID:
            const delState = {...state};
            const deleteBidId = action.payload;

            console.log("delete bid id", deleteBidId)

            try {
                delete delState[deleteBidId];
                console.log("bid successfully deleted; store")
            } catch (e) {
                console.log("unable to delete bid; store");
            }
            return delState;

        // case UPDATE_BID:
        //     const updateState = {...state};
        //     const updatebid = action.payload;

        //     console.log(`store, updating bid ${updatebid.name}`)

        //     try {
        //         updateState[updatebid.id] = updatebid;
        //         console.log(`bid ${updatebid.name} successfully updated; store`)
        //     } catch {
        //         console.log("Unable to update bid; store")
        //     }
        //     return updateState;


        default:
            return state;
    }
}
