// Initialize an empty cart array to store selected items
let cart = [];

// Function to update the cart list in the HTML
function updateCart() {
    const selectedList = document.getElementById("selected-list");
    selectedList.innerHTML = "";
    cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ${item.quantity} x $${item.price}`;
        selectedList.appendChild(li);
    });
}

// Function to add an item to the cart
function addItemToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCart();
}
// Function to add an item to the cart and send it to the CRUD API
async function addItemToCartAndStore(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCart();

    // Send the item data to the CRUD API for storage
    try {
        const response = await fetch('https://crudcrud.com/api/15ec3f473a0049c3a249692040e8f7b6/itemsData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        });

        if (response.ok) {
            console.log('Item added to cart.');
        } else {
            console.error('Failed to add item.');
        }
    } catch (error) {
        console.error('Error adding item:', error);
    }
}

// Function to handle form submission
document.getElementById("product-submit-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const productName = document.getElementById("product-name").value;
    const productDescription = document.getElementById("product-description").value;
    const productPrice = parseFloat(document.getElementById("product-price").value);
    const productQuantity = parseInt(document.getElementById("product-quantity").value);

    // Validate input
    if (!productName || !productDescription || isNaN(productPrice) || isNaN(productQuantity)) {
        alert("Please fill in all fields with valid data.");
        return;
    }

    // Create a new product object
    const product = {
        name: productName,
        description: productDescription,
        price: productPrice,
        quantity: productQuantity,
    };

    // Add the product to the cart
    addItemToCart(product);
    addItemToCartAndStore(product)

    // Clear form fields
    document.getElementById("product-name").value = "";
    document.getElementById("product-description").value = "";
    document.getElementById("product-price").value = "";
    document.getElementById("product-quantity").value = "";
});

// Function to handle buy options
document.getElementById("buy-options").addEventListener("click", (e) => {
    if (e.target.id === "buy1" || e.target.id === "buy2" || e.target.id === "buy3") {
        const quantity = parseInt(e.target.id.slice(-1)); // Get the quantity from the button id (1, 2, or 3)

        // Calculate the total price for the selected items
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

        // Decrease the quantity for selected items based on the buy option
        cart.forEach(item => {
            if (item.quantity > 0) {
                item.quantity -= quantity;
            }
        });

        // Update the cart display
        updateCart();

        // Show a confirmation message with the total price
        alert(`Items bought for ${quantity} are confirmed. Total Price: $${totalPrice}`);
    }
});
