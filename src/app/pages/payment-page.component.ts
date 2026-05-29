import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentMethodsComponent } from '../components/payment-methods.component';

@Component({
  selector: 'payment-page',
  standalone: true,
  imports: [CommonModule, PaymentMethodsComponent],
  template: `
    <section class="section-card page-header-card">
      <div>
        <span class="section-badge">Pagamento</span>
        <h1>Todos os meios de pagamento aceitos.</h1>
        <p>PIX, cartão, boleto, transferência e dinheiro na entrega. Flexibilidade total para fechar seu pedido WR3D.</p>
      </div>
    </section>

    <payment-methods></payment-methods>
  `,
})
export class PaymentPage {}
