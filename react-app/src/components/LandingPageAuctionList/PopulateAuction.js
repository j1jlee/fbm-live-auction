



const demoSubmitNew = async (demoSellerId) => {

    const timeNow = new Date();
    const timePlusMinute = new Date(timeNow.getTime() + 60000);

    const timeNowString = timeNow.toString();
    const timePlusMinuteString = timePlusMinute.toString();

    const demoItem = {
        name: "testItem",
        description: "this is an item made for test auctions! Buyers beware",
        lastKnownPriceCents: 9900,
        imageUrl: "https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/SCARF_1_resized.jpg",
        ownerId: demoSellerId
    }


    const createDemoItem = await dispatch(createItemThunk(demoItem));

    // console.log("createDemoItem?", createDemoItem)

    if (createDemoItem) {
        // console.log("trying to create demo auction")

        const demoAuction = {
          auctionName: "Demo Auction",
          auctionDescription: "This is a demo auction!",
          startingBidCents: 100,
          startTime: timeNowString,
          endTime: timePlusMinuteString,
          auctionItemId: createDemoItem.id,
        //   auctionItemId: allItemsList[0].id,
          sellerId: demoSellerId
        }
        dispatch(createAuctionThunk(demoAuction))
        .then(socket.emit("newAuctionEvent", { note: "new auction refresh"}));
        // await dispatch(createAuctionThunk(demoAuction));
    }
  }


  export default populateAuction;
