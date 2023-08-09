
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

import { deleteAuctionThunk } from "../../store/auction"

import { socket } from "../LandingPageAuctionList";

function AuctionDeleteModal({auctionId}) {
  const dispatch = useDispatch();

  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const deleteAuction = await dispatch(deleteAuctionThunk(auctionId))
    // if (deleteAuction) {
    //     // console.log("delete failed?", deleteAuction)
    // }

      socket.emit("newAuctionEvent", { note: "new auction refresh"})
      closeModal();
    }


  return (
    <>
      <div>
      <h1>Delete Auction?</h1>
      <button onClick={handleSubmit}>Yes</button>
      <button onClick={closeModal}>No</button>

      </div>
    </>
  );
}

export default AuctionDeleteModal;
