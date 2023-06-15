// constants
const CREATE_ITEM = "session/CREATE_ITEM";
const GET_ITEMS = "session/GET_ITEMS";
const UPDATE_ITEM = "session/UPDATE_ITEM";
const DELETE_ITEM = "session/DELETE_ITEM";


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


//thunk here
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
    const response = await fetch("/api/items/new",
    {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(item)
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


        default:
            return state;
    }
}
