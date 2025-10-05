
// ===== 1. ДАНІ (розділені категорії) =====
const products = [
    // 🌷 Букети
    ...Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Букет ${i + 1}`,
        price: Math.floor(300 + Math.random() * 700),
        category: 'bouquets',
        description: 'Чудовий квітковий букет для особливих моментів.',
        image: `img/bouquets/b${i + 1}.jpg`
    })),

    // 🎁 Подарунки
    ...Array.from({ length: 10 }, (_, i) => ({
        id: 100 + i + 1,
        name: `Подарунок ${i + 1}`,
        price: Math.floor(200 + Math.random() * 500),
        category: 'gifts',
        description: 'Оригінальний подарунок для близьких.',
        image: `img/gifts/g${i + 1}.jpg`
    })),

    // 🌹 Квіти поштучно
    ...Array.from({ length: 10 }, (_, i) => ({
        id: 200 + i + 1,
        name: `Квітка ${i + 1}`,
        price: Math.floor(50 + Math.random() * 200),
        category: 'single',
        description: 'Окрема квітка з індивідуальним шармом.',
        image: `img/single/s${i + 1}.jpg`
    })),

    // 💌 Листівки
    ...Array.from({ length: 10 }, (_, i) => ({
        id: 300 + i + 1,
        name: `Листівка ${i + 1}`,
        price: Math.floor(30 + Math.random() * 100),
        category: 'cards',
        description: 'Гарна листівка до вашого подарунка.',
        image: `img/cards/c${i + 1}.jpg`
    })),

    // 🍫 Цукерки
    ...Array.from({ length: 10 }, (_, i) => ({
        id: 400 + i + 1,
        name: `Цукерки ${i + 1}`,
        price: Math.floor(80 + Math.random() * 300),
        category: 'sweets',
        description: 'Солодкий сюрприз для гарного настрою.',
        image: `img/sweets/sw${i + 1}.jpg`
    }))
];

// ===== 2. ЛОКАЛЬНЕ ЗБЕРІГАННЯ =====
let cart = JSON.parse(localStorage.getItem('florisCart')) || [];
const saveCart = () => localStorage.setItem('florisCart', JSON.stringify(cart));

// ===== 3. ВІДОБРАЖЕННЯ =====
const productsContainer = document.getElementById('products-container');
const cartItemsContainer = document.getElementById('cart-items');
const totalAmountElement = document.getElementById('total-amount');
const cartCountElement = document.getElementById('cart-count');

function renderProducts(filter = 'all') {
    productsContainer.innerHTML = '';
    const filtered = products.filter(p => filter === 'all' || p.category === filter);

    filtered.forEach(p => {
        const isInCart = cart.find(i => i.id === p.id);
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <p class="price">${p.price} грн</p>
            ${isInCart
                ? `<button onclick="removeFromCart(${p.id})" class="remove-btn">Видалити</button>`
                : `<button onclick="addToCart(${p.id})">Додати</button>`}
        `;
        productsContainer.appendChild(div);
    });
}

// ===== 4. КОШИК =====
function updateCart() {
    cartItemsContainer.innerHTML = '';
    if (!cart.length) {
        cartItemsContainer.innerHTML = '<p id="empty-cart-message">Ваш кошик порожній.</p>';
    } else {
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <span>${product.name}</span>
                <div>
                    <button onclick="changeQty(${product.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQty(${product.id}, 1)">+</button>
                    <span>${(product.price * item.quantity).toFixed(2)} грн</span>
                    <button class="remove-btn" onclick="removeFromCart(${product.id})">X</button>
                </div>
            `;
            cartItemsContainer.appendChild(div);
        });
    }

    const total = cart.reduce((s, i) => s + products.find(p => p.id === i.id).price * i.quantity, 0);
    totalAmountElement.textContent = total.toFixed(2);
    cartCountElement.textContent = cart.reduce((s, i) => s + i.quantity, 0);
    saveCart();
    renderProducts(document.querySelector('.filter-btn.active').dataset.category);
}

function addToCart(id) {
    const existing = cart.find(i => i.id === id);
    if (existing) existing.quantity++;
    else cart.push({ id, quantity: 1 });
    updateCart();
}
function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
    updateCart();
}
function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCart();
}

// ===== 5. НАВІГАЦІЯ МІЖ СТОРІНКАМИ =====
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();

        const target = link.dataset.section;

        // ховаємо всі секції
        document.querySelectorAll('main section').forEach(sec => {
            sec.classList.add('hidden-section');
            sec.classList.remove('active-section');
        });

        // показуємо потрібну
        const targetSection = document.getElementById(target);
        if (targetSection) {
            targetSection.classList.remove('hidden-section');
            targetSection.classList.add('active-section');
        }

        // якщо це кошик — оновити
        if (target === 'cart' && typeof updateCart === 'function') {
            updateCart();
        }
    });
});

// ===== 6. ФІЛЬТРАЦІЯ =====
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        renderProducts(btn.dataset.category);
    });
});

// ===== 7. ІНІЦІАЛІЗАЦІЯ =====
renderProducts();
updateCart();
