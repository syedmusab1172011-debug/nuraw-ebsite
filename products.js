/* Product list. To add a product, copy one line and change it.
   k:     "soap" | "oil" | "shampoo"
   img:   photo path inside assets/img/ (webp, jpg, png or svg)
   pos:   optional. Which part of a tall photo is shown, for example "50% 75%" (left-right, top-bottom)
   col:   glow colour behind the product while it is on screen
   bot:   optional botanical line shown under the description
   price: optional number, for example price: 450. Prices and the order total then appear automatically. */
window.NURA_PRODUCTS = [
  { id: 3,  k: "soap",    n: "Sunflower Herbal Soap",     d: "Handmade herbal soap crafted with natural ingredients for gentle everyday care.", img: "assets/img/sun.webp", col: "#7C8A4B" },
  { id: 4,  k: "soap",    n: "Mulethi Herbal Soap",       d: "For bright, even-looking skin. Mulethi (licorice) is traditionally used for natural skin brightening.", img: "assets/img/products/mulethi-soap.webp", col: "#B8923F", bot: "Glycyrrhiza glabra" },
  { id: 5,  k: "soap",    n: "Multani Mitti Herbal Soap", d: "Deep cleansing and oil control. A classic clay that leaves skin clear and glowing.", img: "assets/img/products/multani-mitti-soap.webp", col: "#A67C52", bot: "Fuller's earth clay" },
  { id: 6,  k: "soap",    n: "Aloe Vera Herbal Soap",     d: "Hydrates and soothes. Leaves skin feeling cool and nourished.", img: "assets/img/products/aloe-vera-soap.webp", col: "#4FA05A", bot: "Aloe barbadensis" },
  { id: 7,  k: "soap",    n: "Rose Herbal Soap",          d: "A gentle touch with the light fragrance of rose for soft, fresh-feeling skin.", img: "assets/img/products/rose-soap.webp", pos: "50% 92%", col: "#C45A74", bot: "Rosa damascena" },
  { id: 8,  k: "soap",    n: "Coffee Herbal Soap",        d: "Refreshing and energising. Leaves skin feeling fresh and awake.", img: "assets/img/products/coffee-soap.webp", pos: "50% 92%", col: "#8A5632", bot: "Coffea arabica" },
  { id: 13, k: "soap",    n: "Chocolate Rose Soap",       d: "Handmade rose-shaped soap for gentle everyday care.", img: "assets/img/choc.webp", col: "#7A4326" },
  { id: 9,  k: "oil",     n: "Herbal Hair Growth Oil",    d: "Hibiscus, fenugreek and aloe formula. Helps nourish hair roots, supports new growth and adds natural shine.", img: "assets/img/products/herbal-hair-growth-oil.webp", col: "#C9A227", bot: "Hibiscus rosa-sinensis, Trigonella foenum-graecum, Aloe barbadensis" },
  { id: 10, k: "oil",     n: "Anti-Lice Oil",             d: "Neem and tulsi blend. Soothes the scalp, relieves itching and keeps it fresh.", img: "assets/img/products/anti-lice-oil.webp", col: "#3F9460", bot: "Azadirachta indica, Ocimum tenuiflorum" },
  { id: 11, k: "oil",     n: "Hair Growth Oil",           d: "For stronger roots and longer hair. Helps reduce hair fall, thickens and adds natural shine.", img: "assets/img/products/hair-growth-oil.webp", pos: "50% 38%", col: "#BBA53A" },
  { id: 12, k: "shampoo", n: "Hibiscus Shampoo (200 ml)", d: "For stronger, shinier and healthier hair. Soft, shiny hair with the pure care of hibiscus.", img: "assets/img/products/hibiscus-shampoo.webp", pos: "50% 85%", col: "#A93354", bot: "Hibiscus rosa-sinensis" }
];
