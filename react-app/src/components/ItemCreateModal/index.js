import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";

import { useHistory } from "react-router-dom";


import { createItemThunk } from "../../store/item"

import './ItemCreateModal.css'

function ItemCreateModal() {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState(0.00);
  const [itemImageUrl, setItemImageUrl] = useState("");

  const [selectUploadBool, setSelectUploadBool] = useState(true);
  const [selectURLBool, setSelectURLBool] = useState(false);

  //const [awsOrUrl, setAwsOrUrl] = useState(true);


  const [image, setImage] = useState(null)
  const currentUser = useSelector(state => state.session.user)
  const history = useHistory();
  const { closeModal } = useModal();


  // useEffect(() => {

  // }, [selectUploadBool, selectURLBool])

  const updateFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      // console.log("file?", file)
      setImage(file)
    } else {
      // console.log("file cancelled?")
      setImage(null)
    };
  };


  const clickImageUpload = async () => {
      // console.log("clicked AWS image upload tab");
      setSelectUploadBool(true);
      setSelectURLBool(false);
  }

  const clickImageUrl = async () => {
      // console.log("clicked URL tab");
      setSelectUploadBool(false);
      setSelectURLBool(true);
  }

  const handleSubmit = async (e) => {

    // console.log("handleSubmit, createitem")

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


    //image url check, should apply ONLY IF selectURLBool is true
    //
    if (selectURLBool) {
        const validImageSuffix = ["png", "jpg", "jpeg", "gif", "tiff", "bmp"]

        const itemImageUrlSplit = itemImageUrl.split(".");
        const itemImageUrlSuffix = itemImageUrlSplit[itemImageUrlSplit.length - 1]

        try {
            const urlBeforeExtension = itemImageUrlSplit[itemImageUrlSplit.length - 2];
            let potentialFileName = urlBeforeExtension.split('/');
            potentialFileName = potentialFileName[potentialFileName.length - 1]


          if (!potentialFileName.trim().length) {
              submitErrors.push({itemImageUrl: "Image filename cannot be empty/consist of only blank spaces"})
            }
        } catch {}

        if (itemImageUrl.split(".").length === 1 || validImageSuffix.indexOf(itemImageUrlSuffix) === -1) {
        // if (itemImageUrl.split(".").length === 1 || validImageSuffix.indexOf(itemImageUrl.split(".")[1]) === -1) {
            // console.log("add the error, no . OR wrong suffix")
            submitErrors.push({itemImageUrl: "image URL should be format 'png', 'jpg', 'jpeg', 'gif', 'tiff', or 'bmp'"})
        }

        // if (itemImageUrlSplit.length == 2 && itemImageUrlSplit[0].length === 0) {
        //   submitErrors.push({itemImage: "image file should have a name (suffix with no name)"})
        // }
    }


    //if selectUploadBool is true, then ignore URL check
    // imageUrl should be sent out as null
    // only validation error here should be if image===null, then push to submitErrors



    if (submitErrors.length) {

        // console.log("\n\n\nsubmitErrors", submitErrors)
        setErrors(submitErrors)
        return;
    }

    const submitImage = selectUploadBool ? image : null;
    const submitImageUrl = selectURLBool ? itemImageUrl : '';

    //selectUploadBool, selectURLBool


    const newItem = {
        name: itemName.trim(),
        description: itemDescription.trim() || "No description",
        lastKnownPriceCents: parseInt(itemPrice * 100),
        ownerId: currentUser.id,

        // imageUrl: itemImageUrl,
        // image: image
        imageUrl: submitImageUrl,
        image: submitImage,
    };

    // console.log("newItem, before createItemThunk", newItem)

      const result = await dispatch(createItemThunk(newItem));
      // const result = await dispatch(createItemThunk(newItem));
      if (result && result.errors) {
        setErrors(result.errors)
      }

      // console.log("\n\n\nredirect to items?", result)
      history.push(`/items/${result.id}`);
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
      <form id="item-create-form" onSubmit={handleSubmit}>
      {/* <form id="item-create-form" onSubmit={handleSubmit} method={"POST"}> */}

        <ul className="modal-errors">
        {/* <ul id="item-create-errors-ul"> */}
          {errors.length ? errors.map((error) => {
            const errorEntry = Object.entries(error);
            return (<li>{errorEntry[0][1]}</li>)
        })
            : ""}
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

        <br></br>

        <div className="item-create-image-wrapper">
            <div className="item-create-image-tabs">
                <span className={"item-create-image-upload " +
                      (selectUploadBool ? "item-create-selected" :
                                        "item-create-deselected")}

                      onClick={clickImageUpload}
                                        >
                  Upload Image
                </span>

                <span className={"item-create-image-url " +
                      (selectURLBool ? "item-create-selected" :
                                "item-create-deselected")}

                      onClick={clickImageUrl}
                                >
                  URL
                </span>
            </div>


        <div className="item-create-image-input">
        {/* image upload */}
        <label className={selectUploadBool ? "" : "item-create-hide"}>
          <input type="file" onChange={updateFile} />
        </label>


          {/* image URL */}
        <label className={selectURLBool ? "" : "item-create-hide"}>
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
        </div>

        </div>







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
