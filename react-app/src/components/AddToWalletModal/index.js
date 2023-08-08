import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal"
;
import { useHistory } from "react-router-dom";

import { editWalletThunk } from "../../store/session";
import { dollarsNumToCents } from "../aaaMiddleware";

import './AddToWalletModal.css';

function AddToWalletModal() {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);

  const currentUser = useSelector(state => state.session.user)

  const [cardName, setCardName] = useState(`${currentUser.firstname} ${currentUser.lastname}` || '')
  const [cardNumber, setCardNumber] = useState("0000111100001111");
  const [cardMonth, setCardMonth] = useState("00");
  const [cardYear, setCardYear] = useState("00");
  const [addAmount, setAddAmount] = useState(0);


  const { closeModal } = useModal();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const submitErrors = [];

    // if (auctionName.length === 0 || auctionName.length > 200) {
    //   submitErrors.push({auctionName: "Name length must be between 1 and 200 characters"})
    // }
    if (addAmount < 1) {
      submitErrors.push({addAmount: "Amount to Add must be greater than 1.00"})
    }

    if (addAmount > 99999) {
      submitErrors.push({excessive: "Cannot add more than five figures"})
    }

    if (submitErrors.length === 1 &&
        (cardNumber.length < 16 ||
          cardMonth.length < 2 ||
          cardYear.length < 2)) {
      submitErrors.push({otherErrors: "Please fill out inputs (optional)"})
    }


    if (submitErrors.length) {
        setErrors(submitErrors)
        return;
    }

      dispatch(editWalletThunk(currentUser.id, dollarsNumToCents(addAmount)))

      history.push("/");
      closeModal();
    }

    //.replace(/[^0-9]/, '')}
    const processCardNumber = (cardInput) => {
      return cardInput.trim().replace(/[^0-9]/, '')
    }

    const preventNegative = (numInput) => {
      if (numInput < 0) return 0;
      else return numInput;
    }

  return (
    <>
      {/* <h1>Add Funds to Wallet</h1> */}


        <h1 className="wallet-title">Add Funds to Wallet</h1>

      <form onSubmit={handleSubmit} method={"POST"}>

      <div className="wallet-card-wrapper">

        <ul className="modal-errors wallet-modal-errors">
          { errors.length ?
              errors.map((error) => {
              const errorEntry = Object.entries(error);
              return (<li>{errorEntry[0][1]}</li>)
          })
            :
            (<>
            <h2 className="wallet-card-title">Card Information</h2>
            <br></br>
            </>)
        }


        </ul>

        <div>
        <label>
          Card Number
          <input
            className="wallet-number-input"
            type="text"
            value={cardNumber}
            maxlength="16"
            onChange={(e) => {
              const tempCardNum = e.target.value;
              setCardNumber(processCardNumber(tempCardNum))
              }
            }
            //   required
          />
        </label>
        </div>

        <div className="wallet-date">
              <p>Name on Card</p>
          <div className="wallet-date-inner">
        <p>GOOD THRU</p>
        <label>
          <input
            // id="create-rename-input"
            type="text"
            value={cardMonth}
            maxlength="2"
            onChange={(e) => {
              setCardMonth(processCardNumber(e.target.value))
              }
            }
            //   required
          />
        </label>
            <span>/</span>
        <label>
          <input
            // id="create-rename-input"
            type="text"
            value={cardYear}
            maxLength="2"
            onChange={(e) => {
              setCardYear(processCardNumber(e.target.value));
              }
            }
            //   required
          />
        </label>
          </div>
        </div>

        <div>
        <label>
          {/* Name on Card */}
          <input
            className="wallet-name"
            type="text"
            value={cardName.toUpperCase()}
            onChange={(e) => {
              setCardName(e.target.value)
              }
            }
            //   required
          />
        </label>
        </div>


      </div> {/* end of credit card wrapper */}



          <br></br>
          <hr></hr>
          <br></br>
          <div className="wallet-amount-outer">
          <div className="wallet-amount-inner">

            <label className="wallet-amount-label">
              Amount to Add:
            </label>

            <br></br>
            <div className="wallet-amount-add">
            <input
              type="number"
              value={addAmount}
              onChange={(e) => {
                setAddAmount(preventNegative(e.target.value))
                }
              }
              //   required
            />
          USD
            </div>
          </div>
          </div>

            <br></br>
        <button type="submit" className="wallet-add-button">Add to Wallet</button>
      </form>



    </>
  );
}

export default AddToWalletModal;
