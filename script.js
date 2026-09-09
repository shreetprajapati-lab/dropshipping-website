const products = [
  {id:1,name:'Premium Wireless Headphones',category:'electronics',price:2499,icon:'fa-headphones'},
  {id:2,name:'Smart Watch Pro',category:'electronics',price:1999,icon:'fa-clock'},
  {id:3,name:'Portable Bluetooth Speaker',category:'electronics',price:1499,icon:'fa-volume-high'},
  {id:4,name:'Classic Lifestyle Sunglasses',category:'fashion',price:999,icon:'fa-glasses'},
  {id:5,name:'Premium Travel Bottle',category:'home',price:799,icon:'fa-bottle-water'},
  {id:6,name:'Everyday Mini Backpack',category:'fashion',price:1299,icon:'fa-bag-shopping'},
  {id:7,name:'Fitness Training Set',category:'sports',price:1799,icon:'fa-dumbbell'},
  {id:8,name:'Smart Desk Lamp',category:'home',price:1199,icon:'fa-lightbulb'}
];

let cart = JSON.parse(localStorage.getItem('shophubCart') || '[]');

const productsGrid = document.getElementById('productsGrid');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const searchModal = document.getElementById('searchModal');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

function formatPrice(value){
  return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);
}

function renderProducts(){
  const category = categoryFilter.value;
  const sort = sortFilter.value;
  let list = products.filter(p => !category || p.category === category);

  if(sort === 'price-low') list.sort((a,b)=>a.price-b.price);
  if(sort === 'price-high') list.sort((a,b)=>b.price-a.price);
  if(sort === 'popular') list.sort((a,b)=>b.id-a.id);

  productsGrid.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-img"><i class="fa-solid ${p.icon}"></i></div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="product-meta">
          <span class="price">${formatPrice(p.price)}</span>
          <button class="add-btn" data-add="${p.id}">Add to Cart</button>
        </div>
      </div>
    </article>
  `).join('');

  if(!list.length){
    productsGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#625e58;padding:40px">No products found.</p>';
  }
}

function saveCart(){
  localStorage.setItem('shophubCart', JSON.stringify(cart));
}

function updateCart(){
  const totalQty = cart.reduce((sum,item)=>sum+item.qty,0);
  const total = cart.reduce((sum,item)=>sum+item.price*item.qty,0);
  cartCount.textContent = totalQty;
  cartTotal.textContent = total.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});

  if(!cart.length){
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-row">
      <div><strong>${item.name}</strong><div style="color:#625e58;font-size:.86rem">${formatPrice(item.price)} × ${item.qty}</div></div>
      <button class="add-btn" data-remove="${item.id}" aria-label="Remove ${item.name}">Remove</button>
    </div>
  `).join('');
}

function addToCart(id){
  const product = products.find(p=>p.id === id);
  if(!product) return;
  const existing = cart.find(item=>item.id === id);
  if(existing) existing.qty += 1;
  else cart.push({...product,qty:1});
  saveCart();
  updateCart();
}

productsGrid.addEventListener('click', e=>{
  const btn = e.target.closest('[data-add]');
  if(btn) addToCart(Number(btn.dataset.add));
});

cartItems.addEventListener('click', e=>{
  const btn = e.target.closest('[data-remove]');
  if(!btn) return;
  cart = cart.filter(item => item.id !== Number(btn.dataset.remove));
  saveCart();
  updateCart();
});

categoryFilter.addEventListener('change', renderProducts);
sortFilter.addEventListener('change', renderProducts);

document.getElementById('cartBtn').addEventListener('click',()=>{cartModal.style.display='flex';updateCart()});
document.getElementById('closeCart').addEventListener('click',()=>cartModal.style.display='none');
cartModal.addEventListener('click',e=>{if(e.target===cartModal) cartModal.style.display='none'});

document.getElementById('searchBtn').addEventListener('click',()=>{searchModal.style.display='flex';searchInput.focus()});
document.getElementById('closeSearch').addEventListener('click',()=>searchModal.style.display='none');
searchModal.addEventListener('click',e=>{if(e.target===searchModal) searchModal.style.display='none'});

function renderSearchResults(query=''){
  const term = query.trim().toLowerCase();
  const matches = products.filter(p => !term || p.name.toLowerCase().includes(term) || p.category.includes(term));
  searchResults.innerHTML = matches.map(p=>`
    <div style="padding:12px 4px;border-top:1px solid #eee;display:flex;justify-content:space-between;gap:15px;align-items:center">
      <span>${p.name}</span><button class="add-btn" data-search-add="${p.id}">Add</button>
    </div>
  `).join('') || '<p style="padding:18px 4px;color:#625e58">No matching products.</p>';
}

searchInput.addEventListener('input',e=>renderSearchResults(e.target.value));
searchResults.addEventListener('click',e=>{
  const btn=e.target.closest('[data-search-add]');
  if(btn){addToCart(Number(btn.dataset.searchAdd));searchModal.style.display='none';}
});

const shopNow = document.querySelector('.cta-btn');
if(shopNow) shopNow.addEventListener('click',()=>document.getElementById('products').scrollIntoView({behavior:'smooth'}));

const contactForm = document.getElementById('contactForm');
if(contactForm) contactForm.addEventListener('submit',e=>{
  e.preventDefault();
  alert('Thank you! Your message has been received.');
  contactForm.reset();
});

document.querySelectorAll('a[href="#"]').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));

renderProducts();
updateCart();
