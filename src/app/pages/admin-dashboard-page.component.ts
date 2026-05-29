import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductGridComponent } from '../components/product-grid.component';
import { AdminOrdersComponent } from '../components/admin-orders.component';
import { addProduct, authState, createWhatsAppLink, products } from '../data/products';

@Component({
  selector: 'admin-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProductGridComponent, AdminOrdersComponent],
  template: `
    <section class="section-card">
      <div class="hero-actions">
        <div>
          <span class="product-tag">Painel WR3D</span>
          <h1>Adicionar produto de impressão 3D</h1>
          <p>Cadastre novos produtos com imagem, valor, gramatura, complexidade e tempo de produção.</p>
        </div>
        <div class="form-actions">
          <button type="button" class="secondary-button" (click)="logout()">Sair</button>
          <a class="cta-button" [href]="createMessageLink('Olá, gostaria de conversar sobre uma produção')" target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </div>

      <form class="form-card" (ngSubmit)="submitProduct()">
        <label>
          Nome do produto
          <input
            type="text"
            [ngModel]="name()"
            (ngModelChange)="name.set($event)"
            name="productName"
            placeholder="Ex: Suporte para placa eletrônica"
          />
        </label>

        <label>
          Valor
          <input
            type="text"
            [ngModel]="price()"
            (ngModelChange)="price.set($event)"
            name="productPrice"
            placeholder="R$ 59,00"
          />
        </label>

        <label>
          Gramatura / Material
          <input
            type="text"
            [ngModel]="gramatura()"
            (ngModelChange)="gramatura.set($event)"
            name="productGramatura"
            placeholder="1.75 mm / PLA"
          />
        </label>

        <label>
          Complexidade
          <select [ngModel]="complexity()" (ngModelChange)="complexity.set($event)" name="productComplexity">
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
          </select>
        </label>

        <label>
          Tempo de produção
          <input
            type="text"
            [ngModel]="productionTime()"
            (ngModelChange)="productionTime.set($event)"
            name="productTime"
            placeholder="3 a 5 dias"
          />
        </label>

        <label>
          Imagem (URL)
          <input
            type="text"
            [ngModel]="imageUrl()"
            (ngModelChange)="imageUrl.set($event)"
            name="productImage"
            placeholder="https://..."
          />
        </label>

        <label>
          Descrição
          <textarea
            [ngModel]="description()"
            (ngModelChange)="description.set($event)"
            name="productDescription"
            placeholder="Descrição do produto"
          ></textarea>
        </label>

        <div class="form-actions">
          <button type="submit" class="cta-button">Salvar produto</button>
        </div>

        <div *ngIf="errorMessage()" class="alert">{{ errorMessage() }}</div>
        <div *ngIf="successMessage()" class="product-tag">{{ successMessage() }}</div>
      </form>
    </section>

    <section class="section-card">
      <h2>Produtos cadastrados</h2>
      <product-grid [products]="products()"></product-grid>
    </section>

    <admin-orders></admin-orders>
  `,
})
export class AdminDashboardPage implements OnInit {
  products = products;
  name = signal('');
  price = signal('');
  gramatura = signal('1.75 mm / PLA');
  complexity = signal('Média');
  productionTime = signal('3 a 5 dias');
  imageUrl = signal('https://images.unsplash.com/photo-1580674285151-0c8d35be9b5d?auto=format&fit=crop&w=900&q=80');
  description = signal('');
  errorMessage = signal('');
  successMessage = signal('');
  createMessageLink = createWhatsAppLink;

  constructor(private router: Router) {
    if (!authState.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    if (!authState.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  submitProduct() {
    if (!this.name().trim() || !this.price().trim() || !this.imageUrl().trim()) {
      this.errorMessage.set('Preencha nome, valor e URL da imagem para cadastrar o produto.');
      this.successMessage.set('');
      return;
    }

    addProduct({
      name: this.name().trim(),
      price: this.price().trim(),
      gramatura: this.gramatura().trim(),
      complexity: this.complexity(),
      productionTime: this.productionTime().trim(),
      imageUrl: this.imageUrl().trim(),
      description: this.description().trim() || 'Produto novo em catálogo WR3D.',
    });

    this.successMessage.set('Produto adicionado com sucesso!');
    this.errorMessage.set('');
    this.name.set('');
    this.price.set('');
    this.imageUrl.set('');
    this.description.set('');
  }

  logout() {
    authState.logout();
    this.router.navigate(['/']);
  }
}
