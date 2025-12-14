// This file contains JavaScript code for the VIP car shop functionality, including rendering products, handling purchases, and interacting with the Stripe API.

const stripePublicKey = "pk_test_REPLACE_ME"; // Replace with your Stripe publishable key
const stripe = stripePublicKey ? Stripe(stripePublicKey) : null;

// Example product list — add image files in assets/ or use external links
const PRODUCTS = [
  { id: "v1", name: "Obsidian GT", price: 19.99, currency: "USD", image: "assets/cars/obsidian.png", desc: "Luxury supercar with tuned engine." },
  { id: "v2", name: "Phantom Cruiser", price: 14.99, currency: "USD", image: "assets/cars/phantom.png", desc: "Armored VIP cruiser." },
  { id: "v3", name: "Rogue Bike", price: 9.99, currency: "USD", image: "assets/cars/rogue.png", desc: "Fast and nimble motorcycle." }
];

function renderProducts() {
  const container = document.getElementById('products');
  container.innerHTML = '';
  PRODUCTS.forEach(p => {
    const card = document.createElement('div');
    card.className = "bg-[#0f1720] p-4 rounded-lg border border-white/5 flex flex-col";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" class="h-40 object-contain mb-3 bg-black/40 rounded">
      <div class="flex-1">
        <h3 class="font-bold text-lg">${p.name}</h3>
        <p class="text-gray-400 text-sm mb-3">${p.desc}</p>
      </div>
      <div class="flex items-center justify-between mt-3">
        <div class="text-ds-orange font-bold">$${p.price.toFixed(2)}</div>
        <div class="flex gap-2">
          <button onclick="showDetails('${p.id}')" class="px-3 py-1 text-sm bg-white/5 rounded">Details</button>
          <button onclick="buyCar('${p.id}')" class="px-3 py-1 bg-ds-orange text-black font-bold rounded">Buy</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
  lucide.createIcons();
}

function showDetails(id) {
  const p = PRODUCTS.find(x => x.id === id);
  alert(`${p.name}\n\n${p.desc}\n\nPrice: $${p.price.toFixed(2)}\n\nAfter purchase, link your in-game ID in Discord to receive the vehicle.`);
}

async function buyCar(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return alert('Product not found');
  const endpoint = "/create-checkout-session"; // <-- replace with your actual endpoint
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId })
    });
    if (!res.ok) throw new Error('Server error');
    const data = await res.json();
    if (data.sessionId && stripe) {
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } else {
      alert("Checkout not available. Contact an admin on Discord to purchase: https://discord.gg/fsW68m3t");
    }
  } catch (err) {
    console.error(err);
    alert("Purchase failed. Ensure your backend is configured. Contact admin on Discord.");
  }
}

renderProducts();