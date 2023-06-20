import { useContext, createContext, useState } from 'react';

export const AuctionTrackerContext = createContext();
//customhook, FUNCTION
export const useAuctionTrackerContext = () => useContext(AuctionTrackerContext);


export default function AuctionTrackerProvider(props) {
  const [auctionTracker, setAuctionTracker] = useState({});

  return (
    <AuctionTrackerContext.Provider
      value={{
        auctionTracker,
        setAuctionTracker
      }}
    >
      {props.children}
    </AuctionTrackerContext.Provider>
  )
}

/*
wherever,
import useAuctionTrackerContext
const { auctionTracker, setAuctionTracker } = useAuctionTrackerContext();

*/
