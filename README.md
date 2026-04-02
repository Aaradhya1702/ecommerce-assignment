# React + TS Dashboard Store

Hey there! 👋 Welcome to our custom e-commerce dashboard. I threw this together to build a robust front-end using React and TypeScript. 

Initially, this was hooked up to the FakeStore API, but I recently migrated it over to the [EscuelaJS API](https://fakeapi.platzi.com/)! That gives us way better, more complex JSON structures like nested categories and multiple product images to play with. 

## What's inside?

I tried to keep things clean and strictly typed. Just to challenge myself (and keep things classic), this project relies heavily on **Class Components** where possible! Why? Sometimes it's great to go back to the roots and really understand lifecycle methods instead of abstracting everything behind `useEffect` 😅.

Here are some of the technical highlights:
- **TypeScript** all the way. Getting those strict interfaces in place saves so many headaches down the line.
- **MobX + Context API**: We're managing the cart state globally without messy prop-drilling.
- **Server-side Pagination & Filtering**: Category, price range, and search filtering are handled directly in the API queries so we aren't downloading the whole database.
- **In-memory Sorting Fallback**: The API doesn't support price sorting natively, so I built a quick client-side fallback algorithm to sort the current page's results.
- **Image Carousel**: For viewing multiple high-res product photos on the product detail page.

## Running it locally

If you want to poke around the code or spin it up on your own machine, just follow these quick steps:

1. Clone the repository and jump into the folder.
2. Install the packages: `npm install` (or `yarn install`).
3. Fire up the dev server: `npm start` (or `yarn start`).

It should pop open at `http://localhost:3000`. 

## Project Structure

It's pretty standard, but just in case you're lost:
- `src/api/` - The network layer where all the API fetching happens.
- `src/components/` - Reusable UI chunks like the Product cards, Header, and Footer.
- `src/context/` & `src/mobx/` - Where the global state magic lives.
- `src/pages/` - Our main routing views (HomePage, ProductDetailsPage).
- `src/types/` - Shared TS interfaces (like the `Product` definition).

Feel free to fork it, break it, and put it back together again. Cheers! 🍻
