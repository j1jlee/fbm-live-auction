

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
           //console.log("sizeoption??", sizeOption);

            width = "490px";
            height = "285px";
            break;
    }

    return (
        <img src={imageUrl} alt={imageUrl} style={{width, height, objectFit:"cover", borderRadius:"10px"}} />
            // {width: {`${width}`}; height: ${height}; object-fit:cover;}}/>
    )
}

export { urlToImage };
