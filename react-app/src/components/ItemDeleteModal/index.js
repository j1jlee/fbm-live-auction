// import React, { useState } from "react";
import { useDispatch } from "react-redux";
// import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";

import { deleteItemThunk } from "../../store/item"

function ItemDeleteModal({itemId}) {
  const dispatch = useDispatch();
  const history = useHistory();

  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const deleteItem = dispatch(deleteItemThunk(itemId))
    // if (deleteItem) {
    //     console.log("delete item", deleteItem)
    // }
      history.push('/items');
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
