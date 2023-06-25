
import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getItemsThunk } from "../../store/item";

import { centsToDollars } from "../aaaMiddleware";

function ItemDetailPage() {

    const dispatch = useDispatch();
    const { itemId } = useParams();

    console.log("itemId?", itemId)

    useEffect(() => {
        dispatch(getItemsThunk())
    }, [dispatch])

    const allItems = useSelector((state) => state.items);

    const item = allItems ? allItems[itemId] : "";

    console.log("Item?", item)

    // console.log("does this work? assistItemId", allItems.assistItemId)

    return (item ? (
        <div className="item-list-node">
        <ul key={item.id}>
        <li key={"id" + item.id}>Item ID: {item.id}</li>
        <li key={"name" + item.name}>Name: {item.name}</li>
       <li key={"desc" + item.description}>Description: {item.description}</li>
       <li key={item.lastKnownPriceCents}>lastKnownPrice: {centsToDollars(item.lastKnownPriceCents)}</li>
       <li key={item.imageUrl}>imageUrl: {item.imageUrl}</li>
       <li key={"owner" + item.ownerId}>ownerId: {item.ownerId}</li>
       </ul>
       {/* <OpenModalButton
            buttonText="Update Item"
            modalComponent={<ItemUpdateModal update_item={item}/>}
        />

       <OpenModalButton
            buttonText="Delete Item"
            modalComponent={<ItemDeleteModal itemId={item.id}/>}
        /> */}

        </div>
    ) : <p>Item doesn't exist!</p>)
}


export default ItemDetailPage;
