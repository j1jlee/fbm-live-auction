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

const deleteItem = (item) => ({
    type: DELETE_ITEM,
    payload: item
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
        default:
            return state;
    }
}
