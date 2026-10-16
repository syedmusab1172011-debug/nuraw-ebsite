# Nura, Pure by Nature (dark edition)

Static website for Nura's handmade herbal soaps, hair oils and shampoo. Plain HTML, CSS and JavaScript. No build step.

## Put it online with GitHub Pages
1. Create a new repository on GitHub (for example `nura-website`).
2. Upload everything in this folder (keep the folder structure), or from a terminal:
   ```
   git init
   git add .
   git commit -m "Nura website"
   git branch -M main
   git remote add origin https://github.com/YOUR-NAME/nura-website.git
   git push -u origin main
   ```
3. In the repository open **Settings > Pages**. Under *Build and deployment* choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then Save.
4. After a minute the site is live at `https://YOUR-NAME.github.io/nura-website/`.

## Everyday edits
| What | File |
| --- | --- |
| Phone number, WhatsApp number, currency | `assets/js/config.js` |
| Products, descriptions, prices, photos, glow colour | `assets/js/products.js` |
| Colours and fonts (variables at the top) | `assets/css/style.css` |
| Wording, FAQ, social links | `index.html` |
| Ingredient list | `ING` near the middle of `assets/js/app.js` |

### Prices
Add `price: 450` to a product line in `products.js`. Prices and an order total then appear automatically.

### Product photos
Save a photo as `.webp` or `.jpg` (about 800 px wide) in `assets/img/products/` and set that product's `img` path. For tall photos, `pos: "50% 85%"` chooses which part the card shows.

### Logo and social links
`assets/img/logo-light.png` is the logo used on the dark background. In `index.html` search for `Follow us`. Replace the links with your own pages when they change.

### WhatsApp
Each product has a WhatsApp button that opens a chat with the product name typed. The order drawer has **Copy my order** and **Send on WhatsApp**. If you change the number, also change it in `config.js` and search `index.html` for `0315 7100384` and `923157100384`.

## How the collection works
On computers the collection is a pinned section: scrolling down moves the products sideways. On phones and tablets it becomes a normal swipe row. People who prefer reduced motion get the swipe row too.

## Notes
- Fonts (Instrument Serif and Hanken Grotesk) load from Google Fonts. Without internet the site falls back to Times and system fonts.
- Benefit statements are based on traditional use. Keep that wording on the page.
