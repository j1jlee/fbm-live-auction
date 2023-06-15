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
    if (itemDescription.length === 0 || itemDescription.length > 250) {
      submitErrors.push({itemName: "Description length must be between 1 and 250 characters"})
    }
    if (itemPrice <= 0) {
        submitErrors.push({itemPrice: "Price must be greater than 0.00"
    })
    }

    const validImageSuffix = ["png", "jpg", "jpeg", "gif", "tiff", "bmp"]
    // console.log("itemimageurl", itemImageUrl)
    // console.log("imageUrl.split(',')", itemImageUrl.split("."))
    // console.log("suffix test", itemImageUrl.split(".")[1]);
    // console.log("split length", itemImageUrl.split(".").length)

    if (itemImageUrl.split(".").length === 1 || validImageSuffix.indexOf(itemImageUrl.split(".")[1]) === -1) {
        // console.log("add the error, no . OR wrong suffix")
        submitErrors.push({itemImageUrl: "image URL should be format 'png', 'jpg', 'jpeg', 'gif', 'tiff', or 'bmp'"})
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
      <div>
      <h1>Create New Item</h1>
      <form onSubmit={handleSubmit} method={"POST"}>

        <ul>
          {errors.map((error) => {
            const errorEntry = Object.entries(error);
            return (<li>{errorEntry[0][1]}</li>)
        })}
        </ul>

        <div>
        <label>
          Item Name
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
        <label>
          Description
          <input
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
        <label>
          Price
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

        <label>
          Image URL
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


        <button type="submit">Create Item</button>
      </form>

      </div>
    </>
  );
}

export default ItemCreateModal;
