import { signal } from '@angular/core';

export type Product = {
  id: number;
  name: string;
  price: string;
  gramatura: string;
  complexity: string;
  productionTime: string;
  imageUrl: string;
  description: string;
};

export type OrderRequest = {
  id: number;
  customerName: string;
  phone: string;
  product: string;
  quantity: number;
  paymentMethod: string;
  note: string;
  status: 'Pendente' | 'Confirmado' | 'Finalizado';
  createdAt: string;
};

const whatsappBase = 'https://wa.me/5561996232331';
export const createWhatsAppLink = (message: string) =>
  `${whatsappBase}?text=${encodeURIComponent(message)}`;

const orderStorageKey = 'wr3d-order-requests';

const loadOrders = (): OrderRequest[] => {
  try {
    if (typeof window === 'undefined') {
      return [];
    }
    const stored = window.localStorage.getItem(orderStorageKey);
    return stored ? JSON.parse(stored) as OrderRequest[] : [];
  } catch {
    return [];
  }
};

const saveOrders = (items: OrderRequest[]) => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(orderStorageKey, JSON.stringify(items));
  } catch {
    // ignore storage failures
  }
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Peças Técnicas sob Medida',
    price: 'R$ 45,00',
    gramatura: '1.75 mm / PLA',
    complexity: 'Média',
    productionTime: '2 a 4 dias',
    imageUrl:
      'https://images.unsplash.com/photo-1580674285151-0c8d35be9b5d?auto=format&fit=crop&w=900&q=80',
    description:
      'Componentes estruturais e protótipos duráveis com acabamento limpo e ajuste preciso.',
  },
  {
    id: 2,
    name: 'Miniaturas e Figuras Personalizadas',
    price: 'R$ 79,00',
    gramatura: '1.75 mm / PETG',
    complexity: 'Alta',
    productionTime: '3 a 6 dias',
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    description:
      'Itens decorativos e presentes com alto nível de detalhe para peças exclusivas.',
  },
  {
    id: 3,
    name: 'Peças de Reposição Rápidas',
    price: 'R$ 39,00',
    gramatura: '1.75 mm / ABS',
    complexity: 'Baixa',
    productionTime: '1 a 3 dias',
    imageUrl:
      'https://images.unsplash.com/photo-1608602417383-3ff45da37a0f?auto=format&fit=crop&w=900&q=80',
    description:
      'Reparos práticos e ajustes funcionais para equipamentos e montagens industriais.',
  },
  {
    id: 4,
    name: 'Acessórios Funcionais',
    price: 'R$ 52,00',
    gramatura: '1.75 mm / TPU',
    complexity: 'Média',
    productionTime: '3 a 5 dias',
    imageUrl:
      'https://images.unsplash.com/photo-1587013822481-5f37709a8e5c?auto=format&fit=crop&w=900&q=80',
    description:
      'Suportes, ganchos, adaptadores e peças flexíveis personalizados para sua demanda.',
  },
];

export const products = signal<Product[]>(initialProducts);

export const orders = signal<OrderRequest[]>(loadOrders());

export const addProduct = (product: Omit<Product, 'id'>) => {
  const current = products();
  const nextId = current.length ? Math.max(...current.map((item) => item.id)) + 1 : 1;
  products.update((items) => [...items, { ...product, id: nextId }]);
};

export const addOrder = (order: Omit<OrderRequest, 'id' | 'status' | 'createdAt'>) => {
  const current = orders();
  const nextId = current.length ? Math.max(...current.map((item) => item.id)) + 1 : 1;
  const newOrder: OrderRequest = {
    id: nextId,
    ...order,
    quantity: Math.max(1, order.quantity),
    status: 'Pendente',
    createdAt: new Date().toLocaleString('pt-BR'),
  };
  const nextOrders = [...current, newOrder];
  orders.set(nextOrders);
  saveOrders(nextOrders);
};

export const updateOrderStatus = (orderId: number, status: OrderRequest['status']) => {
  const nextOrders = orders().map((order) =>
    order.id === orderId ? { ...order, status } : order
  );
  orders.set(nextOrders);
  saveOrders(nextOrders);
};

export const authState = {
  isLoggedIn: signal(false),
  login: () => authState.isLoggedIn.set(true),
  logout: () => authState.isLoggedIn.set(false),
};
