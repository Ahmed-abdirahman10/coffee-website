// ---------------------------------------------------------------
// Product catalog
// ---------------------------------------------------------------
const PRODUCTS = [
  {
    id: "beija-flor",
    name: "Beija Flor",
    price: 5.50,
    origin: "Minas Gerais, Brazil",
    roast: "Light Roast",
    weight: "250g",
    notes: ["Honey", "Red apple", "Brown sugar"],
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=900&auto=format&fit=crop",
    description:
      "A bright, delicate light roast grown on a family-run farm in Minas Gerais. Beija Flor is washed and sun-dried, giving it a clean sweetness and a floral finish that lingers after every sip."
  },
  {
    id: "el-mirador",
    name: "El Mirador",
    price: 7.50,
    origin: "Huila, Colombia",
    roast: "Medium Roast",
    weight: "250g",
    notes: ["Caramel", "Orange zest", "Milk chocolate"],
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=900&auto=format&fit=crop",
    description:
      "Grown high in the hills of Huila, El Mirador is a balanced medium roast with a syrupy body. Expect caramel sweetness up front, a citrus lift in the middle, and a soft chocolate finish."
  },
  {
    id: "pedra-branca",
    name: "Pedra Branca",
    price: 2.10,
    origin: "Bahia, Brazil",
    roast: "Single-Serve Sample",
    weight: "50g",
    notes: ["Hazelnut", "Dark cherry", "Toasted grain"],
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=900&auto=format&fit=crop",
    description:
      "A pocket-sized taster bag, perfect if you want to try before you commit to a full bag. Pedra Branca is nutty and full-bodied, with a dark cherry sweetness underneath."
  },
  {
    id: "atlantico",
    name: "Atlántico",
    price: 12.50,
    origin: "Chiapas, Mexico",
    roast: "Dark Roast",
    weight: "1kg",
    notes: ["Cocoa nib", "Toasted walnut", "Molasses"],
    image: "https://images.unsplash.com/photo-1524350876685-274059332603?q=80&w=900&auto=format&fit=crop",
    description:
      "Our biggest bag for our boldest drinkers. Atlántico is a deep, cocoa-forward dark roast slow-roasted to bring out a rich, syrupy body without any bitterness."
  },
  {
    id: "beija-flor-dark",
    name: "Beija Flor Dark Roast",
    price: 7.50,
    origin: "Minas Gerais, Brazil",
    roast: "Dark Roast",
    weight: "250g",
    notes: ["Dark chocolate", "Roasted almond", "Blackberry"],
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=900&auto=format&fit=crop",
    description:
      "The same beans as our original Beija Flor, roasted longer for drinkers who like a deeper, more intense cup. Dark chocolate and roasted almond with a berry finish."
  },
  {
    id: "el-mirador-decaf",
    name: "El Mirador Decaf",
    price: 7.50,
    origin: "Huila, Colombia",
    roast: "Medium Roast, Decaf",
    weight: "250g",
    notes: ["Caramel", "Toffee", "Orange peel"],
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=900&auto=format&fit=crop",
    description:
      "All the caramel-sweet, citrusy character of El Mirador, naturally decaffeinated using the Swiss Water Process so you keep the flavour and lose the caffeine."
  }
];

function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

// ---------------------------------------------------------------
// Cart helpers (persisted to localStorage, with an in-memory
// fallback if storage isn't available)
// ---------------------------------------------------------------
let memoryCart = {};

function readStorage() {
  try {
    const raw = window.localStorage.getItem("cw_cart");
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return memoryCart;
  }
}

function writeStorage(cart) {
  try {
    window.localStorage.setItem("cw_cart", JSON.stringify(cart));
  } catch (e) {
    memoryCart = cart;
  }
}

function getCart() {
  // { productId: quantity }
  return readStorage();
}

function addToCart(id, qty) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + qty;
  writeStorage(cart);
  updateCartBadge();
}

function setQty(id, qty) {
  const cart = getCart();
  if (qty <= 0) {
    delete cart[id];
  } else {
    cart[id] = qty;
  }
  writeStorage(cart);
  updateCartBadge();
}

function removeFromCart(id) {
  setQty(id, 0);
}

function clearCart() {
  writeStorage({});
  updateCartBadge();
}

function cartItemCount() {
  const cart = getCart();
  return Object.values(cart).reduce((sum, q) => sum + q, 0);
}

function cartLines() {
  const cart = getCart();
  return Object.keys(cart)
    .map((id) => {
      const product = getProduct(id);
      if (!product) return null;
      return { product, qty: cart[id] };
    })
    .filter(Boolean);
}

function cartSubtotal() {
  return cartLines().reduce((sum, line) => sum + line.product.price * line.qty, 0);
}

function updateCartBadge() {
  const badge = document.querySelectorAll("[data-cart-badge]");
  const count = cartItemCount();
  badge.forEach((el) => {
    el.textContent = count;
    el.classList.toggle("hidden", count === 0);
  });
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
