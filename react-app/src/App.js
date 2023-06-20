import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import NavSideBar from "./components/NavSideBar";

import ItemListPage from "./components/ItemListPage";
import LandingPageAuctionList from "./components/LandingPageAuctionList";
import SingleAuctionPage from "./components/SingleAuctionPage";

import AaCountdownTest from "./components/AaCountdownTest";

import "./App.css"


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <div className="app-entire-wrapper">
        <div className="app-navbar-one">
      <Navigation isLoaded={isLoaded} />
        </div>   {/* end of navbar one */}

    <div className="app-navbar-two-and-page">
        <div className="app-navbar-two">
        <NavSideBar isLoaded={isLoaded} />
        </div>

      <div className="app-just-page">
      {isLoaded && (
        <Switch>
          <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route path="/items">
            <ItemListPage />
          </Route>

          <Route path="/test">
             <AaCountdownTest />
          </Route>

          <Route exact path="/auction/:auctionId" >
            <SingleAuctionPage />
          </Route>


          <Route exact path="/">
            <LandingPageAuctionList />
          </Route>
        </Switch>
      )}
      </div>

    </div>{/* end of navbar-two-and-page */}

      </div> {/* App entire wrapper ends here */}
    </>
  );
}

export default App;
