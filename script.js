// Base de datos de productos
const products = [
    {
        id: 1,
        title: "iPhone 14 Pro Max 256GB",
        price: 899.99,
        image: "📱",
        category: "electronics",
        shipping: "Envío gratis",
        rating: 4.8,
        condition: "Nuevo"
    },
    {
        id: 2,
        title: "Laptop Dell XPS 15",
        price: 1299.99,
        image: "💻",
        category: "electronics",
        shipping: "Envío gratis",
        rating: 4.7,
        condition: "Nuevo"
    },
    {
        id: 3,
        title: "Camiseta Nike Dri-FIT",
        price: 29.99,
        image: "👕",
        category: "clothing",
        shipping: "$5.99",
        rating: 4.5,
        condition: "Nuevo"
    },
    {
        id: 4,
        title: "Zapatillas Adidas Ultraboost",
        price: 149.99,
        image: "👟",
        category: "clothing",
        shipping: "Envío gratis",
        rating: 4.9,
        condition: "Nuevo"
    },
    {
        id: 5,
        title: "Sofá Moderno 3 Plazas",
        price: 599.99,
        image: "🛋️",
        category: "home",
        shipping: "$49.99",
        rating: 4.6,
        condition: "Nuevo"
    },
    {
        id: 6,
        title: "Mesa de Comedor de Vidrio",
        price: 349.99,
        image: "🪑",
        category: "home",
        shipping: "$39.99",
        rating: 4.4,
        condition: "Nuevo"
    },
    {
        id: 7,
        title: "Bicicleta de Montaña",
        price: 449.99,
        image: "🚲",
        category: "sports",
        shipping: "$59.99",
        rating: 4.7,
        condition: "Usado - Excelente"
    },
    {
        id: 8,
        title: "Pelota de Fútbol Oficial",
        price: 24.99,
        image: "⚽",
        category: "sports",
        shipping: "Envío gratis",
        rating: 4.3,
        condition: "Nuevo"
    },
    {
        id: 9,
        title: "El Quijote de la Mancha",
        price: 12.99,
        image: "📚",
        category: "books",
        shipping: "$3.99",
        rating: 4.8,
        condition: "Usado - Bueno"
    },
    {
        id: 10,
        title: "Harry Potter - Colección Completa",
        price: 89.99,
        image: "📖",
        category: "books",
        shipping: "Envío gratis",
        rating: 5.0,
        condition: "Nuevo"
    },
    {
        id: 11,
        title: "Lego Star Wars Set",
        price: 79.99,
        image: "🧱",
        category: "toys",
        shipping: "Envío gratis",
        rating: 4.9,
        condition: "Nuevo"
    },
    {
        id: 12,
        title: "Muñeca Barbie Coleccionable",
        price: 34.99,
        image: "🎎",
        category: "toys",
        shipping: "$4.99",
        rating: 4.6,
        condition: "Nuevo"
    },
    {
        id: 13,
        title: "Auriculares Sony WH-1000XM5",
        price: 399.99,
        image: "🎧",
        category: "electronics",
        shipping: "Envío gratis",
        rating: 4.9,
        condition: "Nuevo"
    },
    {
        id: 14,
        title: "Smartwatch Apple Watch Series 9",
        price: 429.99,
        image: "⌚",
        category: "electronics",
        shipping: "Envío gratis",
        rating: 4.8,
        condition: "Nuevo"
    },
    {
        id: 15,
        title: "Chaqueta de Cuero Genuino",
        price: 199.99,
        image: "🧥",
        category: "clothing",
        shipping: "$9.99",
        rating: 4.7,
        condition: "Usado - Excelente"
    },
    {
        id: 16,
        title: "Aspiradora Robot Inteligente",
        price: 299.99,
        image: "🤖",
        category: "home",
        shipping: "Envío gratis",
        rating: 4.5,
        condition: "Nuevo"
    }
];

// Estado de la aplicación
let cart = [];
let filteredProducts = [...products];
let currentCategory = 'all';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    setupEventListeners();
    loadCart();
});

// Configurar event listeners
function setupEventListeners() {
    // Búsqueda
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Filtros
    document.getElementById('sortSelect').addEventListener('change', handleSort);
    document.getElementById('priceRange').addEventListener('input', handlePriceFilter);

    // Navegación por categorías
    document.querySelectorAll('.nav-link[data-category]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.getAttribute('data-category');
            filterByCategory(category);
            
            // Actualizar estado activo
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Carrito
    document.getElementById('cartLink').addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });
    document.getElementById('closeCart').addEventListener('click', closeCart);
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);

    // Cerrar modal al hacer clic fuera
    document.getElementById('cartModal').addEventListener('click', (e) => {
        if (e.target.id === 'cartModal') {
            closeCart();
        }
    });
}

// Renderizar productos
function renderProducts(productsToRender) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    if (productsToRender.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">No se encontraron productos</p>';
        return;
    }

    productsToRender.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

// Crear tarjeta de producto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    
    card.innerHTML = `
        <div class="product-image">${product.image}</div>
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-shipping">${product.shipping}</div>
            <div class="product-rating">
                <span>${stars}</span>
                <span>(${product.rating})</span>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Agregar
                </button>
                <button class="btn btn-secondary" onclick="viewDetails(${product.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Búsqueda
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredProducts = currentCategory === 'all' ? [...products] : products.filter(p => p.category === currentCategory);
    } else {
        filteredProducts = products.filter(product => 
            product.title.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    applyFilters();
}

// Filtrar por categoría
function filterByCategory(category) {
    currentCategory = category;
    filteredProducts = products.filter(p => p.category === category);
    document.getElementById('sectionTitle').textContent = getCategoryName(category);
    applyFilters();
}

// Obtener nombre de categoría
function getCategoryName(category) {
    const names = {
        'electronics': 'Electrónica',
        'clothing': 'Ropa',
        'home': 'Hogar',
        'sports': 'Deportes',
        'books': 'Libros',
        'toys': 'Juguetes'
    };
    return names[category] || 'Productos destacados';
}

// Ordenar productos
function handleSort() {
    applyFilters();
}

// Filtrar por precio
function handlePriceFilter() {
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    priceValue.textContent = `Hasta $${priceRange.value}`;
    applyFilters();
}

// Aplicar todos los filtros
function applyFilters() {
    let result = [...filteredProducts];
    
    // Filtro de precio
    const maxPrice = parseFloat(document.getElementById('priceRange').value);
    result = result.filter(p => p.price <= maxPrice);
    
    // Ordenamiento
    const sortValue = document.getElementById('sortSelect').value;
    switch(sortValue) {
        case 'price-low':
            result.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            result.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            result.sort((a, b) => b.id - a.id);
            break;
        default:
            // Mantener orden original
            break;
    }
    
    renderProducts(result);
}

// Agregar al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartCount();
    showNotification('Producto agregado al carrito');
}

// Ver detalles (simulado)
function viewDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        alert(`Detalles de: ${product.title}\n\nPrecio: $${product.price.toFixed(2)}\nCategoría: ${product.category}\nCondición: ${product.condition}\nCalificación: ${product.rating}/5`);
    }
}

// Abrir carrito
function openCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.add('show');
    renderCart();
}

// Cerrar carrito
function closeCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.remove('show');
}

// Renderizar carrito
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">${item.image}</div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2);
}

// Eliminar del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
}

// Procesar pago (simulado)
function handleCheckout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`¡Gracias por tu compra!\n\nTotal: $${total.toFixed(2)}\n\n(Esta es una demostración. El pago no se procesará realmente.)`);
    
    cart = [];
    saveCart();
    updateCartCount();
    closeCart();
    renderCart();
}

// Actualizar contador del carrito
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Cargar carrito de localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Mostrar notificación
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--success-color);
        color: white;
        padding: 15px 25px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideIn 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

