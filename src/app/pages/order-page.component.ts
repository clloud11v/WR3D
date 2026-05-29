import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderRequestFormComponent } from '../components/order-request-form.component';

@Component({
  selector: 'order-page',
  standalone: true,
  imports: [CommonModule, OrderRequestFormComponent],
  template: `
    <section class="section-card page-header-card">
      <div>
        <span class="section-badge">Pedidos</span>
        <h1>Solicite sua impressão 3D em poucos passos.</h1>
        <p>Envie seu pedido pelo painel e converse direto com o time WR3D pelo WhatsApp para confirmar as preferências e pagamento.</p>
      </div>
    </section>

    <order-request-form></order-request-form>
  `,
})
export class OrderPage {}
