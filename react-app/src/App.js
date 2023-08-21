import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import NotFoundPage from "./components/NotFoundPage";

import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import NavSideBar from "./components/NavSideBar";

import ItemListPage from "./components/ItemListPage";
import ItemDetailPage from "./components/ItemDetailPage";

import LandingPageAuctionList from "./components/LandingPageAuctionList";
import SingleAuctionPage from "./components/SingleAuctionPage";

// import AaCountdownTest from "./components/AaCountdownTest";
// import AaSocketTestTwo from "./components/AaSocketTestTwo";

// import { scrollToTop } from "./components/aaaMiddleware";

import AboutPage from "./components/AboutPage";
import HowToBidPage from "./components/HowToBidPage";

//will this even work?
import '@fortawesome/fontawesome-svg-core/styles.css'



import "./App.css"


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  // useEffect(() => {
  //   scrollToTop();
  // }, [])

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

          <Route path="/items/:itemId">
            <ItemDetailPage />
          </Route>

          <Route exact path="/items">
            <ItemListPage />
          </Route>

          <Route path="/about">
             <AboutPage />
          </Route>
          <Route path="/howtobid">
             <HowToBidPage />
          </Route>
          {/* <Route path="/test">
             <AaCountdownTest />
          </Route>
          <Route path="/test2">
             <AaSocketTestTwo />
          </Route> */}

          <Route exact path="/auction/:auctionId" >
            <SingleAuctionPage />
          </Route>


          <Route exact path="/">
            <LandingPageAuctionList />
          </Route>

          <Route path="/">
            <NotFoundPage />
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
