import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addOrder, createWhatsAppLink, products } from '../data/products';

@Component({
  selector: 'order-request-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="section-card">
      <h2>Faça sua solicitação</h2>
      <p>Envie o pedido pelo WhatsApp com qualquer forma de pagamento disponível.</p>
      <form class="form-card" (ngSubmit)="submitOrder()">
        <label>
          Nome
          <input type="text" [ngModel]="customerName()" (ngModelChange)="customerName.set($event)" name="customerName" placeholder="Seu nome" />
        </label>

        <label>
          Telefone
          <input type="text" [ngModel]="phone()" (ngModelChange)="phone.set($event)" name="phone" placeholder="(61) 99999-9999" />
        </label>

        <label>
          Produto desejado
          <select [ngModel]="product()" (ngModelChange)="product.set($event)" name="product">
            <option *ngFor="let item of productOptions" [value]="item.name">{{ item.name }}</option>
          </select>
        </label>

        <label>
          Quantidade
          <input type="number" min="1" [ngModel]="quantity()" (ngModelChange)="quantity.set($event)" name="quantity" placeholder="1" />
        </label>

        <label>
          Pagamento preferencial
          <select [ngModel]="paymentMethod()" (ngModelChange)="paymentMethod.set($event)" name="paymentMethod">
            <option value="PIX">PIX</option>
            <option value="Cartão de crédito/de débito">Cartão de crédito/débito</option>
            <option value="Boleto">Boleto</option>
            <option value="Transferência">Transferência bancária</option>
            <option value="Dinheiro na entrega">Dinheiro na entrega</option>
          </select>
        </label>

        <label>
          Observações
          <textarea [ngModel]="note()" (ngModelChange)="note.set($event)" name="note" placeholder="Informe detalhes especiais do pedido"></textarea>
        </label>

        <div class="form-actions">
          <button type="submit" class="cta-button">Enviar pedido</button>
        </div>

        <div *ngIf="errorMessage()" class="alert">{{ errorMessage() }}</div>
        <div *ngIf="successMessage()" class="product-tag">{{ successMessage() }}</div>
      </form>
    </section>
  `,
})
export class OrderRequestFormComponent {
  productOptions = products();
  customerName = signal('');
  phone = signal('');
  product = signal(this.productOptions.length ? this.productOptions[0].name : '');
  quantity = signal(1);
  paymentMethod = signal('PIX');
  note = signal('');
  errorMessage = signal('');
  successMessage = signal('');

  submitOrder() {
    if (!this.customerName().trim() || !this.phone().trim()) {
      this.errorMessage.set('Preencha nome e telefone para continuar.');
      this.successMessage.set('');
      return;
    }

    addOrder({
      customerName: this.customerName().trim(),
      phone: this.phone().trim(),
      product: this.product(),
      quantity: Math.max(1, this.quantity()),
      paymentMethod: this.paymentMethod(),
      note: this.note().trim(),
    });

    const message = `Olá WR3D, gostaria de fazer um pedido:\nNome: ${this.customerName()}\nTelefone: ${this.phone()}\nProduto: ${this.product()}\nQuantidade: ${this.quantity()}\nPagamento: ${this.paymentMethod()}\nObservações: ${this.note()}`;
    window.open(createWhatsAppLink(message), '_blank');

    this.successMessage.set('Pedido enviado! Aguarde o contato via WhatsApp.');
    this.errorMessage.set('');
    this.customerName.set('');
    this.phone.set('');
    this.quantity.set(1);
    this.note.set('');
  }
}
