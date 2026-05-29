import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../data/products';
import { ProductCardComponent } from './product-card.component';

@Component({
  selector: 'product-grid',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div class="product-grid">
      <product-card *ngFor="let product of products" [product]="product"></product-card>
    </div>
  `,
})
export class ProductGridComponent {
  @Input() products: Product[] = [];
}
