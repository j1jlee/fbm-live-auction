import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

import { updateItemThunk } from "../../store/item"

function ItemUpdateModal({update_item}) {
  const dispatch = useDispatch();

  const [errors, setErrors] = useState([]);
  const [itemName, setItemName] = useState(update_item.name);
  const [itemDescription, setItemDescription] = useState(update_item.description);
//   const [itemPrice, setItemPrice] = useState(0.00);
  const [itemImageUrl, setItemImageUrl] = useState(update_item.imageUrl);
//   const currentUser = useSelector(state => state.session.user)
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const submitErrors = [];

    if (itemName.length === 0 || itemName.length > 100) {
      submitErrors.push({itemName: "Name length must be between 1 and 100 characters"})
    }


    console.log("\n\n\nchecking for item description validation", itemDescription)
    console.log("Length of itemdescription", itemDescription.length)

    if (itemDescription.length === 0 || itemDescription.length > 250) {
      submitErrors.push({itemName: "Description length must be between 1 and 250 characters"})
    }
    // if (itemPrice <= 0) {
    //     submitErrors.push({itemPrice: "Price must be greater than 0.00"
    // })
    // }

    const validImageSuffix = ["png", "jpg", "jpeg", "gif", "tiff", "bmp"]

    // if (itemImageUrl.split(".").length === 1 || validImageSuffix.indexOf(itemImageUrl.split(".")[1]) === -1) {
    //     // console.log("add the error, no . OR wrong suffix")
    //     submitErrors.push({itemImageUrl: "image URL should be format 'png', 'jpg', 'jpeg', 'gif', 'tiff', or 'bmp'"})
    // }

    //brought over from create modal
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

    //end of import


    if (submitErrors.length) {
        setErrors(submitErrors)
        return;
    }

    const updateItem = {};
    if (itemName !== update_item.name) updateItem.name = itemName;
    if (itemDescription !== update_item.description) updateItem.description = itemDescription;
    if (itemImageUrl !== update_item.imageUrl) updateItem.imageUrl = itemImageUrl;

    // const newItem = {
    //     name: itemName,
    //     description: itemDescription || "No description",
    //     lastKnownPriceCents: parseInt(itemPrice * 100),
    //     imageUrl: itemImageUrl,
    //     ownerId: currentUser.id
    // };

    //   return dispatch(updateItemThunk(updateItem, update_item.id))
    //         .then(closeModal())
    //         // .catch(async (res) => {
    //         //     const data = await res.json();
    //         //     if (data && data.errors) setErrors(data.errors);
    //         // })
    //         .catch(e => {
    //             console.log("dispatch error on update:", e)
    //         })

    //   closeModal();
    // }
    if (Object.entries(updateItem).length === 0) {
        console.log("No changes detected");
        closeModal();
        return;
    }

    try {
          const result = dispatch(updateItemThunk(updateItem, update_item.id));
          if (result.errors) {
            setErrors(result.errors)
            return;
          }
          closeModal();
          return;
      } catch (e) {
        console.log("what is the error?", e)
        return;
      }

    }


  return (
    <>
      <div>
      <h1>Update Item</h1>
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


        <button type="submit">Update Item</button>
      </form>

      </div>
    </>
  );
}

export default ItemUpdateModal;
