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

import { centsToDollars, imageHandle } from "../aaaMiddleware";


function ItemListPage() {

    const dispatch = useDispatch();
    const allItems = useSelector(state => state.items)
    const currentUser = useSelector(state => state.session.user)
    const history = useHistory();

    const allItemsList = allItems ? Object.values(allItems) : []

    currentUser ? console.log("currentUser exists") : history.push("/");




    const userItemsList = allItemsList && currentUser ? (allItemsList.filter((item) => item.ownerId === currentUser.id)).reverse() : []
    // const userItemsList = allItemsList && currentUser ? allItemsList.filter((item) => item.ownerId === currentUser.id) : []

    const otherItemsList = allItemsList && currentUser ? allItemsList.filter((item) => item.ownerId !== currentUser.id) : []

    // console.log("userItemsList?", userItemsList)


    useEffect(() => {
        dispatch(getItemsThunk())
    }, [dispatch])

    // console.log("ALL ITEMS", allItems)
    // console.log("ALL ITEMS LIST", allItemsList)

    //redirect user to landing page if not logged in


    return (
        <>
        <h2 className="item-list-inventory">Inventory</h2>
        <p className="item-list-title-description">Items you've uploaded, or won in auctions go here!</p>

        {/* <div> */}
        <div className={userItemsList.length ? "item-list-container" : "item-list-container-empty"}>
            {userItemsList.length ? userItemsList.map((item) => (
            // {allItemsList ? allItemsList.map((item) => (
                <>

                {/* <div className="item-list-container"> */}

                <div className="item-list-node item-list-node-hover">
                <ul key={item.id} className="item-list-ul" onClick={() => history.push(`/items/${item.id}`)}>
                {/* <li key={item.id}>Item ID: {item.id}</li> */}

               <li key={item.imageUrl} className="item-list-image">{imageHandle(item.imageUrl)}</li>
               {/* <li key={item.imageUrl}>imageUrl: {item.imageUrl}</li> */}



                <li key={item.id + item.name} className="item-list-name">{item.name.length > 30 ? item.name.substring(0, 27) + "..." : item.name}</li>
                {/* <li key={item.id + item.name} className="item-list-name">{ite30name}</li> */}

              {/* <li key={item.name}>Name: {item.name}</li> */}
               <li key={item.lastKnownPriceCents} className="item-list-price">$ {centsToDollars(item.lastKnownPriceCents)}</li>
               <li key={item.description}>{item.description.length > 50 ? item.description.substring(0, 50) + "..." : item.description}</li>

               {/* <li key={"owner" + item.ownerId}>ownerId: {item.ownerId}</li> */}
               <br></br>

               </ul>
               <span className="item-list-buttons">

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


                </div> {/* end of item list node */}
                {/*</div> new end of item container*/}
                </>
            )) :
                <div>
                <p>No items listed! Create a new Item, or try to win one from an auction!</p>

                <div className="item-list-no-items-button">
                <OpenModalButton
                    buttonText="Create New Item"
                    modalComponent={<ItemCreateModal />}
                />
                </div>

                </div>
            }
       </div>
       {/* original end to all items wrapper */}

        <h2>Other User's Items (Maybe you can win these in a future auction!)</h2>
        <div className="item-list-container item-list-horizontal">
            {otherItemsList ? otherItemsList.map((item) => (
            // {allItemsList ? allItemsList.map((item) => (
                <>
                <div className="item-list-node item-list-node-hover item-list-node-horizontal">
                <ul className="item-list-ul" onClick={() => history.push(`/items/${item.id}`)}>
                {/* <li key={item.id}>Item ID: {item.id}</li> */}
               <li key={item.imageUrl} className="item-list-image item-list-image-others">{imageHandle(item.imageUrl)}</li>
               {/* <li key={item.imageUrl}>imageUrl: {item.imageUrl}</li> */}


                <li key={item.id + item.name} className="item-list-name">{item.name.length > 30 ? item.name.substring(0, 27) + "..." : item.name}</li>
                {/* <li key={item.id + item.name} className="item-list-name">{item.name}</li> */}

                {/* <li key={item.name}>Name: {item.name}</li> */}
               {/* <li key={item.description}>Description: {item.description}</li> */}
               <li key={item.lastKnownPriceCents} className="item-list-price">$ {centsToDollars(item.lastKnownPriceCents)}</li>

               <li key={item.description}>{item.description.length > 50 ? item.description.substring(0, 50) + "..." : item.description}</li>

               {/* <li key={item.lastKnownPriceCents}>Last Price: {centsToDollars(item.lastKnownPriceCents)}</li> */}
               {/* <li key={item.lastKnownPriceCents}>lastKnownPrice: {item.lastKnownPriceCents}</li> */}
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

                </div> {/* end of item list node */}

                </>
            )) : <li>No items listed</li>
            }
        </div>
        </>
    )
}


export default ItemListPage;
