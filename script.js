let cart = [];
let products = []; // Store products globally to avoid multiple fetch calls

const cartCount = document.getElementById("cart-count");
const modal = document.getElementById("modal");
const modalDetails = document.getElementById("modal-details");
const closeModal = document.getElementById("close-modal");
const cartPanel = document.getElementById("cart-panel");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartButton = document.getElementById("cart-btn");
const closeCart = document.getElementById("close-cart");

// Fetch products once and store them in the products array
fetch("products.json")
    .then(response => response.json())
    .then(data => {
        products = data; // Store products globally
        renderProducts(data); // Initial render of the products
    })
    .catch(error => console.error('Error fetching products:', error));

// Render products to the page

function renderProducts(products) {
    const container = document.getElementById("products-container");
    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>Price: $${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <button onclick="viewDetails(${product.id})">Details</button>
        `;
        container.appendChild(card);
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id == productId);
    const existingItem = cart.find(item => item.id == product.id);

    if (existingItem) {
        existingItem.quantity += 1; // Increment quantity if already in cart
    } else {
        cart.push({ ...product, quantity: 1 }); // Add product with quantity 1
    }

    updateCart();
    // alert(`${product.name} has been added to the cart!`);
}

// Update the cart UI and total
function updateCart() {
    cartCount.textContent = cart.length;
    cartItems.innerHTML = ""; // Clear previous items
    let total = 0;

    cart.forEach((product, index) => {
        const item = document.createElement("div");
        item.className = "cart-item";
        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div>
                <p>${product.name}</p>
                <p>$${product.price} x ${product.quantity}</p>
            </div>
            <input type="number" min="1" value="${product.quantity}" onchange="updateQuantity(${index}, this.value)">
            <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItems.appendChild(item);
        total += product.price * product.quantity;
    });

    cartTotal.textContent = total.toFixed(2);
}

// Update product quantity in cart
function updateQuantity(index, value) {
    const quantity = parseInt(value);
    if (quantity > 0) {
        cart[index].quantity = quantity; // Update quantity if greater than 0
    } else {
        cart.splice(index, 1); // Remove item if quantity is 0
        alert(`${cart[index]?.name || 'Item'} has been removed from the cart.`);
    }
    updateCart();
}

// Remove item from the cart
function removeFromCart(index) {
    cart.splice(index, 1); // Remove item from cart
    updateCart();
}

// View product details in modal
function viewDetails(productId) {
    const product = products.find(p => p.id == productId);
    modalDetails.innerHTML = `
        <img class="modal-img" src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
    `;
    modal.classList.remove("hidden");
}

// Close modal
closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

// Toggle cart panel visibility
cartButton.addEventListener("click", () => {
    cartPanel.classList.toggle("hidden");
});

// Close cart panel
closeCart.addEventListener("click", () => {
    cartPanel.classList.add("hidden");
});

// Checkout functionality
document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
    } else {
        alert("Thank you for your purchase!");
        cart = []; // Empty the cart
        updateCart(); // Update UI to reflect empty cart
        cartPanel.classList.add("hidden"); // Close the cart panel
    }
});
