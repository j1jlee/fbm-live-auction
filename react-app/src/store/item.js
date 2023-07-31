import { faPray } from "@fortawesome/free-solid-svg-icons";

// constants
const CREATE_ITEM = "session/CREATE_ITEM";
const GET_ITEMS = "session/GET_ITEMS";
const UPDATE_ITEM = "session/UPDATE_ITEM";
const DELETE_ITEM = "session/DELETE_ITEM";

const TRADE_ITEM = "session/TRADE_ITEM";

// const TEST_DELETE_AWS = "session/TEST_DELETE_AWS";

const getItems = (items) => ({
    type: GET_ITEMS,
    payload: items
})

const createItem = (item) => ({
    type: CREATE_ITEM,
    payload: item
})

const updateItem = (item) => ({
    type: UPDATE_ITEM,
    payload: item
})

const deleteItem = (itemId) => ({
    type: DELETE_ITEM,
    payload: itemId
})

const tradeItem = (item) => ({
    type: TRADE_ITEM,
    payload: item
})





//thunk here

export const testDeleteAWSThunk = (testInput) => async (dispatch) => {

    console.log("\n\n\nat testDelete thunk, testINput", testInput)
    const formData = new FormData();

    formData.append("testInput", testInput)

    const response = await fetch("/api/items/aws_delete_test",
    {
        method: "POST",
        // headers: {"Content-Type": "application/json"},
        body: formData
        // body: JSON.stringify(testInput)
    })

    if (response.ok) {
        return "great job everybody, go home"
    }
}

export const getItemsThunk = () => async (dispatch) => {
    const response = await fetch("/api/items/");
    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return ({"error": "Failed retrieving items fetch"})
        }
        dispatch(getItems(data.items));
        return data.items
    }

}

export const createItemThunk = (item) => async (dispatch) => {

    console.log("\n\n\nat createItemThunk, item", item)


    // const response = await fetch("/api/items/new",
    // {
    //     method: "POST",
    //     headers: {"Content-Type": "application/json"},
    //     body: JSON.stringify(item)
    // })

    const { name, description, lastKnownPriceCents, imageUrl, ownerId, image } = item;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('lastKnownPriceCents', lastKnownPriceCents);
    formData.append('imageUrl', imageUrl)
    formData.append('ownerId', ownerId)

    if (image) {
        formData.append('image', image)
    }



    const response = await fetch("/api/items/new",
    {
        method: "POST",
        //headers: {"Content-Type": "multipart/form-data"},
        body: formData
    })



    if (response.ok) {
        const newItem = await response.json();
        dispatch(createItem(newItem))
        return newItem;
    } else {
        const errors = await response.json();
        console.log("\n\n\nerrors from create item thunk", errors)
        return errors;
    }
}

export const tradeItemThunk = (itemId, updateObj) => async (dispatch) => {
    console.log("at trade item thunk")
    const {lastKnownPriceCents, ownerId} = updateObj;

    const response = await fetch(`/api/items/${itemId}/trade`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(updateObj)
    })

    if (response.ok) {
        const tradedItem = await response.json();

        console.log("traded item?", tradedItem)

        dispatch(updateItem(tradedItem))
        // dispatch(tradeItem(tradedItem))
        return tradedItem;
    } else {
        const errors = await response.json();
        console.log('\n\n\nerrors from update item thunk')
        return errors;
    }
}


export const updateItemThunk = (item, oldItemId) => async (dispatch) => {
    //item here is an object containing JUST the attributes to change
    //oldItemId refers to the item we're updating
    console.log("at update item thunk, item", item)
    console.log("thunk, item.id??", oldItemId)

    const response = await fetch(`/api/items/${oldItemId}`, {
        method: "PUT",
        // method: "UPDATE",
        headers: {"Content-Type": "application/json"},
        // body: item
        body: JSON.stringify(item)
    })

    // console.log("what is the response thjunk??", response)

    if (response.ok) {
        const editedItem = await response.json();

        console.log("edited item?", editedItem)

        dispatch(updateItem(editedItem))
        return editedItem;
    } else {
        const errors = await response.json();
        console.log('\n\n\nerrors from update item thunk')
        return errors;
    }
}

export const deleteItemThunk = (itemId) => async (dispatch) => {
    const response = await fetch(`/api/items/${itemId}`, {
        method: "DELETE"})

    if (response.ok) {
        dispatch(deleteItem(itemId));
    } else {
        const errors = await response.json();
        return errors;
    }

}

// export const authenticate = () => async (dispatch) => {
//     const response = await fetch("/api/auth/", {
//         headers: {
//             "Content-Type": "application/json",
// 		},
// 	});
// 	if (response.ok) {
//         const data = await response.json();
// 		if (data.errors) {
//             return;
// 		}

// 		dispatch(setUser(data));
// 	}
// };

/*
const CREATE_ITEM = "session/CREATE_ITEM";
const GET_ITEMS = "session/GET_ITEMS";
const UPDATE_ITEM = "session/UPDATE_ITEM";
const DELETE_ITEM = "session/DELETE_ITEM"; */

const initialState = null;

export default function itemReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ITEMS:
            const newItems = {}

            console.log("action?", action)
            if (action.payload.length) {
                action.payload.forEach((item) => {
                    newItems[item.id] = item
                })
            }
            return newItems;
        case CREATE_ITEM:
            const resState = {...state};

            console.log("item?", action.payload);

            resState[action.payload.id] = action.payload;
            return resState;
        case DELETE_ITEM:
            const delState = {...state};
            const deleteItemId = action.payload;

            console.log("delete item id", deleteItemId)

            try {
                delete delState[deleteItemId];
                console.log("item successfully deleted; store")
            } catch (e) {
                console.log("unable to delete item; store");
            }
            return delState;

        case UPDATE_ITEM:
            const updateState = {...state};
            const updateItem = action.payload;

            console.log(`store, updating item ${updateItem.name}`)

            try {
                updateState[updateItem.id] = updateItem;
                console.log(`item ${updateItem.name} successfully updated; store`)
            } catch {
                console.log("Unable to update item; store")
            }
            return updateState;


        default:
            return state;
    }
}
