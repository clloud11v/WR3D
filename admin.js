let editingProductId = null;

function isAdminUser() {
  const currentUser = getCurrentUser();
  return currentUser && currentUser.admin;
}

function redirectToLogin() {
  window.location.href = 'login.html';
}

function renderAdminProducts() {
  const productList = document.getElementById('admin-product-list');
  if (!productList) {
    return;
  }

  const products = getProducts();
  if (!products.length) {
    productList.innerHTML = '<p>Nenhum produto cadastrado no momento.</p>';
    return;
  }

  productList.innerHTML = products
    .map(
      (product) => `
        <article class="card admin-card">
          <img src="${product.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}" alt="${product.name}" loading="lazy">
          <div class="admin-card-content">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="meta">R$ ${product.price.toFixed(2).replace('.', ',')} • ${product.gramatura || '-'} • ${product.complexity || '-'} • ${product.productionTime || '-'}</div>
            <div class="card-actions admin-actions">
              <button type="button" class="button secondary edit-product" data-product="${product.id}">Editar</button>
              <button type="button" class="button secondary delete-product" data-product="${product.id}">Excluir</button>
            </div>
          </div>
        </article>
      `
    )
    .join('');

  productList.querySelectorAll('.edit-product').forEach((button) => {
    button.addEventListener('click', () => startEditProduct(button.dataset.product));
  });

  productList.querySelectorAll('.delete-product').forEach((button) => {
    button.addEventListener('click', () => removeAdminProduct(button.dataset.product));
  });
}

function removeAdminProduct(productId) {
  const products = getProducts().filter((product) => product.id !== productId);
  setProducts(products);
  renderAdminProducts();
  showTemporaryMessage('Produto removido do catálogo.', 'success');
}

function startEditProduct(productId) {
  const product = getProducts().find((item) => item.id === productId);
  if (!product) {
    return;
  }

  editingProductId = productId;
  document.getElementById('admin-title').textContent = 'Editar produto';
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-description').value = product.description;
  document.getElementById('product-price').value = product.price.toFixed(2).replace('.', ',');
  document.getElementById('product-gramatura').value = product.gramatura || '';
  document.getElementById('product-complexity').value = product.complexity || '';
  document.getElementById('product-time').value = product.productionTime || '';
  document.getElementById('product-image').value = product.image || '';

  const submitButton = document.getElementById('admin-submit-button');
  const cancelButton = document.getElementById('admin-cancel-button');
  if (submitButton) {
    submitButton.textContent = 'Salvar alterações';
  }
  if (cancelButton) {
    cancelButton.style.display = 'inline-flex';
  }
}

function resetAdminForm() {
  editingProductId = null;
  const adminForm = document.getElementById('admin-form');
  if (adminForm) {
    adminForm.reset();
  }

  const title = document.getElementById('admin-title');
  if (title) {
    title.textContent = 'Adicionar produto';
  }

  const submitButton = document.getElementById('admin-submit-button');
  const cancelButton = document.getElementById('admin-cancel-button');
  if (submitButton) {
    submitButton.textContent = 'Salvar produto';
  }
  if (cancelButton) {
    cancelButton.style.display = 'none';
  }
}

function createAdminProduct(event) {
  event.preventDefault();
  const name = document.getElementById('product-name').value.trim();
  const description = document.getElementById('product-description').value.trim();
  const priceValue = parseFloat(document.getElementById('product-price').value.replace(',', '.'));
  const gramatura = document.getElementById('product-gramatura').value.trim();
  const complexity = document.getElementById('product-complexity').value.trim();
  const productionTime = document.getElementById('product-time').value.trim();
  const image = document.getElementById('product-image').value.trim();

  if (!name || !description || Number.isNaN(priceValue) || priceValue <= 0) {
    showTemporaryMessage('Preencha nome, descrição e preço válidos.', 'error');
    return;
  }

  const products = getProducts();

  if (editingProductId) {
    const existingNameDuplicate = products.find(
      (product) => product.name.toLowerCase() === name.toLowerCase() && product.id !== editingProductId
    );

    if (existingNameDuplicate) {
      showTemporaryMessage('Já existe produto com esse nome. Use um título diferente.', 'error');
      return;
    }

    const productIndex = products.findIndex((product) => product.id === editingProductId);
    if (productIndex === -1) {
      showTemporaryMessage('Produto não encontrado para edição.', 'error');
      return;
    }

    products[productIndex] = {
      ...products[productIndex],
      name,
      description,
      price: priceValue,
      gramatura: gramatura || 'N/A',
      complexity: complexity || 'N/A',
      productionTime: productionTime || 'A definir',
      image: image || products[productIndex].image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    };

    setProducts(products);
    renderAdminProducts();
    resetAdminForm();
    showTemporaryMessage('Produto atualizado com sucesso.', 'success');
    return;
  }

  const id = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^\p{L}0-9]+/gu, '-')
    .normalize('NFC')
    .replace(/^-|-$/g, '');
  const existing = products.find((product) => product.id === id);

  if (existing) {
    showTemporaryMessage('Já existe um produto com esse nome. Use outro título.', 'error');
    return;
  }

  const newProduct = {
    id,
    name,
    description,
    price: priceValue,
    gramatura: gramatura || 'N/A',
    complexity: complexity || 'N/A',
    productionTime: productionTime || 'A definir',
    image: image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  };

  products.push(newProduct);
  setProducts(products);
  renderAdminProducts();
  resetAdminForm();
  showTemporaryMessage('Produto adicionado ao catálogo com sucesso.', 'success');
}

function initializeAdminPage() {
  if (!isAdminUser()) {
    redirectToLogin();
    return;
  }

  const adminForm = document.getElementById('admin-form');
  if (adminForm) {
    adminForm.addEventListener('submit', createAdminProduct);
  }

  const cancelButton = document.getElementById('admin-cancel-button');
  if (cancelButton) {
    cancelButton.addEventListener('click', resetAdminForm);
  }

  renderAdminProducts();
}

window.addEventListener('DOMContentLoaded', initializeAdminPage);
