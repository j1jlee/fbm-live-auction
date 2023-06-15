import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";

import { deleteItemThunk } from "../../store/item"

function ItemDeleteModal({itemId}) {
  const dispatch = useDispatch();

  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const deleteItem = dispatch(deleteItemThunk(itemId))
    if (deleteItem) {
        console.log("delete failed?", deleteItem)
    }
      closeModal();
    }


  return (
    <>
      <div>
      <h1>Delete Item?</h1>
      <button onClick={handleSubmit}>Yes</button>
      <button onClick={closeModal}>No</button>

      </div>
    </>
  );
}

export default ItemDeleteModal;
