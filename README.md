DonDon Restaurant Ordering App
=========

DonDon is a fictitious restaurant from which you can order food online, to pick up later. Customers can browse the menu and place orders, and the restaurant owner can manage orders and update the menu as desired.

## Features

- Login and authentication
- Browse the menu and add items to your cart as a customer
- Clear order history as a customer
- Manage menu items and add new menu items as an owner
- Manage existing and completed orders as an owner

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information 
  - username: `labber` 
  - password: `labber` 
  - database: `midterm`
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`
  - Check the db folder to see what gets created and seeded in the SDB
7. Run the server: `npm run local`
  - Note: nodemon is used, so you should not have to restart your server
8. Visit `http://localhost:8080/`


## Dependencies

- bcrypt
- body-parser
- chalk
- cookie-session
- dotenv
- ejs
- express
- morgan
- pg
- sass
- twilio
