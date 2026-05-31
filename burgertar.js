// ═══════════════════════════════════════
//  DATA & STATE
// ═══════════════════════════════════════

const CAT_EMOJI = {
  Ayam:'🍗', Lembu:'🥩', Ikan:'🐟', Benjo:'🫓',
  Itik:'🦆', Arnab:'🐇', Kambing:'🐐', 'Ayam Crispy':'🍗', Smash:'🔥'
};

const MENU_ITEMS = [
  { id:1,  name:'Burger Ayam',         category:'Ayam',         stock:'available', prices:{Normal:4.00,Special:5.00,Double:6.00,'Double Special':6.50}, image: "assets/ayamgrill.png" }, 
  { id:2,  name:'Ayam Grill',          category:'Ayam',         stock:'available', prices:{Normal:4.00,Special:5.00,Double:6.00,'Double Special':6.50}, image: "assets/ayamgrill.png" }, 
  { id:3,  name:'Burger Lembu',        category:'Lembu',        stock:'available', prices:{Normal:4.00,Special:5.00,Double:6.00,'Double Special':6.50}, image: "assets/daging.png" },
  { id:4,  name:'Beef Melt',           category:'Lembu',        stock:'low',       prices:{Normal:4.00,Special:5.00,Double:6.00,'Double Special':6.50}, image: "assets/daging.png" },
  { id:5,  name:'Burger Ikan',         category:'Ikan',         stock:'available', prices:{Normal:4.00,Special:5.00,Double:6.00,'Double Special':7.00}, image: "assets/ikan.png" },
  { id:17, name:'Ikan Spicy',          category:'Ikan',         stock:'available', prices:{Normal:4.00,Special:5.00,Double:6.00,'Double Special':7.00}, image: "assets/ikan.png" },
  { id:8,  name:'Burger Benjo',        category:'Benjo',        stock:'available', prices:{Normal:3.00,Special:4.00,Double:4.00,'Double Special':4.50}, image: "assets/benjo.png" },
  { id:18, name:'Benjo Spicy',         category:'Benjo',        stock:'available', prices:{Normal:3.00,Special:4.00,Double:4.00,'Double Special':4.50}, image: "assets/benjo.png" },
  { id:9,  name:'Burger Itik',         category:'Itik',         stock:'available', prices:{Normal:7.00,Special:8.00,Double:11.00,'Double Special':11.50}, image: "assets/itik.png" },
  { id:19, name:'Itik Spicy',          category:'Itik',         stock:'available', prices:{Normal:7.00,Special:8.00,Double:11.00,'Double Special':11.50}, image: "assets/itik.png" },
  { id:10, name:'Burger Arnab',        category:'Arnab',        stock:'out',       prices:{Normal:7.00,Special:8.00,Double:11.00,'Double Special':11.50}, image: "assets/arnab.png" },
  { id:20, name:'Arnab Spicy',         category:'Arnab',        stock:'available', prices:{Normal:7.00,Special:8.00,Double:11.00,'Double Special':11.50}, image: "assets/arnab.png" },
  { id:11, name:'Burger Kambing',      category:'Kambing',      stock:'available', prices:{Normal:6.00,Special:7.00,Double:10.00,'Double Special':10.50}, image: "assets/kambing.png" },
  { id:12, name:'Kambing Special',     category:'Kambing',      stock:'available', prices:{Normal:6.00,Special:7.00,Double:10.00,'Double Special':10.50}, image: "assets/kambing.png" },
  { id:13, name:'Burger Ayam Crispy',  category:'Ayam Crispy',  stock:'available', prices:{Normal:6.00,Special:7.00,Double:10.00,'Double Special':11.00}, image: "assets/ayam-crispy.png" },
  { id:14, name:'Crispy Spicy',        category:'Ayam Crispy',  stock:'low',       prices:{Normal:6.00,Special:7.00,Double:10.00,'Double Special':11.00}, image: "assets/ayam-crispy.png" },
  { id:15, name:'Smash Burger',        category:'Smash',        stock:'available', prices:{Normal:6.00,Special:7.00,Double:10.00,'Double Special':11.00}, image: "assets/smash.png" },
  { id:16, name:'Double Smash',        category:'Smash',        stock:'available', prices:{Normal:6.00,Special:7.00,Double:10.00,'Double Special':11.00}, image: "assets/smash.png" },
];

const CATEGORIES = ['Ayam','Lembu','Ikan','Benjo','Itik','Arnab','Kambing','Ayam Crispy','Smash'];
const SIZES      = ['Normal','Special','Double','Double Special'];

// NEW — merges saved data but always uses latest images from MENU_ITEMS
const _saved = JSON.parse(localStorage.getItem('bt_menu') || 'null');
let menuItems = _saved
  ? _saved.map(saved => {
      const fresh = MENU_ITEMS.find(m => m.id === saved.id);
      return fresh ? { ...saved, image: fresh.image } : saved;
    })
  : MENU_ITEMS;
let orders        = JSON.parse(localStorage.getItem('bt_orders') || '[]');
let promoCodes    = JSON.parse(localStorage.getItem('bt_promos') || 'null') || [
  {id:1,code:'BURGER10',type:'percent',value:10,min:0,  expiry:'2026-12-31'},
  {id:2,code:'WELCOME5', type:'fixed',  value:5, min:15, expiry:'2026-12-31'},
];

let cart            = [];
let selectedSizes   = {};
let itemCheese      = {};
let appliedPromo    = null;
let contactPref     = 'WhatsApp Chat';
let paymentMethod   = 'qr';
let currentFilter   = 'all';
let orderIdCounter  = parseInt(localStorage.getItem('bt_counter') || '1000');

function saveState() {
  localStorage.setItem('bt_menu',    JSON.stringify(menuItems));
  localStorage.setItem('bt_orders',  JSON.stringify(orders));
  localStorage.setItem('bt_promos',  JSON.stringify(promoCodes));
  localStorage.setItem('bt_counter', orderIdCounter.toString());
}

// ═══════════════════════════════════════
//  VIEW ROUTING
// ═══════════════════════════════════════
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + name).classList.add('active');
  if (name === 'menu')     renderMenu('all');
  if (name === 'admin')    renderAdmin();
  if (name === 'checkout') renderCheckout();
  // Mobile bottom nav: only visible on the menu/order page
  const mbn = document.querySelector('.mobile-bottom-nav');
  if (mbn) mbn.classList.toggle('show', name === 'menu');
  window.scrollTo(0,0);
}

// ═══════════════════════════════════════
//  MENU RENDERING
// ═══════════════════════════════════════
function renderMenu(cat) {
  const grid      = document.getElementById('menuGrid');
  const filtered  = cat === 'all' ? menuItems : menuItems.filter(i => i.category === cat);
  const cats      = cat === 'all' ? CATEGORIES : [cat];
  let html        = '';

  cats.forEach(c => {
    const items = filtered.filter(i => i.category === c);
    if (!items.length) return;
    html += `<div class="cat-section-title">${c} <span>${items.length} items</span></div>`;
    html += `<div class="row g-3 mb-2">`;
    items.forEach(item => {
      const sel      = selectedSizes[item.id] || 'Normal';
      const isOut    = item.stock === 'out';
      const badgeCls = item.stock === 'available' ? 'badge-avail' : item.stock === 'low' ? 'badge-low' : 'badge-out';
      const badgeTxt = item.stock === 'available' ? 'In Stock' : item.stock === 'low' ? 'Low Stock' : 'Out of Stock';
      const emoji    = CAT_EMOJI[c] || '🍔';
      const imgSrc   = item.image || '';
      const cheeseOn = itemCheese[item.id] || false;

      html += `
      <div class="col-6">
        <div class="bcard">
          <div class="bcard-img">
            <span class="bcard-badge ${badgeCls}">${badgeTxt}</span>
            ${imgSrc
              ? `<img src="${imgSrc}" alt="${item.name}">`
              : `<span class="bcard-emoji">${emoji}</span>`
            }
          </div>
          <div class="bcard-body">
            <div class="bcard-name">${item.name}</div>
            <div class="bcard-cat">${c}</div>
            <div class="size-grid">
              ${SIZES.map(s => `
                <div class="size-opt ${sel===s?'selected':''}" onclick="selectSize(${item.id},'${s}',this)">
                  <span class="sn">${s}</span>
                  <span class="sp">RM ${item.prices[s].toFixed(2)}</span>
                </div>`).join('')}
            </div>
            <button class="cheese-toggle ${cheeseOn?'active':''}" onclick="toggleCheese(${item.id},this)">
              <span style="font-size:1rem;">🧀</span>
              <span class="cheese-toggle-label">Add Cheese +RM 0.50</span>
              <span class="cheese-toggle-check">${cheeseOn?'✓':''}</span>
            </button>
            <textarea class="special-req" id="req-${item.id}" placeholder="Special request? e.g. No mayo, extra sauce, no veggies..." rows="2"></textarea>
            <button class="add-cart-btn" ${isOut?'disabled':''} onclick="addToCart(${item.id})">
              ${isOut ? 'Unavailable' : '+ Add to Cart'}
            </button>
          </div>
        </div>
      </div>`;
    });
    html += `</div>`;
  });

  grid.innerHTML = html || `<div style="padding:3rem;text-align:center;color:var(--fog);font-size:14px;">No items found</div>`;
  updateCartDisplay();
}

function filterCategory(cat, btn, source) {
  // sync both sidebar and mobile pill
  if (source === 'mobile') {
    document.querySelectorAll('.mobile-cat-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.cat-btn').forEach(b => {
      b.classList.toggle('active', b.textContent.trim() === (cat==='all'?'All Items':cat));
    });
  } else {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.mobile-cat-pill').forEach(b => {
      const txt = cat==='all'?'All':cat;
      b.classList.toggle('active', b.textContent.trim() === txt);
    });
  }
  renderMenu(cat);
}

function selectSize(itemId, size, el) {
  selectedSizes[itemId] = size;
  el.closest('.size-grid').querySelectorAll('.size-opt').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
}

function toggleCheese(itemId, btn) {
  itemCheese[itemId] = !itemCheese[itemId];
  btn.classList.toggle('active', itemCheese[itemId]);
  btn.querySelector('.cheese-toggle-check').textContent = itemCheese[itemId] ? '✓' : '';
  const label = btn.querySelector('.cheese-toggle-label');
  label.style.color = itemCheese[itemId] ? 'var(--gold)' : '';
}

// ═══════════════════════════════════════
//  CART
// ═══════════════════════════════════════
function addToCart(itemId) {
  const item = menuItems.find(i => i.id === itemId);
  if (!item || item.stock === 'out') return;
  const size    = selectedSizes[itemId] || 'Normal';
  const cheese  = itemCheese[itemId] || false;
  const reqEl   = document.getElementById(`req-${itemId}`);
  const request = reqEl ? reqEl.value.trim() : '';
  const price   = item.prices[size] + (cheese ? 0.5 : 0);
  const key     = `${itemId}-${size}-${cheese ? 'cheese' : 'no'}-${Date.now()}`;
  cart.push({key, itemId, name:item.name, size, price, qty:1, category:item.category, cheese, request});
  updateCartDisplay();
  showToast('success', 'Added to Cart', `${item.name} (${size})${cheese?' + Cheese':''}${request?' · Note added':''}`);
}

function changeQty(key, delta) {
  const idx = cart.findIndex(c => c.key === key);
  if (idx < 0) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateCartDisplay();
}

function removeItem(key) {
  cart = cart.filter(c => c.key !== key);
  updateCartDisplay();
}

function updateCartDisplay() {
  const count    = cart.reduce((s,i) => s + i.qty, 0);
  const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
  let discount   = 0;

  if (appliedPromo) {
    const p = appliedPromo;
    if (subtotal >= (p.min || 0)) {
      discount = p.type === 'percent' ? subtotal * (p.value/100) : Math.min(p.value, subtotal);
    }
  }
  const total = Math.max(0, subtotal - discount);

  // desktop cart
  document.getElementById('cart-count').textContent      = count;
  document.getElementById('topnav-badge').textContent    = count;
  document.getElementById('subtotalDisplay').textContent = `RM ${subtotal.toFixed(2)}`;
  document.getElementById('totalDisplay').textContent    = `RM ${total.toFixed(2)}`;
  document.getElementById('topbar-total').textContent    = `RM ${total.toFixed(2)}`;

  const dr = document.getElementById('discountRow');
  if (discount > 0) {
    dr.style.display = 'flex';
    document.getElementById('discountDisplay').textContent = `-RM ${discount.toFixed(2)}`;
  } else { dr.style.display = 'none'; }

  const btn = document.getElementById('checkoutBtn');
  btn.disabled = count === 0;

  // mobile cart sync
  const mobBadge = document.getElementById('mob-cart-badge');
  if (mobBadge) {
    mobBadge.textContent = count;
    mobBadge.classList.toggle('visible', count > 0);
  }
  const mobCount = document.getElementById('mob-cart-count');
  if (mobCount) mobCount.textContent = count;
  const mobSub = document.getElementById('mobSubtotal');
  if (mobSub) mobSub.textContent = `RM ${subtotal.toFixed(2)}`;
  const mobTot = document.getElementById('mobTotal');
  if (mobTot) mobTot.textContent = `RM ${total.toFixed(2)}`;
  const mobDr = document.getElementById('mobDiscountRow');
  if (mobDr) {
    if (discount>0){ mobDr.style.display='flex'; document.getElementById('mobDiscount').textContent=`-RM ${discount.toFixed(2)}`; }
    else mobDr.style.display='none';
  }
  const mobBtn = document.getElementById('mobCheckoutBtn');
  if (mobBtn) mobBtn.disabled = count === 0;

  // highlight checkout mobile nav btn
  const mobCo = document.getElementById('mobnav-checkout');
  if (mobCo) mobCo.style.color = count>0 ? 'var(--ember)' : '';

  const cartHtml = cart.length === 0
    ? `<div class="cart-empty"><div class="cart-empty-icon">🛒</div><div class="cart-empty-text">No items yet<br><span style="letter-spacing:0;font-weight:400;text-transform:none;font-size:11px;">Pick something from the menu</span></div></div>`
    : cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-emoji">${CAT_EMOJI[item.category]||'🍔'}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-sub">${item.size}${item.cheese?' · 🧀 +Cheese':''} · RM ${item.price.toFixed(2)}</div>
          ${item.request ? `<div class="cart-item-sub" style="color:var(--gold);font-style:italic;">📝 ${item.request}</div>` : ''}
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="changeQty('${item.key}',-1)">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.key}',1)">+</button>
            <button class="remove-btn" onclick="removeItem('${item.key}')" title="Remove">✕</button>
          </div>
        </div>
        <div class="cart-item-price">RM ${(item.price*item.qty).toFixed(2)}</div>
      </div>`).join('');

  // render to both desktop and mobile cart
  document.getElementById('cartItems').innerHTML = cartHtml;
  const mobEl = document.getElementById('mobCartItems');
  if (mobEl) mobEl.innerHTML = cartHtml;
}

function applyPromo() {
  const code = document.getElementById('promoInput').value.trim().toUpperCase();
  const now  = new Date().toISOString().split('T')[0];
  const promo = promoCodes.find(p => p.code === code && p.expiry >= now);
  if (!promo) { showToast('error','Invalid Code','Promo code not found or expired'); return; }
  appliedPromo = promo;
  updateCartDisplay();
  showToast('success','Promo Applied', promo.type==='percent' ? `${promo.value}% off` : `RM ${promo.value} off`);
}

function goToCheckout() {
  if (!cart.length) return;
  showView('checkout');
}

// ═══════════════════════════════════════
//  CHECKOUT
// ═══════════════════════════════════════
function renderCheckout() {
  const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  let discount = 0;
  if (appliedPromo) {
    const p=appliedPromo;
    if(subtotal>=(p.min||0)) discount=p.type==='percent'?subtotal*(p.value/100):Math.min(p.value,subtotal);
  }
  const total = Math.max(0,subtotal-discount);
  document.getElementById('co-subtotal').textContent = `RM ${subtotal.toFixed(2)}`;
  document.getElementById('co-total').textContent    = `RM ${total.toFixed(2)}`;
  const dr = document.getElementById('co-discount-row');
  if (discount>0) { dr.style.display='flex'; document.getElementById('co-discount').textContent=`-RM ${discount.toFixed(2)}`; }
  else dr.style.display='none';

  document.getElementById('checkoutSummary').innerHTML = cart.map(i=>`
    <div class="order-summary-line">
      <span><span class="qty">${i.qty}×</span>${i.name} <span class="text-fog">(${i.size}${i.cheese?' + Cheese':''})</span>${i.request?`<br><span style="font-size:11px;color:var(--gold);font-style:italic;">📝 ${i.request}</span>`:''}</span>
      <span class="price">RM ${(i.price*i.qty).toFixed(2)}</span>
    </div>`).join('');
}

function selectContact(el) {
  document.querySelectorAll('.contact-chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  contactPref = el.dataset.pref;
}

function selectPayment(method) {
  paymentMethod = method;
  document.getElementById('pay-qr').classList.toggle('active', method==='qr');
  document.getElementById('pay-cash').classList.toggle('active', method==='cash');
  document.getElementById('qr-section').style.display   = method==='qr'   ? 'block':'none';
  document.getElementById('cash-section').style.display = method==='cash' ? 'block':'none';
}

function triggerUpload() { document.getElementById('receiptFile').click(); }

function handleFileUpload(input) {
  if (input.files && input.files[0]) {
    document.getElementById('uploadZone').classList.add('has-file');
    document.getElementById('uploadedFilename').style.display = 'block';
    document.getElementById('uploadedFilename').textContent = '✓ ' + input.files[0].name;
  }
}

function placeOrder() {
  const name  = document.getElementById('co-name').value.trim();
  const phone = document.getElementById('co-phone').value.trim();
  if (!name||!phone) { showToast('error','Missing Info','Please fill in name and phone'); return; }
  if (paymentMethod==='qr' && !document.getElementById('receiptFile').files?.length) {
    showToast('error','Receipt Required','Please upload your payment receipt'); return;
  }

  const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  let discount=0;
  if(appliedPromo){const p=appliedPromo;if(subtotal>=(p.min||0))discount=p.type==='percent'?subtotal*(p.value/100):Math.min(p.value,subtotal);}
  const total=Math.max(0,subtotal-discount);

  orderIdCounter++;
  const orderId = `ORD-${orderIdCounter}`;
  const order = {
    id:orderId, name, phone, contact:contactPref, payment:paymentMethod,
    items:[...cart], subtotal, discount, total, status:'pending',
    time:new Date().toLocaleString('en-MY',{hour:'2-digit',minute:'2-digit',hour12:true})
  };
  orders.unshift(order);
  saveState();

  // Confirmation
  document.getElementById('confirmOrderId').textContent = orderId;
  document.getElementById('confirmMsg').innerHTML = paymentMethod==='qr'
    ? 'Your QR payment receipt is under review.<br>We\'ll notify you once approved.'
    : 'Your cash order is pending cashier approval.<br>We will contact you shortly.';
  document.getElementById('confirmDetails').innerHTML = `
    <strong style="font-family:'Syne',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;display:block;margin-bottom:6px;">Order Details</strong>
    Customer: ${name}<br>Phone: ${phone}<br>Contact via: ${contactPref}<br>
    Payment: ${paymentMethod==='qr'?'QR Payment':'Cash'}<br>
    Total: <strong style="color:var(--flame);">RM ${total.toFixed(2)}</strong>`;

  cart = []; selectedSizes = {}; appliedPromo = null;
  document.getElementById('promoInput').value = '';
  showView('confirmation');
  showToast('success','Order Placed!', orderId);
}

// ═══════════════════════════════════════
//  ADMIN
// ═══════════════════════════════════════
function doLogin() {
  const u = document.getElementById('adminUser').value;
  const p = document.getElementById('adminPass').value;
  if (u==='admin' && p==='admin123') {
    document.getElementById('loginError').style.display='none';
    showView('admin');
  } else {
    document.getElementById('loginError').style.display='block';
  }
}

function adminLogout() {
  document.getElementById('adminUser').value='';
  document.getElementById('adminPass').value='';
  showView('home');
}

function switchAdminPanel(name, btn) {
  document.querySelectorAll('.admin-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('panel-'+name).classList.add('active');
  document.querySelectorAll('.admin-nav-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  if(name==='orders')       renderOrders();
  if(name==='queue')        renderQueue();
  if(name==='menu')         renderAdminMenu();
  if(name==='promos')       renderPromos();
  if(name==='analytics')    renderAnalytics();
  if(name==='create-order') { renderAdminOrder(); aoUpdateCart(); }
}

function renderAdmin() {
  const pending = orders.filter(o=>o.status==='pending').length;
  document.getElementById('pendingBadge').textContent = pending;
  document.getElementById('dashDate').textContent = new Date().toLocaleDateString('en-MY',{weekday:'long',day:'numeric',month:'long'});

  const today = new Date().toLocaleDateString('en-MY');
  const todaySales = orders.filter(o=>o.status==='completed' && new Date(o.time).toLocaleDateString('en-MY')===today).reduce((s,o)=>s+o.total,0);
  document.getElementById('stat-sales').textContent   = `RM ${orders.reduce((s,o)=>s+o.total,0).toFixed(0)}`;
  document.getElementById('stat-orders').textContent  = orders.length;
  document.getElementById('stat-pending').textContent = pending;
  const avg = orders.length ? orders.reduce((s,o)=>s+o.total,0)/orders.length : 0;
  document.getElementById('stat-avg').textContent     = `RM ${avg.toFixed(0)}`;

  // Weekly chart
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const today2 = new Date();
  const counts = Array(7).fill(0);
  orders.forEach(o => {
    const d = new Date(); // simplified: use order index as proxy
    // count per day of week from order id index
  });
  // Simple demo chart
  const chartData = [3,7,5,9,4,12,6];
  const max = Math.max(...chartData,1);
  document.getElementById('weeklyChart').innerHTML = chartData.map((v,i)=>`
    <div class="chart-bar-wrap">
      <div class="chart-bar" style="height:${(v/max*100)}%"></div>
      <div class="chart-bar-label">${days[(today2.getDay()-6+i+7)%7]}</div>
    </div>`).join('');

  // Recent orders
  const tbody = document.getElementById('recentOrdersTbody');
  tbody.innerHTML = orders.slice(0,5).map(o=>`
    <tr>
      <td style="font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:1px;color:var(--flame);">${o.id}</td>
      <td style="font-weight:600;color:var(--char);">${o.name}</td>
      <td style="font-family:'Bebas Neue',sans-serif;font-size:1rem;color:var(--flame);">RM ${o.total.toFixed(2)}</td>
      <td><span class="pay-badge ${o.payment==='qr'?'pay-qr':'pay-cash'}">${o.payment==='qr'?'QR':'Cash'}</span></td>
      <td><span class="s-badge s-${o.status}">${o.status}</span></td>
    </tr>`).join('') || `<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--fog);">No orders yet</td></tr>`;
}

function renderOrders() {
  const fil = currentFilter;
  const data = fil==='all' ? orders : orders.filter(o=>o.status===fil);
  document.getElementById('orderCount').textContent = `${data.length} orders`;
  document.getElementById('ordersTbody').innerHTML = data.map(o=>`
    <tr>
      <td style="font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:1px;color:var(--flame);">${o.id}</td>
      <td style="font-size:12px;color:var(--fog);">${o.time}</td>
      <td style="font-weight:600;color:var(--char);">${o.name}</td>
      <td style="font-size:12px;">${o.phone}</td>
      <td style="font-size:12px;">${o.items.length} item(s)</td>
      <td style="font-family:'Bebas Neue',sans-serif;font-size:1rem;color:var(--flame);">RM ${o.total.toFixed(2)}</td>
      <td><span class="pay-badge ${o.payment==='qr'?'pay-qr':'pay-cash'}">${o.payment==='qr'?'QR':'Cash'}</span></td>
      <td><span class="s-badge s-${o.status}">${o.status}</span></td>
      <td>
      <td>
        <div style="display:flex;gap:4px;flex-wrap:wrap;align-items:center;">
          <button class="btn-ghost btn-sm" style="padding:4px 10px;font-size:10px;" onclick="viewOrder('${o.id}')">View</button>
          ${o.status==='pending' ? `
            <button class="btn-primary btn-sm" style="padding:4px 10px;font-size:10px;background:#1D7A4F;border:none;" onclick="updateStatus('${o.id}','approved')">✓ Approve</button>
            <button class="btn-danger btn-sm" style="padding:4px 10px;font-size:10px;" onclick="updateStatus('${o.id}','rejected')">✕ Reject</button>
          ` : `<span class="s-badge s-${o.status}" style="font-size:9px;">${o.status}</span>`}
        </div>
      </td>
    </tr>`).join('') || `<tr><td colspan="9" style="text-align:center;padding:2rem;color:var(--fog);">No orders</td></tr>`;
}

function filterOrders(f) {
  currentFilter = f;
  document.querySelectorAll('[id^="filter-"]').forEach(b=>{
    b.classList.toggle('btn-primary', b.id==='filter-'+f);
    if(b.id!=='filter-'+f) b.classList.add('btn-ghost');
    else b.classList.remove('btn-ghost');
  });
  renderOrders();
}

function updateStatus(orderId, status) {
  const o = orders.find(o=>o.id===orderId);
  if(o) { o.status=status; saveState(); renderAdmin(); renderOrders(); showToast('info','Status Updated',`${orderId} → ${status}`); }
}

function viewOrder(orderId) {
  const o = orders.find(o=>o.id===orderId);
  if(!o) return;
  document.getElementById('orderDetailContent').innerHTML = `
    <div style="font-family:'Bebas Neue',sans-serif;font-size:1.4rem;color:var(--flame);letter-spacing:2px;margin-bottom:6px;">${o.id}</div>
    <div style="font-size:12px;color:var(--fog);margin-bottom:1.25rem;">${o.time}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:1.25rem;">
      <div><div style="font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--fog);margin-bottom:3px;">Customer</div><div style="font-weight:600;color:var(--char);">${o.name}</div></div>
      <div><div style="font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--fog);margin-bottom:3px;">Phone</div><div>${o.phone}</div></div>
      <div><div style="font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--fog);margin-bottom:3px;">Contact</div><div style="font-size:13px;">${o.contact}</div></div>
      <div><div style="font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--fog);margin-bottom:3px;">Payment</div><span class="pay-badge ${o.payment==='qr'?'pay-qr':'pay-cash'}">${o.payment==='qr'?'QR':'Cash'}</span></div>
    </div>
    <div style="height:1px;background:var(--border);margin-bottom:1rem;"></div>
    <div style="font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--fog);margin-bottom:10px;">Items</div>
    ${o.items.map(i=>`<div style="padding:8px 0;border-bottom:1px solid rgba(200,48,10,0.06);"><div style="display:flex;justify-content:space-between;font-size:13px;"><span>${i.qty}× ${i.name} <span style="color:var(--fog);">(${i.size}${i.cheese?' + 🧀 Cheese':''})</span></span><span style="font-family:'Bebas Neue',sans-serif;font-size:1rem;color:var(--flame);">RM ${(i.price*i.qty).toFixed(2)}</span></div>${i.request?`<div style="font-size:11px;color:#D4850A;margin-top:3px;font-style:italic;">📝 ${i.request}</div>`:''}</div>`).join('')}
    <div style="margin-top:10px;display:flex;justify-content:space-between;font-family:'Syne',sans-serif;font-size:14px;font-weight:800;color:var(--char);"><span>Total</span><span style="font-family:'Bebas Neue',sans-serif;font-size:1.3rem;color:var(--flame);">RM ${o.total.toFixed(2)}</span></div>
    <div style="margin-top:1.25rem;">
      <label class="form-label" style="margin-bottom:8px;">Order Action</label>
      ${o.status === 'pending' ? `
        <div style="display:flex;gap:8px;">
          <button style="flex:1;background:#1D7A4F;border:none;padding:11px 16px;border-radius:6px;font-family:'Syne',sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:white;cursor:pointer;" onclick="updateStatus('${o.id}','approved');closeModal('orderDetailModal')">✓ Approve</button>
          <button style="flex:1;background:transparent;border:1.5px solid #B22;padding:11px 16px;border-radius:6px;font-family:'Syne',sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#B22;cursor:pointer;" onclick="updateStatus('${o.id}','rejected');closeModal('orderDetailModal')">✕ Reject</button>
        </div>` : `<div style="display:flex;align-items:center;gap:8px;"><span class="s-badge s-${o.status}">${o.status}</span><span style="font-size:12px;color:var(--fog);">— manage in Queue</span></div>`}
    </div>`;
  openModal('orderDetailModal');
}

function renderQueue() {
  const activeOrders = orders.filter(o=>['approved','preparing','ready'].includes(o.status));
  const grid = document.getElementById('queueGrid');
  if(!activeOrders.length) {
    grid.innerHTML = `<div class="col-12" style="text-align:center;padding:3rem;color:var(--fog);">No active orders in queue</div>`;
    return;
  }
  const colors = {approved:'#1D7A4F',preparing:'var(--flame)',ready:'#1A5FAD'};
  grid.innerHTML = activeOrders.map(o=>`
    <div class="col-md-4 col-sm-6">
      <div class="queue-card">
        <div class="queue-card-header">
          <div class="queue-order-id">${o.id}</div>
          <span class="s-badge s-${o.status}">${o.status}</span>
        </div>
        <div class="queue-customer">👤 ${o.name}</div>
        <div class="queue-items">${o.items.map(i=>`${i.qty}× ${i.name} (${i.size})`).join('<br>')}</div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:1.1rem;color:var(--flame);">RM ${o.total.toFixed(2)}</div>
        <div class="queue-footer">
          ${o.status==='approved' ? `<button class="btn-primary btn-sm" onclick="updateStatus('${o.id}','preparing');renderQueue()">Start Prep</button>` : ''}
          ${o.status==='preparing' ? `<button class="btn-primary btn-sm" onclick="updateStatus('${o.id}','ready');renderQueue()">Mark Ready</button>` : ''}
          ${o.status==='ready' ? `<button class="btn-primary btn-sm" onclick="updateStatus('${o.id}','completed');renderQueue()">Complete</button>` : ''}
          <button class="btn-danger btn-sm" onclick="updateStatus('${o.id}','rejected');renderQueue()">Reject</button>
        </div>
      </div>
    </div>`).join('');
}

function renderAdminMenu() {
  const el = document.getElementById('adminMenuList');
  if (!menuItems.length) { el.innerHTML=`<div style="text-align:center;padding:2rem;color:var(--fog);">No menu items</div>`; return; }
  el.innerHTML = menuItems.map(item=>`
    <div class="menu-admin-card">
      <div class="menu-admin-photo" onclick="openMenuModal(${item.id})" title="Click Edit to change photo" style="cursor:pointer;flex-shrink:0;width:52px;height:52px;border-radius:8px;background:var(--smoke);overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:1.6rem;border:1.5px solid var(--border);">
        ${item.image ? `<img src="${item.image}" style="width:100%;height:100%;object-fit:cover;">` : (CAT_EMOJI[item.category]||'🍔')}
      </div>
      <div class="menu-admin-info">
        <div class="menu-admin-name">${item.name}</div>
        <div class="menu-admin-cat">${item.category}</div>
        <div class="menu-admin-prices">N: RM${item.prices.Normal} · S: RM${item.prices.Special} · D: RM${item.prices.Double} · DS: RM${item.prices['Double Special']}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
        <select class="status-select" onchange="updateStockStatus(${item.id},this.value)">
          <option value="available" ${item.stock==='available'?'selected':''}>Available</option>
          <option value="low" ${item.stock==='low'?'selected':''}>Low</option>
          <option value="out" ${item.stock==='out'?'selected':''}>Out</option>
        </select>
        <button class="btn-ghost btn-sm" onclick="openMenuModal(${item.id})">Edit</button>
        <button class="btn-danger btn-sm" onclick="deleteMenuItem(${item.id})">Del</button>
      </div>
    </div>`).join('');
}

function updateStockStatus(id, stock) {
  const item = menuItems.find(i=>i.id===id);
  if(item) { item.stock=stock; saveState(); showToast('info','Stock Updated',item.name); }
}

function openMenuModal(id=null) {
  document.getElementById('menuModalTitle').textContent = id ? 'Edit Menu Item' : 'Add Menu Item';
  document.getElementById('mi-edit-id').value = id || '';
  // reset photo
  const prev = document.getElementById('mi-photo-preview');
  document.getElementById('mi-photo-data').value = '';
  document.getElementById('mi-photo-file').value = '';

  if (id) {
    const item = menuItems.find(i=>i.id===id);
    document.getElementById('mi-name').value     = item.name;
    document.getElementById('mi-cat').value      = item.category;
    document.getElementById('mi-stock').value    = item.stock;
    document.getElementById('mi-p-normal').value = item.prices.Normal;
    document.getElementById('mi-p-special').value= item.prices.Special;
    document.getElementById('mi-p-double').value = item.prices.Double;
    document.getElementById('mi-p-dblspecial').value=item.prices['Double Special'];
    if (item.image) {
      prev.innerHTML = `<img src="${item.image}" style="width:100%;height:100%;object-fit:cover;">`;
      document.getElementById('mi-photo-data').value = item.image;
    } else {
      prev.innerHTML = `<span id="mi-photo-emoji">${CAT_EMOJI[item.category]||'🍔'}</span>`;
    }
  } else {
    ['mi-name','mi-p-normal','mi-p-special','mi-p-double','mi-p-dblspecial'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('mi-cat').value   = 'Ayam';
    document.getElementById('mi-stock').value = 'available';
    prev.innerHTML = `<span id="mi-photo-emoji">🍔</span>`;
  }
  openModal('menuItemModal');
}

function handleAdminPhotoUpload(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  if (file.size > 2 * 1024 * 1024) { showToast('error','File Too Large','Please use an image under 2MB'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    const data = e.target.result;
    document.getElementById('mi-photo-data').value = data;
    document.getElementById('mi-photo-preview').innerHTML = `<img src="${data}" style="width:100%;height:100%;object-fit:cover;">`;
    showToast('success','Photo Uploaded','Image ready to save');
  };
  reader.readAsDataURL(file);
}

function clearAdminPhoto() {
  document.getElementById('mi-photo-data').value = '';
  document.getElementById('mi-photo-file').value = '';
  const cat = document.getElementById('mi-cat').value;
  document.getElementById('mi-photo-preview').innerHTML = `<span id="mi-photo-emoji">${CAT_EMOJI[cat]||'🍔'}</span>`;
}

function saveMenuItem() {
  const name   = document.getElementById('mi-name').value.trim();
  const cat    = document.getElementById('mi-cat').value;
  const stock  = document.getElementById('mi-stock').value;
  const pn     = parseFloat(document.getElementById('mi-p-normal').value);
  const ps     = parseFloat(document.getElementById('mi-p-special').value);
  const pd     = parseFloat(document.getElementById('mi-p-double').value);
  const pds    = parseFloat(document.getElementById('mi-p-dblspecial').value);
  const editId = parseInt(document.getElementById('mi-edit-id').value);
  const image  = document.getElementById('mi-photo-data').value || '';

  if (!name||isNaN(pn)||isNaN(ps)||isNaN(pd)||isNaN(pds)) { showToast('error','Missing Fields','Please fill all required fields'); return; }
  const prices = {Normal:pn,Special:ps,Double:pd,'Double Special':pds};

  if (editId) {
    const item = menuItems.find(i=>i.id===editId);
    if(item){item.name=name;item.category=cat;item.stock=stock;item.prices=prices;item.image=image;}
  } else {
    const newId = Math.max(...menuItems.map(i=>i.id),0)+1;
    menuItems.push({id:newId,name,category:cat,stock,prices,image});
  }
  saveState(); renderAdminMenu(); closeModal('menuItemModal');
  showToast('success', editId?'Item Updated':'Item Added', name);
}

function deleteMenuItem(id) {
  if(!confirm('Delete this menu item?')) return;
  menuItems = menuItems.filter(i=>i.id!==id);
  saveState(); renderAdminMenu();
  showToast('info','Item Deleted','Menu item removed');
}

function renderPromos() {
  const el = document.getElementById('promoList');
  if(!promoCodes.length) { el.innerHTML=`<div style="text-align:center;padding:2rem;color:var(--fog);">No promo codes created</div>`; return; }
  el.innerHTML = promoCodes.map(p=>`
    <div class="promo-card">
      <div style="flex:1;">
        <div class="promo-code">${p.code}</div>
        <div class="promo-detail">${p.type==='percent'?`${p.value}% off`:`RM ${p.value} off`}${p.min>0?` · Min RM ${p.min}`:''} · Expires ${p.expiry}</div>
      </div>
      <div style="display:flex;gap:6px;">
        <button class="btn-ghost btn-sm" onclick="editPromo(${p.id})">Edit</button>
        <button class="btn-danger btn-sm" onclick="deletePromo(${p.id})">Del</button>
      </div>
    </div>`).join('');
}

function openPromoModal(id=null) {
  document.querySelector('#promoModal .modal-title').textContent = id ? 'Edit Promo Code' : 'Create Promo Code';
  document.getElementById('promo-edit-id').value = id||'';
  if (id) {
    const p=promoCodes.find(p=>p.id===id);
    document.getElementById('promo-code').value  = p.code;
    document.getElementById('promo-type').value  = p.type;
    document.getElementById('promo-value').value = p.value;
    document.getElementById('promo-min').value   = p.min||0;
    document.getElementById('promo-expiry').value= p.expiry;
  } else {
    ['promo-code','promo-value'].forEach(i=>document.getElementById(i).value='');
    document.getElementById('promo-type').value  = 'percent';
    document.getElementById('promo-min').value   = '0';
    document.getElementById('promo-expiry').value= '';
  }
  openModal('promoModal');
}

function editPromo(id) { openPromoModal(id); }

function savePromo() {
  const code   = document.getElementById('promo-code').value.trim().toUpperCase();
  const type   = document.getElementById('promo-type').value;
  const value  = parseFloat(document.getElementById('promo-value').value);
  const min    = parseFloat(document.getElementById('promo-min').value)||0;
  const expiry = document.getElementById('promo-expiry').value;
  const editId = parseInt(document.getElementById('promo-edit-id').value);

  if(!code||isNaN(value)||!expiry){showToast('error','Required','Fill all fields');return;}

  if(editId){
    const p=promoCodes.find(p=>p.id===editId);
    if(p){p.code=code;p.type=type;p.value=value;p.min=min;p.expiry=expiry;}
  } else {
    const newId=Math.max(...promoCodes.map(p=>p.id),0)+1;
    promoCodes.push({id:newId,code,type,value,min,expiry});
  }
  saveState();renderPromos();closeModal('promoModal');
  showToast('success',editId?'Promo Updated':'Promo Created',code);
}

function deletePromo(id) {
  if(!confirm('Delete this promo code?')) return;
  promoCodes=promoCodes.filter(p=>p.id!==id);
  saveState();renderPromos();
  showToast('info','Promo Deleted','');
}

function renderAnalytics() {
  const itemCounts={};
  orders.forEach(o=>o.items.forEach(i=>{
    const key=`${i.name} (${i.size})`;
    itemCounts[key]=(itemCounts[key]||0)+i.qty;
  }));
  const sorted=Object.entries(itemCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const maxC=sorted[0]?.[1]||1;
  document.getElementById('topItemsList').innerHTML=sorted.length
    ?sorted.map(([name,count])=>`
      <div style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px;">
          <span style="color:var(--char);font-weight:500;">${name}</span>
          <span style="color:var(--flame);font-family:'Syne',sans-serif;font-weight:700;">${count} sold</span>
        </div>
        <div style="background:var(--smoke);border-radius:4px;height:5px;">
          <div style="background:var(--flame);width:${count/maxC*100}%;height:100%;border-radius:4px;transition:width 0.5s;"></div>
        </div>
      </div>`).join('')
    :`<div style="color:var(--fog);font-size:13px;">No orders yet</div>`;

  const qrCount=orders.filter(o=>o.payment==='qr').length;
  const cashCount=orders.filter(o=>o.payment==='cash').length;
  const tot=qrCount+cashCount||1;
  document.getElementById('paymentSplit').innerHTML=`
    <div style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px;">
        <span style="color:#1D7A4F;font-weight:500;">QR Payment</span>
        <span style="color:#1D7A4F;font-family:'Syne',sans-serif;font-weight:700;">${qrCount} (${Math.round(qrCount/tot*100)}%)</span>
      </div>
      <div style="background:var(--smoke);border-radius:4px;height:5px;">
        <div style="background:#1D7A4F;width:${qrCount/tot*100}%;height:100%;border-radius:4px;"></div>
      </div>
    </div>
    <div>
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px;">
        <span style="color:#7A5000;font-weight:500;">Cash</span>
        <span style="color:#7A5000;font-family:'Syne',sans-serif;font-weight:700;">${cashCount} (${Math.round(cashCount/tot*100)}%)</span>
      </div>
      <div style="background:var(--smoke);border-radius:4px;height:5px;">
        <div style="background:#D4850A;width:${cashCount/tot*100}%;height:100%;border-radius:4px;"></div>
      </div>
    </div>`;

  const statuses=['pending','approved','preparing','ready','completed','rejected'];
  const sColors=['#976200','#1D7A4F','var(--flame)','#1A5FAD','var(--fog)','#B22'];
  const sCounts=statuses.map(s=>orders.filter(o=>o.status===s).length);
  const maxS=Math.max(...sCounts,1);
  document.getElementById('statusBreakdown').innerHTML=statuses.map((s,i)=>`
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <div style="width:80px;font-size:11px;color:var(--fog);text-transform:capitalize;font-weight:500;flex-shrink:0;">${s}</div>
      <div style="flex:1;background:var(--smoke);border-radius:4px;height:6px;">
        <div style="background:${sColors[i]};width:${sCounts[i]/maxS*100}%;height:100%;border-radius:4px;transition:width 0.5s;"></div>
      </div>
      <div style="width:24px;text-align:right;font-size:12px;color:${sColors[i]};font-weight:700;">${sCounts[i]}</div>
    </div>`).join('');
}

// ═══════════════════════════════════════
//  MODALS & TOASTS
// ═══════════════════════════════════════
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('.modal-overlay').forEach(m=>{
  m.addEventListener('click',function(e){ if(e.target===this) this.classList.remove('open'); });
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape') document.querySelectorAll('.modal-overlay.open').forEach(m=>m.classList.remove('open'));
});

function showToast(type, title, msg) {
  const c    = document.getElementById('toastContainer');
  const toast= document.createElement('div');
  toast.className=`toast ${type}`;
  toast.innerHTML=`<div class="toast-title">${title}</div>${msg?`<div class="toast-msg">${msg}</div>`:''}`;
  c.appendChild(toast);
  setTimeout(()=>{ toast.style.opacity='0'; toast.style.transform='translateX(20px)'; toast.style.transition='all 0.3s ease'; setTimeout(()=>toast.remove(),300); },2500);
}

// ═══════════════════════════════════════
//  DRAWER (mobile category menu)
// ═══════════════════════════════════════
function openDrawer() {
  document.getElementById('mobDrawer').classList.add('open');
  document.getElementById('mobDrawerOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  document.getElementById('mobDrawer').classList.remove('open');
  document.getElementById('mobDrawerOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function drawerFilterCat(cat, btn) {
  // highlight in drawer
  document.querySelectorAll('.mob-drawer-cat').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // sync desktop sidebar
  document.querySelectorAll('.cat-btn').forEach(b => {
    const match = cat === 'all' ? b.textContent.trim() === 'All Items' : b.textContent.trim() === cat;
    b.classList.toggle('active', match);
  });
  renderMenu(cat);
  closeDrawer();
}

// ═══════════════════════════════════════
//  ADMIN DRAWER
// ═══════════════════════════════════════
function openAdminDrawer() {
  document.getElementById('adminMobDrawer').classList.add('open');
  document.getElementById('adminMobOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeAdminDrawer() {
  document.getElementById('adminMobDrawer').classList.remove('open');
  document.getElementById('adminMobOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ═══════════════════════════════════════
//  MOBILE NAV
// ═══════════════════════════════════════
function mobileNavMenu() {
  const sheet = document.getElementById('mobileCartSheet');
  const inner = document.getElementById('cartSheetInner');
  if (inner) { inner.style.transform = 'translateY(100%)'; inner.style.transition = 'transform 0.3s ease'; }
  setTimeout(() => { sheet.style.display = 'none'; if(inner) inner.style.transform = ''; }, 280);
  document.querySelectorAll('.mob-nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('mobnav-menu').classList.add('active');
  document.body.style.overflow = '';
}
function mobileNavCart() {
  const sheet = document.getElementById('mobileCartSheet');
  const inner = document.getElementById('cartSheetInner');
  sheet.style.display = 'block';
  if (inner) {
    inner.style.transition = 'none';
    inner.style.transform = 'translateY(100%)';
    requestAnimationFrame(() => {
      inner.style.transition = 'transform 0.32s cubic-bezier(0.25,0.46,0.45,0.94)';
      inner.style.transform = 'translateY(0)';
    });
  }
  document.querySelectorAll('.mob-nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('mobnav-cart').classList.add('active');
  document.body.style.overflow = 'hidden';
  initCartSwipe();
}
function closeMobileCart(e) {
  if (e && e.target !== document.getElementById('mobileCartSheet')) return;
  mobileNavMenu();
}
function initCartSwipe() {
  const handle = document.getElementById('cartSheetHandle');
  const inner  = document.getElementById('cartSheetInner');
  const sheet  = document.getElementById('mobileCartSheet');
  if (!handle || !inner) return;
  let startY = 0, curY = 0, dragging = false;

  function onStart(e) {
    startY = (e.touches ? e.touches[0].clientY : e.clientY);
    curY = startY; dragging = true;
    inner.style.transition = 'none';
  }
  function onMove(e) {
    if (!dragging) return;
    curY = (e.touches ? e.touches[0].clientY : e.clientY);
    const delta = Math.max(0, curY - startY);
    inner.style.transform = `translateY(${delta}px)`;
    const alpha = Math.max(0, 0.6 - delta / 400);
    sheet.style.background = `rgba(26,10,0,${alpha.toFixed(2)})`;
    if (e.cancelable) e.preventDefault();
  }
  function onEnd() {
    if (!dragging) return; dragging = false;
    const delta = curY - startY;
    if (delta > 100) { mobileNavMenu(); }
    else {
      inner.style.transition = 'transform 0.25s ease';
      inner.style.transform = 'translateY(0)';
      sheet.style.background = 'rgba(26,10,0,0.6)';
    }
  }
  // Remove old listeners, add fresh
  const newHandle = handle.cloneNode(true);
  handle.parentNode.replaceChild(newHandle, handle);
  newHandle.addEventListener('touchstart', onStart, {passive:true});
  newHandle.addEventListener('touchmove',  onMove,  {passive:false});
  newHandle.addEventListener('touchend',   onEnd,   {passive:true});
  newHandle.addEventListener('mousedown',  onStart);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);
}
function applyPromoMob() {
  const code = document.getElementById('promoInputMob').value.trim().toUpperCase();
  const now  = new Date().toISOString().split('T')[0];
  const promo = promoCodes.find(p => p.code === code && p.expiry >= now);
  if (!promo) { showToast('error','Invalid Code','Promo code not found or expired'); return; }
  appliedPromo = promo;
  document.getElementById('promoInput').value = code;
  updateCartDisplay();
  showToast('success','Promo Applied', promo.type==='percent' ? `${promo.value}% off` : `RM ${promo.value} off`);
}

// ═══════════════════════════════════════
//  ADMIN: CREATE ORDER (same as customer)
// ═══════════════════════════════════════
let aoCart = [];
let aoSelectedSizes = {};
let aoItemCheese = {};
let aoCurrentCat = 'all';
let aoAppliedPromo = null;

function renderAdminOrder() {
  const search = (document.getElementById('ao-search')?.value||'').toLowerCase();
  const grid = document.getElementById('adminOrderMenuGrid');
  if (!grid) return;
  const filtered = menuItems.filter(i => {
    const catOk = aoCurrentCat === 'all' || i.category === aoCurrentCat;
    const searchOk = !search || i.name.toLowerCase().includes(search) || i.category.toLowerCase().includes(search);
    return catOk && searchOk;
  });
  if (!filtered.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--fog);">No items found</div>`;
    return;
  }
  grid.innerHTML = filtered.map(item => {
    const sel = aoSelectedSizes[item.id] || 'Normal';
    const isOut = item.stock === 'out';
    const cheese = aoItemCheese[item.id] || false;
    const emoji = CAT_EMOJI[item.category] || '🍔';
    return `
    <div style="background:white;border:1px solid var(--border);border-radius:12px;overflow:hidden;${isOut?'opacity:0.5;':''}">
      <div style="height:90px;background:linear-gradient(135deg,var(--smoke),#EDD9BE);display:flex;align-items:center;justify-content:center;position:relative;font-size:2.2rem;overflow:hidden;">
        ${item.image?`<img src="${item.image}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;">`:''}
        <span style="position:relative;z-index:1;">${item.image?'':emoji}</span>
      </div>
      <div style="padding:10px 12px 12px;">
        <div style="font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:var(--char);margin-bottom:8px;">${item.name}</div>
        <select class="form-input select-field" style="padding:6px 8px;font-size:12px;margin-bottom:6px;" onchange="aoSelectedSizes[${item.id}]=this.value">
          ${SIZES.map(s=>`<option value="${s}" ${sel===s?'selected':''}>${s} — RM ${item.prices[s].toFixed(2)}</option>`).join('')}
        </select>
        <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--ash);margin-bottom:8px;cursor:pointer;">
          <input type="checkbox" ${cheese?'checked':''} onchange="aoItemCheese[${item.id}]=this.checked" style="accent-color:var(--gold);"> 🧀 Add Cheese +RM 0.50
        </label>
        <textarea style="width:100%;border:1.5px solid var(--border);border-radius:6px;padding:6px 8px;font-size:11px;resize:none;outline:none;" id="ao-req-${item.id}" placeholder="Special request..." rows="1"></textarea>
        <button style="width:100%;margin-top:7px;background:${isOut?'rgba(140,112,96,0.18)':'var(--flame)'};color:${isOut?'var(--fog)':'white'};border:none;border-radius:6px;padding:8px;font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:${isOut?'not-allowed':'pointer'};" ${isOut?'disabled':''} onclick="aoAddToCart(${item.id})">
          ${isOut?'Out of Stock':'+ Add'}
        </button>
      </div>
    </div>`;
  }).join('');
}

function aoFilterCat(cat, btn) {
  aoCurrentCat = cat;
  document.querySelectorAll('.ao-cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderAdminOrder();
}

function aoAddToCart(itemId) {
  const item = menuItems.find(i=>i.id===itemId);
  if (!item || item.stock==='out') return;
  const size = aoSelectedSizes[itemId] || 'Normal';
  const cheese = aoItemCheese[itemId] || false;
  const reqEl = document.getElementById(`ao-req-${itemId}`);
  const request = reqEl ? reqEl.value.trim() : '';
  const price = item.prices[size] + (cheese ? 0.5 : 0);
  const key = `${itemId}-${size}-${cheese?'cheese':'no'}-${Date.now()}`;
  aoCart.push({key, itemId, name:item.name, size, price, qty:1, category:item.category, cheese, request});
  aoUpdateCart();
  showToast('success','Added',''+item.name);
}

function aoChangeQty(key, delta) {
  const idx = aoCart.findIndex(c=>c.key===key);
  if (idx<0) return;
  aoCart[idx].qty += delta;
  if (aoCart[idx].qty<=0) aoCart.splice(idx,1);
  aoUpdateCart();
}

function aoRemove(key) {
  aoCart = aoCart.filter(c=>c.key!==key);
  aoUpdateCart();
}

function aoClearCart() {
  aoCart = []; aoAppliedPromo = null;
  document.getElementById('ao-promo').value='';
  aoUpdateCart();
}

function aoApplyPromo() {
  const code = document.getElementById('ao-promo').value.trim().toUpperCase();
  const now  = new Date().toISOString().split('T')[0];
  const promo = promoCodes.find(p=>p.code===code && p.expiry>=now);
  if (!promo) { showToast('error','Invalid Code','Not found or expired'); return; }
  aoAppliedPromo = promo;
  aoUpdateCart();
  showToast('success','Promo Applied', promo.type==='percent'?`${promo.value}% off`:`RM ${promo.value} off`);
}

function aoUpdateCart() {
  const subtotal = aoCart.reduce((s,i)=>s+i.price*i.qty, 0);
  let discount = 0;
  if (aoAppliedPromo) {
    const p=aoAppliedPromo;
    if (subtotal>=(p.min||0)) discount = p.type==='percent' ? subtotal*(p.value/100) : Math.min(p.value,subtotal);
  }
  const total = Math.max(0, subtotal-discount);
  document.getElementById('aoSubtotal').textContent = `RM ${subtotal.toFixed(2)}`;
  document.getElementById('aoTotal').textContent    = `RM ${total.toFixed(2)}`;
  const dr = document.getElementById('aoDiscountRow');
  if (discount>0){ dr.style.display='flex'; document.getElementById('aoDiscountAmt').textContent=`-RM ${discount.toFixed(2)}`; }
  else dr.style.display='none';

  const el = document.getElementById('aoCartItems');
  if (!aoCart.length) {
    el.innerHTML = `<div style="text-align:center;padding:1.5rem;color:var(--fog);font-size:13px;">No items yet</div>`;
    return;
  }
  el.innerHTML = aoCart.map(item=>`
    <div style="display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid rgba(200,48,10,0.08);">
      <div style="font-size:1.3rem;width:32px;height:32px;background:var(--smoke);border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${CAT_EMOJI[item.category]||'🍔'}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:var(--char);">${item.name}</div>
        <div style="font-size:11px;color:var(--fog);">${item.size}${item.cheese?' · 🧀':''} · RM ${item.price.toFixed(2)}</div>
        ${item.request?`<div style="font-size:10px;color:var(--gold);font-style:italic;">📝 ${item.request}</div>`:''}
        <div style="display:flex;align-items:center;gap:6px;margin-top:4px;">
          <button class="qty-btn" onclick="aoChangeQty('${item.key}',-1)">−</button>
          <span class="qty-val" style="font-size:12px;">${item.qty}</span>
          <button class="qty-btn" onclick="aoChangeQty('${item.key}',1)">+</button>
          <button class="remove-btn" onclick="aoRemove('${item.key}')">✕</button>
        </div>
      </div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:0.95rem;color:var(--flame);flex-shrink:0;">RM ${(item.price*item.qty).toFixed(2)}</div>
    </div>`).join('');
}

function aoPlaceOrder() {
  const name  = document.getElementById('ao-name').value.trim();
  const phone = document.getElementById('ao-phone').value.trim();
  const payment = document.getElementById('ao-payment').value;
  if (!name||!phone) { showToast('error','Missing Info','Enter customer name and phone'); return; }
  if (!aoCart.length) { showToast('error','Empty Cart','Add items first'); return; }
  const subtotal = aoCart.reduce((s,i)=>s+i.price*i.qty,0);
  let discount=0;
  if(aoAppliedPromo){const p=aoAppliedPromo;if(subtotal>=(p.min||0))discount=p.type==='percent'?subtotal*(p.value/100):Math.min(p.value,subtotal);}
  const total = Math.max(0,subtotal-discount);
  orderIdCounter++;
  const orderId=`ORD-${orderIdCounter}`;
  const order={
    id:orderId, name, phone, contact:'Counter', payment,
    items:[...aoCart], subtotal, discount, total,
    status:'approved', // admin orders go straight to approved
    time:new Date().toLocaleString('en-MY',{hour:'2-digit',minute:'2-digit',hour12:true}),
    source:'admin'
  };
  orders.unshift(order);
  saveState();
  renderAdmin();
  showToast('success','Order Created!', orderId+' — Status: Approved');
  // reset
  aoCart=[]; aoAppliedPromo=null; aoSelectedSizes={}; aoItemCheese={};
  document.getElementById('ao-name').value='';
  document.getElementById('ao-phone').value='';
  document.getElementById('ao-promo').value='';
  aoUpdateCart();
  renderAdminOrder();
}

// INIT
showView('home');
currentFilter='all';
