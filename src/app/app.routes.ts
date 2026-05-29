import { Routes } from '@angular/router';
import { AdminDashboardPage, AdminLoginPage, HomePage, OrderPage, PaymentPage, ProductsPage } from './pages';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'produtos', component: ProductsPage },
  { path: 'pedidos', component: OrderPage },
  { path: 'pagamentos', component: PaymentPage },
  { path: 'login', component: AdminLoginPage },
  { path: 'admin', component: AdminDashboardPage },
  { path: '**', redirectTo: '' }
];
