import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";



// import { logout } from "../../store/session";
// import OpenModalButton from "../OpenModalButton";
// import LoginFormModal from "../LoginFormModal";
// import SignupFormModal from "../SignupFormModal";
import "./ItemListPage.css"
import { getItemsThunk } from "../../store/item";

import ItemCreateModal from "../ItemCreateModal";
import ItemDeleteModal from "../ItemDeleteModal";
import ItemUpdateModal from "../ItemUpdateModal";
import OpenModalButton from "../OpenModalButton";


function ItemListPage() {

    const dispatch = useDispatch();
    const allItems = useSelector(state => state.items)
    const currentUser = useSelector(state => state.session.user)
    const history = useHistory();

    const allItemsList = allItems ? Object.values(allItems) : []


    useEffect(() => {
        dispatch(getItemsThunk())
    }, [dispatch])

    // console.log("ALL ITEMS", allItems)
    // console.log("ALL ITEMS LIST", allItemsList)

    //redirect user to landing page if not logged in
    currentUser ? console.log("currentUser exists") : history.push("/");


    return (
        <>
        <h2>Inventory</h2>



        {/* <div>
        <OpenModalButton
                    buttonText="Create New Item"
                    modalComponent={<ItemCreateModal />}
                />
        </div> */}
        <div className="item-list-container">
            {allItemsList ? allItemsList.map((item) => (
                <>
                <div className="item-list-node">
                <ul>
                <li key={item.id}>Item ID: {item.id}</li>
                <li key={item.name}>Name: {item.name}</li>
               <li key={item.description}>Description: {item.description}</li>
               <li key={item.lastKnownPriceCents}>lastKnownPrice: {item.lastKnownPriceCents}</li>
               <li key={item.imageUrl}>imageUrl: {item.imageUrl}</li>
               <li key={"owner" + item.ownerId}>ownerId: {item.ownerId}</li>
               </ul>
               <OpenModalButton
                    buttonText="Update Item"
                    modalComponent={<ItemUpdateModal update_item={item}/>}
                />

               <OpenModalButton
                    buttonText="Delete Item"
                    modalComponent={<ItemDeleteModal itemId={item.id}/>}
                />

                </div> {/* end of item list node */}

                </>
            )) : <li>No items listed</li>
            }
        </div>
        </>
    )
}


export default ItemListPage;
