import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, createWhatsAppLink } from '../data/products';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="product-card">
      <img [src]="product.imageUrl" [alt]="product.name" />
      <div class="product-body">
        <span class="product-tag">{{ product.complexity }} • {{ product.gramatura }}</span>
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <div class="product-foot">
          <span class="product-meta">Produção {{ product.productionTime }}</span>
          <span class="product-meta">{{ product.price }}</span>
        </div>
        <a
          [href]="createMessageLink('Olá, quero pedir: ' + product.name)"
          target="_blank"
          rel="noreferrer"
        >
          Pedir pelo WhatsApp
        </a>
      </div>
    </article>
  `,
})
export class ProductCardComponent {
  @Input() product!: Product;
  createMessageLink = createWhatsAppLink;
}
