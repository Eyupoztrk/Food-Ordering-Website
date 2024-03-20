 // JavaScript kodu
 document.addEventListener("DOMContentLoaded", function () {
    // Sayfa yüklendiğinde çalışacak kodlar
    var addToCartButtons = document.querySelectorAll('.addToCartBtn');

    addToCartButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Bildirim gösterme fonksiyonu
            showNotification('Item added to cart!');
        });
    });

    function showNotification(message) {
        // Bildirim gösterme işlemleri burada yapılabilir
        alert(message);
    }
});

document.getElementById('loadProductsBtn').addEventListener('click', function() {
    // "/get_products" endpoint'ine GET isteği yap
    fetch('/get_products')
        .then(response => response.json())
        .then(data => {
            // Gelen ürün bilgilerini kullanarak HTML içeriğini oluştur
            const productContainer = document.getElementById('product-container');
            productContainer.innerHTML = '';

            data.products.forEach(product => {
                const box = document.createElement('div');
                box.className = 'box';
                box.innerHTML = `
                    <div class="box-head">
                        <img src="${product.image_url}" alt="${product.name}">
                        <span class="menu-category">${product.category}</span>
                        <h3>${product.name}</h3>
                        <div class="price">$${product.price} <span> ${product.discount_price}</span></div>
                    </div>
                    <div class="box-bottom">
                        <a href="#" class="btn addToCartBtn"> add to cart </a>
                    </div>
                `;
                productContainer.appendChild(box);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
});

let products = [];

    // Flask API'ından tüm ürün listesini çek
    const fetchAllProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/get_products");
            const data = await response.json();
            products = data.products;
            renderProducts();
        } catch (error) {
            console.error("Ürünleri çekerken hata oluştu:", error);
        }
    };

    // Ürünleri sayfaya ekle
    const renderProducts = (productsToRender = products) => {
        const productContainer = document.getElementById("productContainer");
        productContainer.innerHTML = '';

        productsToRender.forEach(product => {
            const box = document.createElement('div');
            box.className = 'box';
            box.innerHTML = `
                <div class="box-head">
                    <img src="${product.image_url}" alt="${product.name}">
                    <span class="menu-category">${product.category}</span>
                    <h3>${product.name}</h3>
                    <div class="price">$${product.price} <span> ${product.discount_price}</span></div>
                </div>
                <div class="box-bottom">
                    <a href="#" class="btn addToCartBtn"> add to cart </a>
                </div>
            `;
            productContainer.appendChild(box);
        });

        
    };






   
    