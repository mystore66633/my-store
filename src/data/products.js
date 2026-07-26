// ==========================================
// PRODUCT LIST
// ==========================================

// This array stores all the products for our website.
// Later, we can add hundreds of products here.

import ktchn from "../assets/images/kitcn 1.webp";
import messi from "../assets/images/messi.jpg";

const products = [
  {
    id: 1,
    image: ktchn,
    title: "Kitchen Blender",
    category: "Kitchen",
    price: 499,
  },

  {
    id: 2,
    image: messi,
    title: "Messi",
    category: "Sports",
    price: 199,
  },
    {
    id: 3,
    image: "https://via.placeholder.com/200",
    title: "Wireless Headphones",
    category: "Electronics",
    price: 1999,
  },
];
  
export default products;