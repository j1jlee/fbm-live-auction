import "./HowToBidPage.css"

function HowToBidPage() {


    return (
        <>
        <h2>How to Bid, or use FB MarketPlace Live Auction!</h2>

        <ol id="how-to-ul">
            <li>
                Participate in Auctions, and out-bid other users to win Items!
            </li>
            <li>You can then either create new items, or put items you've won up for auctions of your own!</li>


                <li>
                    To create an item to Bid:
                </li>
                        <ul>
                            <li>
                                Click on the "+ Create New Item" Tab,
                            </li>
                            <li>
                                Enter the Item Name, Description, Price (in dollars), and image URL!
                            </li>
                            <li>
                                And voila! Just like that, you've created a new item you can put up for auction!
                            </li>
                        </ul>

                {/* </ul> */}
            <li>
                To start your own auction:
                    <ul>
                        <li>Click on the "+ Schedule New Auction" Tab,</li>
                        <li>Enter the name for your auction, Description, Starting Bid (that must be beat by participants), the item you've created (or previously won), and the start/end date!</li>
                        <li>(Remember, you won't be able to update your auction starting from around five minutes before your auction starts, so try to be sure about your auction details when scheduling!)</li>
                        <li>Also be aware that you won't be able to bid in your own auctions!
                        </li>
                    </ul>
            </li>

            <li>Once the auction countdown times out, the bidder with the highest and most recent bid will be rewarded the auction item!</li>


        </ol>

        </>
    )
}



export default HowToBidPage;
