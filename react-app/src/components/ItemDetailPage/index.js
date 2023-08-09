
import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getItemsThunk } from "../../store/item";

import { centsToDollars, imageHandle } from "../aaaMiddleware";

import ItemDeleteModal from "../ItemDeleteModal";
import ItemUpdateModal from "../ItemUpdateModal";
import OpenModalButton from "../OpenModalButton";

import "./ItemDetailPage.css";

function ItemDetailPage() {

    const dispatch = useDispatch();
    const { itemId } = useParams();

    console.log("itemId?", itemId)

    useEffect(() => {
        dispatch(getItemsThunk())
    }, [dispatch])

    const allItems = useSelector((state) => state.items);
    const currentUser = useSelector(state => state.session.user);

    const item = allItems ? allItems[itemId] : "";

    console.log("Item?", item)

    // console.log("does this work? assistItemId", allItems.assistItemId)

    return (item ? (
        <>
        <h2>Item Details</h2>
        <br></br>
        <div className='item-detail-grid'>

        <div className="item-detail-picture">
            {/* <li key={item.imageUrl}>imageUrl: {item.imageUrl}</li> */}
            {imageHandle(item.imageUrl)}
        </div>



        <div className="item-detail-list">
        <ul key={item.id}>
        {/* <li key={"id" + item.id}>Item ID: {item.id}</li> */}
        <li key={"name"}>Item Name:</li>
        <li>{item.name}</li>
        <br></br>
       <li key={"desc"}>Description:</li>
       <li>{item.description}</li>
        <br></br>
       <li key={item.lastKnownPriceCents}>Last Known Price:</li>
       <li> $ {centsToDollars(item.lastKnownPriceCents)}</li>
        <br></br>
       <li key={"owner" + item.ownerId}>Current Owner Id: </li>
       <li> {item.ownerId}</li>
       </ul>

       <br></br>
       {currentUser && currentUser.id == item.ownerId ?

       <span className="item-detail-buttons">

               <OpenModalButton
                    className="item-list-update-button"
                    buttonText="Update Item"
                    modalComponent={<ItemUpdateModal update_item={item}/>}
                    />

               <OpenModalButton
                    className="item-list-delete-button"
                    buttonText="Delete Item"
                    modalComponent={<ItemDeleteModal itemId={item.id}/>}
                />
        </span>
            :
        ""
        }

       {/* <OpenModalButton
            buttonText="Update Item"
            modalComponent={<ItemUpdateModal update_item={item}/>}
        />

       <OpenModalButton
            buttonText="Delete Item"
            modalComponent={<ItemDeleteModal itemId={item.id}/>}
        /> */}

        </div>

        </div>
        </>
    ) : <p>Item doesn't exist!</p>)
}


export default ItemDetailPage;
