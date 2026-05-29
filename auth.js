const AUTH_USERS_KEY = 'wr3d-users';
const CURRENT_USER_KEY = 'wr3d-current-user';
const ADMIN_ACCOUNTS = [
  {
    name: 'Wendel Menezes',
    email: 'menezeswendel@gmail.com',
    password: 'WR3Dwendelruth204657',
    admin: true,
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Vitor Mendes',
    email: 'vitorhugomendesmenezes@gmail.com',
    password: 'WR3Dvitordev204657',
    admin: true,
    createdAt: new Date().toISOString(),
  },
];

const authMessageEl = document.getElementById('auth-message');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const socialButtons = document.querySelectorAll('.social-button');

function getUsers() {
  try {
    const raw = localStorage.getItem(AUTH_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function setUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  } catch (error) {
    return null;
  }
}

function ensureAdminAccounts() {
  const users = getUsers();
  let changed = false;

  ADMIN_ACCOUNTS.forEach((admin) => {
    if (!users.find((user) => user.email === admin.email)) {
      users.push(admin);
      changed = true;
    }
  });

  if (changed) {
    setUsers(users);
  }
}

function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
  window.location.href = 'index.html';
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function validateEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function showMessage(message, type = 'success') {
  if (!authMessageEl) {
    return;
  }
  authMessageEl.textContent = message;
  authMessageEl.className = 'auth-message';
  authMessageEl.classList.add(type);
  authMessageEl.style.display = 'block';
}

function clearMessage() {
  if (!authMessageEl) {
    return;
  }
  authMessageEl.textContent = '';
  authMessageEl.className = 'auth-message';
  authMessageEl.style.display = 'none';
}

function createSocialAccount(provider) {
  const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
  const email = `user.${provider}@wr3d.social`;
  const users = getUsers();
  let user = users.find((entry) => entry.email === email);

  if (!user) {
    user = {
      name: `${providerName} User`,
      email,
      password: provider,
      provider,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    setUsers(users);
  }

  setCurrentUser(user);
  showMessage(`Login via ${providerName} concluído. Bem-vindo, ${user.name}!`, 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1200);
}

function handleLogin(event) {
  event.preventDefault();
  clearMessage();

  const email = normalizeEmail(document.getElementById('login-email').value);
  const password = document.getElementById('login-password').value.trim();

  if (!validateEmail(email)) {
    showMessage('Informe um e-mail válido para continuar.', 'error');
    return;
  }

  if (!password) {
    showMessage('Informe sua senha para entrar.', 'error');
    return;
  }

  const users = getUsers();
  const account = users.find((user) => user.email === email);

  if (!account) {
    showMessage('Conta não encontrada. Crie uma nova conta ou use outro e-mail.', 'error');
    return;
  }

  if (account.password !== password) {
    showMessage('Senha incorreta. Tente novamente ou recupere sua senha.', 'error');
    return;
  }

  setCurrentUser(account);
  showMessage(`Login realizado com sucesso. Bem-vindo de volta, ${account.name}!`, 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1200);
}

function handleRegister(event) {
  event.preventDefault();
  clearMessage();

  const name = document.getElementById('register-name').value.trim();
  const email = normalizeEmail(document.getElementById('register-email').value);
  const password = document.getElementById('register-password').value.trim();
  const confirm = document.getElementById('register-confirm').value.trim();

  if (!name || name.length < 2) {
    showMessage('Informe um nome completo válido.', 'error');
    return;
  }

  if (!validateEmail(email)) {
    showMessage('Informe um e-mail válido.', 'error');
    return;
  }

  if (password.length < 8) {
    showMessage('A senha deve ter pelo menos 8 caracteres.', 'error');
    return;
  }

  if (password !== confirm) {
    showMessage('As senhas não coincidem. Verifique e tente novamente.', 'error');
    return;
  }

  const users = getUsers();
  const existing = users.find((user) => user.email === email);

  if (existing) {
    showMessage('Já existe uma conta cadastrada com este e-mail.', 'error');
    return;
  }

  const newUser = {
    name,
    email,
    password,
    provider: 'email',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  setUsers(users);
  setCurrentUser(newUser);
  showMessage('Conta criada com sucesso! Você está conectado.', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1200);
}

function handleForgotPassword(event) {
  event.preventDefault();
  clearMessage();
  const email = normalizeEmail(document.getElementById('login-email').value);

  if (!validateEmail(email)) {
    showMessage('Informe um e-mail válido para recuperar a senha.', 'error');
    return;
  }

  const users = getUsers();
  const account = users.find((user) => user.email === email);

  if (!account) {
    showMessage('E-mail não cadastrado. Crie uma conta antes de recuperar a senha.', 'error');
    return;
  }

  showMessage(`Link de recuperação enviado para ${email}.`, 'success');
}

function initializeAuth() {
  ensureAdminAccounts();

  if (!loginForm || !registerForm || !authMessageEl) {
    return;
  }

  loginForm.addEventListener('submit', handleLogin);
  registerForm.addEventListener('submit', handleRegister);

  socialButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const provider = button.dataset.provider;
      if (provider) {
        createSocialAccount(provider);
      }
    });
  });

  const forgotPassword = document.getElementById('forgot-password');
  if (forgotPassword) {
    forgotPassword.addEventListener('click', handleForgotPassword);
  }

  const current = getCurrentUser();
  if (current) {
    showMessage(`Você já está conectado como ${current.name}.`, 'success');
  }
}

window.addEventListener('DOMContentLoaded', initializeAuth);
