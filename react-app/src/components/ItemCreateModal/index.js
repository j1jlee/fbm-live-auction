import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";

import { createItemThunk } from "../../store/item"

function ItemCreateModal() {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState(0.00);
  const [itemImageUrl, setItemImageUrl] = useState("");

  const currentUser = useSelector(state => state.session.user)

  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const submitErrors = [];

    if (itemName.length === 0 || itemName.length > 100) {
      submitErrors.push({itemName: "Name length must be between 1 and 100 characters"})
    }
    if (itemDescription.length === 0 || itemDescription.length > 350) {
      submitErrors.push({itemName: "Description length must be between 1 and 350 characters"})
    }
    if (itemPrice <= 0) {
        submitErrors.push({itemPrice: "Price must be greater than 0.00"
    })
    }

    const validImageSuffix = ["png", "jpg", "jpeg", "gif", "tiff", "bmp"]

    const itemImageUrlSplit = itemImageUrl.split(".");
    const itemImageUrlSuffix = itemImageUrlSplit[itemImageUrlSplit.length - 1]


    if (itemImageUrl.split(".").length === 1 || validImageSuffix.indexOf(itemImageUrlSuffix) === -1) {
    // if (itemImageUrl.split(".").length === 1 || validImageSuffix.indexOf(itemImageUrl.split(".")[1]) === -1) {
        // console.log("add the error, no . OR wrong suffix")
        submitErrors.push({itemImageUrl: "image URL should be format 'png', 'jpg', 'jpeg', 'gif', 'tiff', or 'bmp'"})
    }

    if (itemImageUrlSplit.length == 2 && itemImageUrlSplit[0].length === 0) {
      submitErrors.push({itemImage: "image file should have a name (suffix with no name)"})
    }


    if (submitErrors.length) {
        setErrors(submitErrors)
        return;
    }


    const newItem = {
        name: itemName,
        description: itemDescription || "No description",
        lastKnownPriceCents: parseInt(itemPrice * 100),
        imageUrl: itemImageUrl,
        ownerId: currentUser.id
    };

      const result = dispatch(createItemThunk(newItem));
      if (result) {
        setErrors(result.errors)
      }
      closeModal();
    }

    // if (errors) {
    //     console.log("\n\n\n errors???", errors)
    //     errors.map((error) => {
    //         console.log("ERROR", Object.entries(error))
    //         console.log("ERROR", Object.entries(error)[0][1])
    //     })
    // }

  return (
    <>
      <div id="item-create-modal">
      <h1 id="item-create-title">Create New Item</h1>
      <form id="item-create-form" onSubmit={handleSubmit} method={"POST"}>

        <ul className="modal-errors">
        {/* <ul id="item-create-errors-ul"> */}
          {errors.map((error) => {
            const errorEntry = Object.entries(error);
            return (<li>{errorEntry[0][1]}</li>)
        })}
        </ul>

        <div>
          Item Name
        </div>

        <div>
        <label>
          <input
            // id="create-rename-input"
            type="text"
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value)
              }
            }
            //   required
          />
        </label>
        </div>

        <div>
        Description
        </div>

        <div >
        <label>
          <input
          className="modal-description"
            // id="create-rename-input"
            type="textarea"
            value={itemDescription}
            onChange={(e) => {
              setItemDescription(e.target.value)
              }
            }
            //   required
          />
        </label>
        </div>

        <div>
          Price
        </div>

        <div>
        <label>
          <input
            // id="create-rename-input"
            type="number"
            value={itemPrice}
            onChange={(e) => {
              setItemPrice(e.target.value)
              }
            }
            //   required
          />
        </label>
        </div>

        <div>
          Image URL
        </div>

        <label>
          <input
            // id="create-rename-input"
            type="text"
            value={itemImageUrl}
            onChange={(e) => {
              setItemImageUrl(e.target.value)
              }
            }
            //   required
          />
        </label>

          <div>
            <br></br>
          </div>
      <div>
        <button type="submit">Create Item</button>
      </div>

      </form>

      </div>
    </>
  );
}

export default ItemCreateModal;
