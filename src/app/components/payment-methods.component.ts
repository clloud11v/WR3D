import { Component } from '@angular/core';

@Component({
  selector: 'payment-methods',
  standalone: true,
  template: `
    <section class="section-card">
      <h2>Métodos de pagamento aceitos</h2>
      <div class="features-grid">
        <div class="feature-card">
          <strong>PIX</strong>
          Pagamento instantâneo e confirmável na hora. Envie o comprovante pelo WhatsApp.
        </div>
        <div class="feature-card">
          <strong>Cartão</strong>
          Aceitamos cartão de crédito e débito via link de pagamento seguro.
        </div>
        <div class="feature-card">
          <strong>Boleto</strong>
          Emissão rápida de boleto para pagamento em até 3 dias.
        </div>
        <div class="feature-card">
          <strong>Transferência</strong>
          Depósito ou transferência bancária com confirmação via WhatsApp.
        </div>
        <div class="feature-card">
          <strong>Dinheiro</strong>
          Pagamento em dinheiro na entrega disponível para pedidos locais.
        </div>
      </div>
    </section>
  `,
})
export class PaymentMethodsComponent {}
