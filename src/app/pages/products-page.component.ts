import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGridComponent } from '../components/product-grid.component';
import { products } from '../data/products';

@Component({
  selector: 'products-page',
  standalone: true,
  imports: [CommonModule, ProductGridComponent],
  template: `
    <section class="section-card page-header-card">
      <div>
        <span class="section-badge">Catálogo WR3D</span>
        <h1>Explore nossas impressões 3D prontas para pedido.</h1>
        <p>Encontre peças técnicas, miniaturas, acessórios funcionais e mais com detalhamento claro de gramatura, complexidade e tempo de entrega.</p>
      </div>
    </section>

    <section class="product-list-section">
      <product-grid [products]="products()"></product-grid>
    </section>
  `,
})
export class ProductsPage {
  products = products;
}
