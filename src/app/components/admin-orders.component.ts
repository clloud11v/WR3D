import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { orders, OrderRequest, updateOrderStatus } from '../data/products';

@Component({
  selector: 'admin-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section-card">
      <h2>Pedidos recebidos</h2>
      <div *ngIf="orders().length === 0" class="info-panel">
        Ainda não há pedidos, mas eles aparecerão aqui assim que forem enviados pelos clientes.
      </div>
      <div class="product-grid" *ngIf="orders().length">
        <article class="product-card" *ngFor="let order of orders()">
          <div class="product-body">
            <span class="product-tag">{{ order.status }}</span>
            <h3>{{ order.product }} — {{ order.quantity }}x</h3>
            <p><strong>Cliente:</strong> {{ order.customerName }} • {{ order.phone }}</p>
            <p><strong>Pagamento:</strong> {{ order.paymentMethod }}</p>
            <p *ngIf="order.note"><strong>Detalhes:</strong> {{ order.note }}</p>
            <div class="product-foot">
              <span class="product-meta">Recebido em {{ order.createdAt }}</span>
            </div>
            <div class="form-actions">
              <button type="button" class="secondary-button" (click)="updateStatus(order, 'Confirmado')">Confirmar</button>
              <button type="button" class="cta-button" (click)="updateStatus(order, 'Finalizado')">Finalizar</button>
            </div>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class AdminOrdersComponent {
  orders = orders;

  updateStatus(order: OrderRequest, status: 'Pendente' | 'Confirmado' | 'Finalizado') {
    updateOrderStatus(order.id, status);
  }
}
