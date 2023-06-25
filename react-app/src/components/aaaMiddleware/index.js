
const imageHandle = (imageUrl) => {
    return (
        <img src={imageUrl}
        alt={imageUrl}

        // onError={(e)=> {
        //     e.currentTarget.src="logo-icon-square.png"
        // }}
        style={{width:"100%", height:"100%", objectFit:"cover", borderRadius:"10px"}}

        ></img>
    )
}

const urlToImage = (imageUrl, sizeOption) => {

    /* style="width: 300px; height: 337px; object-fit: cover;" */
    let width, height;


    switch (sizeOption) {
        case 0:
            width = "150px";
            height = "75px";
            break;
        case 1:
            width = "200px";
            height = "150px";
            break;
        case 2:
            width = "300px";
            height = "225px";
            break;
        case 3:
            width = "100%";
            height = "50%";
            break;
    }

    return (
        <img src={imageUrl}
        alt={imageUrl}
        style={{width, height, objectFit:"cover", borderRadius:"10px"}}

        // onError={e => { e.currentTarget.src = "%PUBLIC_FOLDER%/logo-icon.square.png"}}

        />
            // {width: {`${width}`}; height: ${height}; object-fit:cover;}}/>
    )
}

function centsToDollars(cents) {
    return `${String(cents).substring(0, String(cents).length - 2)}.${String(cents).substring(String(cents).length - 2)}`
}

function sortBidByTime(bids) {
    const tempBidList = [...bids]

    if (tempBidList.length <= 1) {
        return tempBidList;
    }

    const sortedTempBidList = tempBidList.sort((a, b) => {
        const aDate = new Date(a.timeOfBid);
        const bDate = new Date(b.timeOfBid);

        const aDateGetTime = aDate.getTime();
        const bDateGetTime = bDate.getTime()

        // console.log("in sortBidByTime, aDate, bdate", aDateGetTime, bDateGetTime)


        if (aDateGetTime < bDateGetTime) {
            return -1;
        }
        else if (aDateGetTime > bDateGetTime) {
            return 1;
        } else {
            return 0;
        }
    })
    return sortedTempBidList;
}


export { urlToImage, centsToDollars, sortBidByTime, imageHandle};
