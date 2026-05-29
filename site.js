const CART_KEY = 'wr3d-cart';

const products = [
  {
    id: 'miniaturas',
    name: 'Miniaturas de jogos',
    description: 'Peças detalhadas e resistentes para colecionadores e circuito de RPG.',
    price: 120,
  },
  {
    id: 'tecnicas',
    name: 'Peças técnicas',
    description: 'Componentes funcionais com acabamento limpo para uso real.',
    price: 180,
  },
  {
    id: 'acessorios',
    name: 'Suportes e acessórios',
    description: 'Organizadores, ganchos e itens sob medida para uso doméstico ou industrial.',
    price: 95,
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

function findProduct(id) {
  return products.find((product) => product.id === id);
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

  if (!cartContainer || !cartEmpty || !orderTotal) {
    return;
  }

  if (!cart.length) {
    cartEmpty.style.display = 'block';
    cartContainer.innerHTML = '';
    orderTotal.textContent = 'R$ 0,00';
    return;
  }

  cartEmpty.style.display = 'none';

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

function updateHeaderAuth() {
  const currentUser = getCurrentUser();
  const nav = document.querySelector('.main-nav');
  if (!nav) {
    return;
  }

  const existingLogout = document.getElementById('logout-link');
  if (currentUser) {
    const currentNavLink = nav.querySelector('a[href="login.html"]');
    if (currentNavLink) {
      currentNavLink.textContent = 'Minha Conta';
      currentNavLink.href = 'login.html';
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
  } else if (existingLogout) {
    existingLogout.remove();
  }
}

function initializeSite() {
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
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', submitWhatsAppOrder);
    }
  }
}

window.addEventListener('DOMContentLoaded', initializeSite);
