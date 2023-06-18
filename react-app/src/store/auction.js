// constants
const CREATE_AUCTION = "session/CREATE_AUCTION";
const GET_AUCTIONS = "session/GET_AUCTIONS";
const UPDATE_AUCTION = "session/UPDATE_AUCTION";
const DELETE_AUCTION = "session/DELETE_AUCTION";


const getAuctions = (auctions) => ({
    type: GET_AUCTIONS,
    payload: auctions
})

const createAuction = (auction) => ({
    type: CREATE_AUCTION,
    payload: auction
})

const updateAuction = (auction) => ({
    type: UPDATE_AUCTION,
    payload: auction
})

const deleteAuction = (auctionId) => ({
    type: DELETE_AUCTION,
    payload: auctionId
})


//thunk here
export const getAuctionsThunk = () => async (dispatch) => {
    const response = await fetch("/api/auctions/");
    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return ({"error": "Failed retrieving auctions fetch"})
        }
        dispatch(getAuctions(data.auctions));
        return data.auctions
    }

}

export const createAuctionThunk = (auction) => async (dispatch) => {
    const response = await fetch("/api/auctions/new",
    {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(auction)
    })

    if (response.ok) {
        const newAuction = await response.json();
        dispatch(createAuction(newAuction))
        return newAuction;
    } else {
        const errors = await response.json();
        console.log("\n\n\nerrors from create auction thunk", errors)
        return errors;
    }
}

export const updateAuctionThunk = (auction, oldAuctionId) => async (dispatch) => {
    //auction here is an object containing JUST the attributes to change
    //oldAuctionId refers to the auction we're updating
    console.log("at update auction thunk, auction", auction)
    console.log("thunk, auction.id??", oldAuctionId)

    const response = await fetch(`/api/auctions/${oldAuctionId}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(auction)
    })

    // console.log("what is the response thjunk??", response)

    if (response.ok) {
        const editedAuction = await response.json();

        console.log("edited auction?", editedAuction)

        dispatch(updateAuction(editedAuction))
        return editedAuction;
    } else {
        const errors = await response.json();
        console.log('\n\n\nerrors from update auction thunk')
        return errors;
    }
}

export const deleteAuctionThunk = (auctionId) => async (dispatch) => {
    const response = await fetch(`/api/auctions/${auctionId}`, {
        method: "DELETE"})

    if (response.ok) {
        dispatch(deleteAuction(auctionId));
    } else {
        const errors = await response.json();
        return errors;
    }

}


const initialState = null;

export default function auctionReducer(state = initialState, action) {
    switch (action.type) {
        case GET_AUCTIONS:
            const newAuctions = {}

            console.log("action?", action)
            if (action.payload.length) {
                action.payload.forEach((auction) => {
                    newAuctions[auction.id] = auction
                })
            }
            return newAuctions;

        case CREATE_AUCTION:
            const resState = {...state};

            console.log("auction?", action.payload);

            resState[action.payload.id] = action.payload;
            return resState;

        case DELETE_AUCTION:
            const delState = {...state};
            const deleteAuctionId = action.payload;

            console.log("delete auction id", deleteAuctionId)

            try {
                delete delState[deleteAuctionId];
                console.log("auction successfully deleted; store")
            } catch (e) {
                console.log("unable to delete auction; store", e);
            }
            return delState;

        case UPDATE_AUCTION:
            const updateState = {...state};
            const updateAuction = action.payload;

            console.log(`store, updating auction ${updateAuction.name}`)

            try {
                updateState[updateAuction.id] = updateAuction;
                console.log(`auction ${updateAuction.name} successfully updated; store`)
            } catch {
                console.log("Unable to update auction; store")
            }
            return updateState;


        default:
            return state;
    }
}
