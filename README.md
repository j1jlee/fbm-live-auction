# Marketplace Live Auction
Marketplace Live Auction is a soft clone of FaceBook MarketPlace, and live auction sites such as <a href="https://www.auctionzip.com/online-auctions/">AuctionZip.com<a>

The idea is to bring the excitement of live sales and auctions to a marketplace of used goods and antiques.

## Index

## Technologies Used
Javascript
Python
Flask
PostgresQL
HTML5
CSS3
React/Redux
Github

## Landing Page
<img src="https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/readme-landing-page.PNG" alt="https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/readme-landing-page.PNG"/>

## Items
<img src="https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/readme-items.PNG" alt="https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/readme-items.PNG" />

## Auction / Bids
<img src="https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/readme-auction.PNG" alt="https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/readme-auction.PNG" />

## Getting started
1. Clone this repository (only this branch)

2. Install dependencies

      ```bash
      pipenv install -r requirements.txt
      ```

3. Create a **.env** file based on the example with proper settings for your
   development environment

4. Make sure the SQLite3 database connection URL is in the **.env** file

5. Replace the value for
   `SCHEMA` with a unique name, **making sure you use the snake_case
   convention**.

6. Get into your pipenv, migrate your database, seed your database, and run your Flask app

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

7. To run the React App in development, checkout the [README](./react-app/README.md) inside the `react-app` directory.

# Features

## Items
- Users can create an Item
- Users can read/view other users' items
- Users can update their items
- Users can delete teir items

## Auctions
- Users can create Auctions, with items they create/ win
- Users can update/delete their own Auctions, up to five minutes before the auction begins
- Users can view all auctions
- Users can delete their own Auctions after closing

## Bids
- Users can Bid on Auctions

## Future Features

### User Wallet

Users can refill their wallets to fund bids/auctions


## Contact

<a href="https://www.linkedin.com/in/joshua-lee-9573a0142/">LinkedIn</a>

## Endpoints
