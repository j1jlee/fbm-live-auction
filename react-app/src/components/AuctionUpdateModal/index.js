import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

import { updateAuctionThunk } from "../../store/auction"

function AuctionUpdateModal({update_auction}) {
  const dispatch = useDispatch();

  const [errors, setErrors] = useState([]);
  const [auctionName, setAuctionName] = useState(update_auction.auctionName);
  const [auctionDescription, setAuctionDescription] = useState(update_auction.auctionDescription);
  const [auctionStartingBidCents, setAuctionStartingBidCents] = useState(update_auction.startingBidCents);
  const [ boolSwitch, setBoolSwitch ] = useState(true);


  const [startTime, setStartTime] = useState(timeToISO(update_auction.startTime))
  const [endTime, setEndTime] = useState(timeToISO(update_auction.endTime))
//   const currentUser = useSelector(state => state.session.user)
  const { closeModal } = useModal();


    // const testTime = new Date(update_auction.startTime);
    // console.log("testTime", testTime)

    // console.log("testTime2?", testTime.toUTCString())

    function timeToISO(time) {
        const timeNow = new Date();
        // console.log("time to ISO, timenow", timeNow)
        const timeDiff = String(timeNow).split("GMT")[1].split(" ")[0]
        // const timeDiff = timeNow.split("GMT ")[1]

        // console.log("timeDiff", timeDiff)

        let posOrNeg = 1;

        if (timeDiff[0] === "-") {
            // console.log("negative offset?")
            posOrNeg = -1;
        }
        else if (timeDiff[0] === "+") {
            // console.log("positive offset?")
            posOrNeg = 1;
        }

        const hourOffset = parseInt(timeDiff.substring(1, 3));
        const minOffset = parseInt(timeDiff.substring(3, 5));
        // console.log("houroffset", hourOffset)
        // console.log("minoffset", minOffset)

        const updateDT = new Date(time);

        updateDT.setHours(updateDT.getHours() + (hourOffset * posOrNeg))
        updateDT.setMinutes(updateDT.getMinutes() + (minOffset * posOrNeg))

        // console.log("pre work", updateDT)
        // console.log("function at work", updateDT.toISOString().slice(0,-8))
        return updateDT.toISOString().slice(0,-8);
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const submitErrors = [];

    if (auctionName.trim().length === 0 || auctionName.length > 200) {
      submitErrors.push({auctionName: "Name length must be between 1 and 200 characters"})
    }
    if (auctionDescription.trim().length === 0 || auctionDescription.length > 300) {
      submitErrors.push({auctionName: "Description length must be between 1 and 300 characters"})
    }
    if (auctionStartingBidCents <= 0) {
        submitErrors.push({auctionStartingBid: "Starting Bid must be greater than $0.00"
    })
    }

    const timeNow = new Date();
    const timeNowMilli = timeNow.getTime();

    const originalStartTimeObj = new Date(update_auction.startTime);
    const originalEndTimeObj = new Date(update_auction.endTime);
    const startDateTimeIntoObj = new Date(startTime);
    const endDateTimeIntoObj = new Date(endTime);

    if (startTime == "" || endTime == "") {
        submitErrors.push({Time: "Please select a starting and ending date"})
    }

    if (startDateTimeIntoObj.getTime() < timeNowMilli) {
        submitErrors.push({startTime: "Starting time must be after current time"})
    }

    if (startDateTimeIntoObj.getTime() > endDateTimeIntoObj.getTime()) {
        submitErrors.push({endTime: "Ending time must be later than starting time"})
    }


    if ((originalStartTimeObj).getTime() < timeNowMilli) {
        // if (auctionStartingBidCents !== update_auction.startingBidCents) {
        //     submitErrors.push({auctionStartingBid: "Cannot change starting bid once auction has started!"})
        // }

        // if (startTime !== update_auction.startTime) {
        //     submitErrors.push({startTime: `Cannot change start time once auction has started! Original time was ${originalStartTimeObj}`})
        // }

        // if (endTime !== update_auction.endTime) {
        //     submitErrors.push({endTime: `Cannot change end time once auction has started! Original time was ${originalEndTimeObj}`})
        // }
        alert("Cannot update once auction has started! Closing modal.");
        closeModal();
    }



    if (submitErrors.length) {
        setErrors(submitErrors)
        return;
    }

    const updateAuction = {};
    if (auctionName !== update_auction.name) updateAuction.auctionName = auctionName.trim();
    if (auctionDescription !== update_auction.description) updateAuction.auctionDescription = auctionDescription.trim();

    if (auctionStartingBidCents !== update_auction.startingBidCents) updateAuction.startingBidCents = auctionStartingBidCents;

    // console.log("presubmit, what is startTime and endTime", startTime, endTime)

    if (startTime && startTime !== update_auction.startTime) updateAuction.startTime = startDateTimeIntoObj.toString();
    if (endTime && endTime !== update_auction.endTime) updateAuction.endTime = endDateTimeIntoObj.toString();
    // updateAuction.endTime = endDateTimeIntoObj.toString();



    if (Object.entries(updateAuction).length === 0) {
        // console.log("No changes detected");
        closeModal();
        return;
    }

    try {
          const result = dispatch(updateAuctionThunk(updateAuction, update_auction.id));
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
          <h1>Update Auction</h1>
          <form onSubmit={handleSubmit} method={"PUT"}>

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
                value={auctionStartingBidCents}
                onChange={(e) => {
                  setAuctionStartingBidCents(e.target.value)
                  }
                }
                //   required
              />
            </label>
            </div>

            {/* <label>
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

                </select> */}
            {/* <div>
                Item to Auction: {update_auction.}
            </div> */}

            <label>
                Start Date
                <input
                // id="create-rename-input"
                type="datetime-local"
                value={startTime}
                // value={startTime}
                onChange={(e) => {

                    setStartTime(e.target.value)

                    // console.log("STARTTIME CHANGE", startTime)
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




            <button type="submit">Update Auction</button>
          </form>

          </div>
        </>
      );
    }
export default AuctionUpdateModal;
