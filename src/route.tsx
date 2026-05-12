import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ProductDetails from "./ProductDetails";
import Checkout from "./Checkout";
import OrderSuccess from "./OrderSuccess";

// Maan letay hain aapne ye files banayi hain
// import About from "./About"; 

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    path: "/product/:productId", // Dynamic segment
    element: <ProductDetails />, 
  },

  {
    path: "/checkout",
    element: <Checkout />,
  },

  {

    path:"/order-success",
    element:<OrderSuccess/>
  },
  {
    path: "/about",
    element: <div>About Page</div>, // Yahan component bhi dal sakte hain
  },
]);