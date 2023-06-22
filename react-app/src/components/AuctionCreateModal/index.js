import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal"
;
import { useHistory } from "react-router-dom";

import { createAuctionThunk } from "../../store/auction"

function AuctionCreateModal() {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);
  const [auctionName, setAuctionName] = useState("");
  const [auctionDescription, setAuctionDescription] = useState("");
  //should auctionOpen be an available switch?
  const [startingBidCents, setStartingBidCents] = useState(0.00);
  const [auctionItemId, setAuctionItemId] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const currentUser = useSelector(state => state.session.user)
  const allItems = useSelector(state => state.items)

  const allItemsList = allItems ? Object.values(allItems) : []
  const myItemsList = allItemsList.filter((item) => {
    return item.ownerId === currentUser.id
  })

//   console.log("\n\n\nmyItemsList?", myItemsList)

  const { closeModal } = useModal();

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const submitErrors = [];

    if (auctionName.length === 0 || auctionName.length > 200) {
      submitErrors.push({auctionName: "Name length must be between 1 and 200 characters"})
    }
    if (auctionDescription.length === 0 || auctionDescription.length > 300) {
      submitErrors.push({itemName: "Description length must be between 1 and 300 characters"})
    }
    if (startingBidCents <= 0) {
        submitErrors.push({itemPrice: "Starting Bid must be greater than $0.00"
    })
    }

    // const validImageSuffix = ["png", "jpg", "jpeg", "gif", "tiff", "bmp"]
    // if (auctionImageUrl.split(".").length === 1 || validImageSuffix.indexOf(auctionImageUrl.split(".")[1]) === -1) {
    //     // console.log("add the error, no . OR wrong suffix")
    //     submitErrors.push({auctionImageUrl: "image URL should be format 'png', 'jpg', 'jpeg', 'gif', 'tiff', or 'bmp'"})
    // }


    console.log("\n\n\nstartTime???", startTime)
    console.log("typeof startTime???", typeof startTime)
    console.log("\n\n\nendTime???", endTime)
    console.log("typeof endTime???", typeof endTime)

    const timeNow = new Date();
    const timeNowMilli = timeNow.getTime();

    const startDateTimeIntoObj = new Date(startTime);
    const endDateTimeIntoObj = new Date(endTime);

    console.log("\n\n\nis this working??", startDateTimeIntoObj)
    console.log("\n\n\ntypeof??", typeof startDateTimeIntoObj)
    console.log("\n\n\ndate obj to string?????", startDateTimeIntoObj.toString())

    if (startTime == "" || endTime == "") {
        submitErrors.push({Time: "Please select a starting and ending date"})
    }

    if (startDateTimeIntoObj.getTime() < timeNowMilli) {
        submitErrors.push({startTime: "Starting time must be after current time"})
    }

    if (startDateTimeIntoObj.getTime() > endDateTimeIntoObj.getTime()) {
        submitErrors.push({endTime: "Ending time must be later than starting time"})
    }

    if (auctionItemId === 0) {
        submitErrors.push({auctionItemId: "Please select an Item to auction"})
    }



    if (submitErrors.length) {
        setErrors(submitErrors)
        return;
    }


    const newAuction = {
       auctionName,
       auctionDescription,
       startingBidCents: startingBidCents * 100,
    //    startTime,
    //    endTime,
        startTime: startDateTimeIntoObj.toString(),
        endTime: endDateTimeIntoObj.toString(),
       auctionItemId,
       sellerId: currentUser.id

    };

      const result = dispatch(createAuctionThunk(newAuction));
      if (result) {
        setErrors(result.errors)
      }

      history.push("/");
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
      <h1>Create New Auction</h1>
      <form onSubmit={handleSubmit} method={"POST"}>

        <ul>
          {errors.map((error) => {
            const errorEntry = Object.entries(error);
            return (<li>{errorEntry[0][1]}</li>)
        })}
        </ul>

        <div>
        <label>
          Auction Name
          <input
            // id="create-rename-input"
            type="text"
            value={auctionName}
            onChange={(e) => {
              setAuctionName(e.target.value)
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
            value={auctionDescription}
            onChange={(e) => {
              setAuctionDescription(e.target.value)
              }
            }
            //   required
          />
        </label>
        </div>

        <div>
        <label>
          Starting Bid
          <input
            // id="create-rename-input"
            type="number"
            value={startingBidCents}
            onChange={(e) => {
              setStartingBidCents(e.target.value)
              }
            }
            //   required
          />
        </label>
        </div>

        <label>
          Item to Auction
        </label>
            <select name="auctionItemId"
                onChange={(e) => {
                    setAuctionItemId(e.target.value)
                }
                }>
                <option value={""}>-Select Item-</option>
                {myItemsList.map((myItem) => (
                    <option value={myItem.id}>{myItem.name}</option>
                ))}

            </select>

        <label>
            Start Date
            <input
            // id="create-rename-input"
            type="datetime-local"
            value={startTime}
            onChange={(e) => {
                setStartTime(e.target.value)
                // console.log("typeof datetime local??", typeof startTime)
                // console.log("datetime local??", startTime)
                // console.log("into date?", Date(startTime))
                // const timeTest = new Date(startTime)
                // const timeNowTest = new Date()
                // console.log("into date getTime()?", timeTest.getTime())
                // console.log("now getTime()", timeNowTest.getTime())
                }
            }
            //   required
            />
        </label>

        <label>
            End Date
            <input
            // id="create-rename-input"
            type="datetime-local"
            value={endTime}
            onChange={(e) => {
                setEndTime(e.target.value)
                }
            }
            //   required
            />
        </label>




        <button type="submit">Create Auction</button>
      </form>

      </div>
    </>
  );
}

export default AuctionCreateModal;
