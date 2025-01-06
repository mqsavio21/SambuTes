// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/index.html';
    }
    
    // user info
    const userData = JSON.parse(localStorage.getItem('userData'));
    document.getElementById('userInfo').textContent = `Welcome, ${userData.firstName}`;
    document.getElementById('userInfo').classList.add('welcome-text');
}

const PRODUCTS_PER_PAGE = 8; // 2 row per products
let currentPage = 1;
let allProducts = [];

// Fetch and display products
async function fetchProducts() {
    try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();
        allProducts = data.products;
        
        displayProducts(1);
        setupPagination(allProducts.length);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// display products
function displayProducts(page) {
    currentPage = page;
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const productsToShow = allProducts.slice(startIndex, endIndex);
    
    const container = document.getElementById('productsContainer');
    container.innerHTML = productsToShow.map(product => `
        <div class="product-card cursor-pointer"
             onclick="showProductDetails(${product.id})">
            <img src="${product.thumbnail}" alt="${product.title}" 
                 class="product-image">
            <div class="product-content">
                <h3 class="product-title text-base sm:text-lg">${product.title}</h3>
                <p class="product-description text-xs sm:text-sm">${product.description}</p>
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                    <span class="product-price text-base sm:text-lg">$${product.price}</span>
                    <button class="discover-button text-sm sm:text-base">
                        Discover Product
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function setupPagination(totalProducts) {
    const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
    const paginationContainer = document.getElementById('pagination');
    
    paginationContainer.innerHTML = `
        <button 
            onclick="changePage(${currentPage - 1})"
            class="pagination-button ${currentPage === 1 ? 'disabled' : ''}"
            ${currentPage === 1 ? 'disabled' : ''}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
        </button>
        <span class="text-gray-800 mx-4">
            Page ${currentPage} of ${totalPages}
        </span>
        <button 
            onclick="changePage(${currentPage + 1})"
            class="pagination-button ${currentPage === totalPages ? 'disabled' : ''}"
            ${currentPage === totalPages ? 'disabled' : ''}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
        </button>
    `;
}

// Add new function to handle page changes
function changePage(newPage) {
    const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
    if (newPage >= 1 && newPage <= totalPages) {
        displayProducts(newPage);
        setupPagination(allProducts.length);
    }
}

function openModal() {
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    document.getElementById('productModal').classList.remove('hidden');
    document.getElementById('productModal').classList.add('flex');
}

function closeModal() {
    document.body.style.overflow = ''; // Restore scrolling
    document.getElementById('productModal').classList.add('hidden');
    document.getElementById('productModal').classList.remove('flex');
}

// showProductDetails
async function showProductDetails(productId) {
    try {
        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        const product = await response.json();
        
        const details = document.getElementById('productDetails');
        details.innerHTML = `
            <div class="md:col-span-2">
                <h2 class="text-xl sm:text-2xl font-bold mb-4">${product.title}</h2>
            </div>
            <div class="w-full">
                <img src="${product.thumbnail}" alt="${product.title}" 
                     class="w-full h-48 sm:h-64 object-cover rounded-lg">
            </div>
            <div class="space-y-2">
                <p class="text-gray-600 text-sm sm:text-base">${product.description}</p>
                <p class="text-green-600 font-bold text-lg sm:text-xl">$${product.price}</p>
                <p class="text-gray-500 text-sm">Rating: ${product.rating}/5</p>
                <p class="text-gray-500 text-sm">Stock: ${product.stock}</p>
                <p class="text-gray-500 text-sm">Brand: ${product.brand}</p>
                <p class="text-gray-500 text-sm">Category: ${product.category}</p>
            </div>
        `;
        
        openModal();
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Logout
const logoutModal = document.getElementById('logoutModal');
const logoutBtn = document.getElementById('logoutBtn');
const cancelLogoutBtn = document.getElementById('cancelLogout');
const confirmLogoutBtn = document.getElementById('confirmLogout');

// Show logout confirmation
logoutBtn.addEventListener('click', () => {
    document.body.style.overflow = 'hidden';
    logoutModal.classList.remove('hidden');
});

// Cancel logout
cancelLogoutBtn.addEventListener('click', () => {
    document.body.style.overflow = '';
    logoutModal.classList.add('hidden');
});

logoutModal.addEventListener('click', (e) => {
    if (e.target === logoutModal) {
        document.body.style.overflow = '';
        logoutModal.classList.add('hidden');
    }
});

// Confirm logout
confirmLogoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.href = 'index.html';
});

// Initialize dashboard
checkAuth();
fetchProducts();