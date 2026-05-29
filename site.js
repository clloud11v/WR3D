const CART_KEY = 'wr3d-cart';
const PRODUCTS_KEY = 'wr3d-products';
const ORDERS_KEY = 'wr3d-orders';

const DEFAULT_PRODUCTS = [
  {
    id: 'miniaturas',
    name: 'Miniaturas de jogos',
    description: 'Peças detalhadas e resistentes para colecionadores e circuito de RPG.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80',
    gramatura: '50g',
    productionTime: '18h',
    complexity: 'Média',
  },
  {
    id: 'tecnicas',
    name: 'Peças técnicas',
    description: 'Componentes funcionais com acabamento limpo para uso real.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1581091870620-3c9ba9ba1d6b?auto=format&fit=crop&w=800&q=80',
    gramatura: '80g',
    productionTime: '24h',
    complexity: 'Alta',
  },
  {
    id: 'acessorios',
    name: 'Suportes e acessórios',
    description: 'Organizadores, ganchos e itens sob medida para uso doméstico ou industrial.',
    price: 95,
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
    gramatura: '40g',
    productionTime: '10h',
    complexity: 'Baixa',
  },
];

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function clearCart() {
  setCart([]);
}

function getProducts() {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed) && parsed.length) {
      return parsed;
    }
  } catch (error) {
    console.warn('Falha ao ler produtos de localStorage:', error);
  }
  return [...DEFAULT_PRODUCTS];
}

function setProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch {
    return [];
  }
}

function setOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  setOrders(orders);
}

function findProduct(id) {
  return getProducts().find((product) => product.id === id);
}

function addToCart(productId) {
  const product = findProduct(productId);
  if (!product) {
    return;
  }

  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  setCart(cart);
  updateCartIndicator();
  showTemporaryMessage('Produto adicionado ao carrinho.', 'success');
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  setCart(cart);
  renderOrderPage();
  updateCartIndicator();
}

function updateCartIndicator() {
  const cartIndicator = document.querySelector('.cart-indicator');
  if (!cartIndicator) {
    return;
  }
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartIndicator.textContent = count > 0 ? `Carrinho (${count})` : 'Carrinho';
}

function showTemporaryMessage(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast-message ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => {
    toast.classList.remove('visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 2200);
}

function renderOrderPage() {
  const cart = getCart();
  const cartContainer = document.getElementById('cart-items');
  const cartEmpty = document.getElementById('cart-empty');
  const orderTotal = document.getElementById('order-total');
  const paypalSection = document.querySelector('.paypal-section');

  if (!cartContainer || !cartEmpty || !orderTotal) {
    return;
  }

  if (!cart.length) {
    cartEmpty.style.display = 'block';
    cartContainer.innerHTML = '';
    orderTotal.textContent = 'R$ 0,00';
    if (paypalSection) {
      paypalSection.style.display = 'none';
    }
    return;
  }

  cartEmpty.style.display = 'none';
  if (paypalSection) {
    paypalSection.style.display = 'block';
  }

  cartContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <div>
            <strong>${item.name}</strong>
            <p>${item.description}</p>
          </div>
          <div class="cart-item-actions">
            <span>${item.quantity}x</span>
            <button type="button" class="button secondary remove-item" data-product="${item.id}">Remover</button>
          </div>
        </div>
      `
    )
    .join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  orderTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

  cartContainer.querySelectorAll('.remove-item').forEach((button) => {
    button.addEventListener('click', () => removeFromCart(button.dataset.product));
  });
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderPayPalButtons() {
  const container = document.getElementById('paypal-button-container');
  if (!container) {
    return;
  }

  if (!window.paypal) {
    setTimeout(renderPayPalButtons, 200);
    return;
  }

  if (container.children.length) {
    return;
  }

  window.paypal.Buttons({
    style: {
      layout: 'vertical',
      color: 'gold',
      shape: 'rect',
      label: 'paypal',
    },
    onInit(data, actions) {
      const cart = getCart();
      if (!cart.length) {
        actions.disable();
      }
      return actions;
    },
    onClick(data, actions) {
      const cart = getCart();
      if (!cart.length) {
        showTemporaryMessage('Adicione produtos ao carrinho antes de pagar.', 'error');
        return actions.reject();
      }
      const name = document.getElementById('checkout-name').value.trim();
      const email = document.getElementById('checkout-email').value.trim();
      if (!name || !email) {
        showTemporaryMessage('Preencha nome e e-mail antes de pagar.', 'error');
        return actions.reject();
      }
      return actions.resolve();
    },
    createOrder(data, actions) {
      const total = getCartTotal();
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              currency_code: 'BRL',
              value: total.toFixed(2),
            },
            description: 'Pedido WR3D Impressão 3D',
          },
        ],
        application_context: {
          shipping_preference: 'NO_SHIPPING',
        },
      });
    },
    onApprove(data, actions) {
      return actions.order.capture().then((details) => {
        const payerName = details.payer?.name?.given_name || 'Cliente';
        const email = document.getElementById('checkout-email').value.trim();
        const cart = getCart();
        const total = getCartTotal();

        saveOrder({
          id: `order-${Date.now()}`,
          createdAt: new Date().toISOString(),
          method: 'PayPal',
          status: 'Pago',
          buyerName: payerName,
          buyerEmail: email,
          total,
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        });

        showTemporaryMessage(`Pagamento confirmado. Obrigado, ${payerName}!`, 'success');
        clearCart();
        renderOrderPage();
      });
    },
    onError(err) {
      console.error('PayPal checkout error:', err);
      showTemporaryMessage('Não foi possível processar o pagamento PayPal. Tente novamente.', 'error');
    },
  }).render('#paypal-button-container');
}

function renderProductCatalog() {
  const productGrid = document.getElementById('product-grid');
  if (!productGrid) {
    return;
  }

  const products = getProducts();
  if (!products.length) {
    productGrid.innerHTML = '<p>Nenhum produto disponível no momento.</p>';
    return;
  }

  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="card">
          <img src="${product.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}" alt="${product.name}" loading="lazy">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="meta">Gramatura ${product.gramatura || '-'} • Complexidade ${product.complexity || '-'} • ${product.productionTime || '-'} </div>
          <div class="meta price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
          <div class="card-actions">
            <a class="button secondary" href="https://wa.me/5561996232331?text=Tenho%20interesse%20no%20produto%20${encodeURIComponent(product.name)}" target="_blank" rel="noreferrer">Consultar</a>
            <a class="button primary add-to-cart" href="order.html?add=${product.id}" data-product="${product.id}">Adicionar ao pedido</a>
          </div>
        </article>
      `
    )
    .join('');

  productGrid.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', (event) => {
      if (button.dataset.product) {
        event.preventDefault();
        addToCart(button.dataset.product);
      }
    });
  });
}

function buildWhatsAppOrderMessage() {
  const cart = getCart();
  const name = document.getElementById('checkout-name').value.trim();
  const email = document.getElementById('checkout-email').value.trim();
  const details = document.getElementById('checkout-notes').value.trim();

  if (!name || !email) {
    showTemporaryMessage('Preencha nome e e-mail para finalizar o pedido.', 'error');
    return null;
  }

  const lines = [
    'Olá WR 3D Prints, quero fazer um pedido:',
    '',
    ...cart.map((item) => `- ${item.name} x${item.quantity}`),
    '',
    `Total estimado: R$ ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2).replace('.', ',')}`,
    '',
    `Nome: ${name}`,
    `E-mail: ${email}`,
  ];

  if (details) {
    lines.push('', `Observações: ${details}`);
  }

  return encodeURIComponent(lines.join('\n'));
}

function submitWhatsAppOrder(event) {
  event.preventDefault();
  const cart = getCart();
  if (!cart.length) {
    showTemporaryMessage('Adicione pelo menos um produto ao carrinho antes de enviar o pedido.', 'error');
    return;
  }

  const name = document.getElementById('checkout-name').value.trim();
  const email = document.getElementById('checkout-email').value.trim();
  const details = document.getElementById('checkout-notes').value.trim();
  const total = getCartTotal();

  saveOrder({
    id: `order-${Date.now()}`,
    createdAt: new Date().toISOString(),
    method: 'WhatsApp',
    status: 'Solicitado',
    buyerName: name,
    buyerEmail: email,
    notes: details,
    total,
    items: cart.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
  });

  const message = buildWhatsAppOrderMessage();
  if (!message) {
    return;
  }

  window.location.href = `https://wa.me/5561996232331?text=${message}`;
}

function addItemFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('add');
  if (!productId) {
    return;
  }

  addToCart(productId);
  params.delete('add');
  window.history.replaceState(null, '', `${window.location.pathname}`);
}

function renderOrdersPage() {
  const ordersContainer = document.getElementById('orders-list');
  if (!ordersContainer) {
    return;
  }

  const currentUser = getCurrentUser();
  let orders = getOrders();

  if (!currentUser?.admin) {
    orders = orders.filter((order) => order.buyerEmail?.toLowerCase() === currentUser?.email?.toLowerCase());
  }

  if (!orders.length) {
    ordersContainer.innerHTML = `
      <div class="cart-empty">
        <p>Nenhum pedido encontrado.</p>
        <a class="button primary" href="produtos.html">Fazer um pedido</a>
      </div>
    `;
    return;
  }

  ordersContainer.innerHTML = orders
    .map((order) => `
      <article class="card order-card">
        <div class="order-header">
          <strong>Pedido ${order.id}</strong>
          <span>${new Date(order.createdAt).toLocaleString('pt-BR')}</span>
        </div>
        <div class="meta">${order.method} • ${order.status} • R$ ${order.total.toFixed(2).replace('.', ',')}</div>
        <div class="order-buyer">${order.buyerName} • ${order.buyerEmail}</div>
        <ul class="order-items">
          ${order.items
            .map((item) => `<li>${item.name} x${item.quantity} — R$ ${item.price.toFixed(2).replace('.', ',')}</li>`)
            .join('')}
        </ul>
        ${order.notes ? `<p><em>Observações:</em> ${order.notes}</p>` : ''}
      </article>
    `)
    .join('');
}

function updateHeaderAuth() {
  const currentUser = getCurrentUser();
  const nav = document.querySelector('.main-nav');
  if (!nav) {
    return;
  }

  const existingLogout = document.getElementById('logout-link');
  const existingAdmin = document.getElementById('admin-link');
  const loginLink = nav.querySelector('a[href="login.html"]');

  if (currentUser) {
    if (loginLink) {
      loginLink.textContent = 'Minha Conta';
      loginLink.href = 'login.html';
    }

    if (!existingLogout) {
      const logoutLink = document.createElement('a');
      logoutLink.href = '#';
      logoutLink.id = 'logout-link';
      logoutLink.textContent = 'Sair';
      logoutLink.addEventListener('click', (event) => {
        event.preventDefault();
        logoutUser();
      });
      nav.appendChild(logoutLink);
    }

    if (currentUser.admin && !existingAdmin) {
      const adminLink = document.createElement('a');
      adminLink.id = 'admin-link';
      adminLink.href = 'admin.html';
      adminLink.textContent = 'Admin';
      nav.appendChild(adminLink);
    } else if (!currentUser.admin && existingAdmin) {
      existingAdmin.remove();
    }
  } else {
    if (loginLink) {
      loginLink.textContent = 'Login';
      loginLink.href = 'login.html';
    }
    if (existingLogout) {
      existingLogout.remove();
    }
    if (existingAdmin) {
      existingAdmin.remove();
    }
  }
}

function initializeSite() {
  renderProductCatalog();
  updateCartIndicator();
  updateHeaderAuth();

  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', (event) => {
      if (button.dataset.product) {
        event.preventDefault();
        addToCart(button.dataset.product);
      }
    });
  });

  if (window.location.pathname.endsWith('order.html')) {
    addItemFromUrl();
    renderOrderPage();
    renderPayPalButtons();
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', submitWhatsAppOrder);
    }
  }

  if (window.location.pathname.endsWith('pedidos.html')) {
    renderOrdersPage();
  }
}

window.addEventListener('DOMContentLoaded', initializeSite);
