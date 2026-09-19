const products = [
  {
    id: 1,
    name: "Aero ANC Headphones",
    category: "tech",
    price: 18500,
    art: "art-headphones",
    color: "tech",
    desc: "Quiet, beautifully."
  },
  {
    id: 2,
    name: "Sola Table Lamp",
    category: "home",
    price: 7800,
    art: "art-lamp",
    color: "home",
    desc: "Warm light, always."
  },
  {
    id: 3,
    name: "Field Carry Tote",
    category: "carry",
    price: 4200,
    art: "art-bag",
    color: "carry",
    desc: "For wherever next."
  },
  {
    id: 4,
    name: "Terra Everyday Bottle",
    category: "home",
    price: 2900,
    art: "art-bottle",
    color: "home",
    desc: "Hydration, refined."
  }
];

let cart = [];
let currentCategory = "all";

const money = (number) => {
  return "Rs. " + number.toLocaleString("en-PK");
};

const grid = document.querySelector("#productGrid");

function productMarkup(product) {
  return `
    <article class="product-card">
      <div class="product-art ${product.color}">
        <div class="shape ${product.art}"></div>
      </div>

      <h3>${product.name}</h3>

      <div class="details">
        <span>${product.desc}</span>
        <span class="price">${money(product.price)}</span>
      </div>

      <button class="add-btn" data-add="${product.id}">
        Add to cart <span>+</span>
      </button>
    </article>
  `;
}

function renderProducts() {
  const searchText = document
    .querySelector("#searchInput")
    .value
    .trim()
    .toLowerCase();

  const visibleProducts = products.filter((product) => {
    const categoryMatch =
      currentCategory === "all" ||
      product.category === currentCategory;

    const searchMatch =
      !searchText ||
      product.name.toLowerCase().includes(searchText) ||
      product.category.includes(searchText);

    return categoryMatch && searchMatch;
  });

  if (!visibleProducts.length) {
    grid.innerHTML = `
      <div class="empty-cart" style="grid-column: 1 / -1; margin: 45px 0;">
        No products found. Try another search.
      </div>
    `;
    return;
  }

  grid.innerHTML = visibleProducts
    .map(productMarkup)
    .join("");
}

function renderCart() {
  const cartItems = document.querySelector("#cartItems");

  const totalItems = cart.reduce((sum, item) => {
    return sum + item.qty;
  }, 0);

  const totalPrice = cart.reduce((sum, item) => {
    return sum + item.price * item.qty;
  }, 0);

  document.querySelector("#cartCount").textContent = totalItems;
  document.querySelector("#drawerCount").textContent = `(${totalItems})`;
  document.querySelector("#cartTotal").textContent = money(totalPrice);

  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        Your cart is waiting for something good.
      </div>
    `;
    return;
  }

  cartItems.innerHTML = cart
    .map((item) => {
      return `
        <div class="cart-item">
          <div class="cart-thumb ${item.color}">
            <div class="shape ${item.art}"></div>
          </div>

          <div>
            <h4>${item.name}</h4>
            <p>${item.qty} × ${money(item.price)}</p>
            <button class="remove-item" data-remove="${item.id}">
              Remove
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

function showToast(message) {
  const toast = document.querySelector("#toast");

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function openCart() {
  document.querySelector("#cartDrawer").classList.add("open");
  document.querySelector("#overlay").classList.add("show");
}

function closeCart() {
  document.querySelector("#cartDrawer").classList.remove("open");
  document.querySelector("#overlay").classList.remove("show");
}

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");

  if (!button) {
    return;
  }

  const productId = Number(button.dataset.add);
  const selectedProduct = products.find(
    (product) => product.id === productId
  );

  const existingProduct = cart.find(
    (product) => product.id === productId
  );

  if (existingProduct) {
    existingProduct.qty++;
  } else {
    cart.push({
      ...selectedProduct,
      qty: 1
    });
  }

  renderCart();
  showToast(`${selectedProduct.name} added to your cart`);
});

document.querySelector("#cartItems").addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");

  if (!button) {
    return;
  }

  const productId = Number(button.dataset.remove);

  cart = cart.filter((product) => product.id !== productId);

  renderCart();
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelector(".filter.active")
      .classList.remove("active");

    button.classList.add("active");
    currentCategory = button.dataset.category;

    renderProducts();
  });
});

document
  .querySelector("#searchInput")
  .addEventListener("input", renderProducts);

document
  .querySelector("#cartOpen")
  .addEventListener("click", openCart);

document
  .querySelector("#cartClose")
  .addEventListener("click", closeCart);

document
  .querySelector("#overlay")
  .addEventListener("click", closeCart);

document
  .querySelector("#searchToggle")
  .addEventListener("click", () => {
    document.querySelector("#shop").scrollIntoView({
      behavior: "smooth"
    });

    setTimeout(() => {
      document.querySelector("#searchInput").focus();
    }, 600);
  });

document
  .querySelector("#checkoutBtn")
  .addEventListener("click", () => {
    if (!cart.length) {
      showToast("Your cart is empty");
      return;
    }

    showToast("Demo checkout ready — thank you!");
  });

document
  .querySelector("#newsletterForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    document.querySelector("#formMessage").textContent =
      "You are on the list — welcome to NOVA.";

    document.querySelector("#email").value = "";

    showToast("Welcome to the NOVA list");
  });

renderProducts();
renderCart();
