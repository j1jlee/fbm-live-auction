import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../../store/session";
// import OpenModalButton from "../OpenModalButton";
// import LoginFormModal from "../LoginFormModal";
// import SignupFormModal from "../SignupFormModal";
import "./ItemListPage.css"
import { getItemsThunk } from "../../store/item";

import ItemCreateModal from "../ItemCreateModal";
import OpenModalButton from "../OpenModalButton";


function ItemListPage() {

    const dispatch = useDispatch();
    const allItems = useSelector(state => state.items)
    const allItemsList = allItems ? Object.values(allItems) : []

    useEffect(() => {
        dispatch(getItemsThunk())
    }, [dispatch])

    console.log("ALL ITEMS", allItems)
    console.log("ALL ITEMS LIST", allItemsList)

    return (
        <>
        <h1>Item list Page here!</h1>

        <div>
        <OpenModalButton
                    buttonText="Create New Item"
                    modalComponent={<ItemCreateModal />}
                />
        </div>
        <div>
            {allItemsList ? allItemsList.map((item) => (
                <>
                <ul key={item.id}>
                <li>Item ID: {item.id}</li>
                <li>Name: {item.name}</li>
               <li>Description: {item.description}</li>
               </ul>
                </>
            )) : <li>No items listed</li>
            }
        </div>
        </>
    )
}


export default ItemListPage;
