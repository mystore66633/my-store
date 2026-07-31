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
    description: "Powerful kitchen blender with multiple speed settings. Perfect for juices, smoothies, and cooking. Features a 1.5L capacity and 600W motor for smooth blending.",
  },

  {
    id: 2,
    image: messi,
    title: "Messi Jersey",
    category: "Sports",
    price: 199,
    description: "Official Messi sports jersey made from high-quality breathable fabric. Perfect for football fans and players. Available in multiple sizes.",
  },
  {
    id: 3,
    image: "https://via.placeholder.com/200",
    title: "Wireless Headphones",
    category: "Electronics",
    price: 1999,
    description: "Premium wireless headphones with noise cancellation, 30-hour battery life, and crystal clear audio. Perfect for music lovers and professionals.",
  },
];
  
export default products;