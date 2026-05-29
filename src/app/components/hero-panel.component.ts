import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { createWhatsAppLink } from '../data/products';

@Component({
  selector: 'hero-panel',
  standalone: true,
  imports: [RouterModule],
  template: `
    <section class="hero-panel">
      <div>
        <span class="product-tag">WR3D • Impressão 3D & atendimento por WhatsApp</span>
        <h1>Seu portfólio de impressões 3D com pedido rápido pelo WhatsApp.</h1>
        <p>
          Explore um catálogo completo de peças técnicas, miniaturas e acessórios. Peça um orçamento
          ou solicitação personalizada diretamente para <strong>61 99623-2331</strong>.
        </p>
        <div class="hero-actions">
          <a class="cta-button" [href]="createMessageLink('Tenho interesse nos produtos WR3D')" target="_blank" rel="noreferrer">
            Solicitar pelo WhatsApp
          </a>
          <a routerLink="/login" class="secondary-button">Área do dono</a>
        </div>
      </div>
      <div class="section-card">
        <h2>Por que escolher a WR3D?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <strong>Atendimento direto</strong>
            Faça pedidos e consulte valores no WhatsApp com rapidez.
          </div>
          <div class="feature-card">
            <strong>Catálogo completo</strong>
            Produtos prontos e solicitações sob medida para qualquer projeto.
          </div>
          <div class="feature-card">
            <strong>Produção eficiente</strong>
            Entregas rápidas com acompanhamento de prazo e complexidade.
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroPanelComponent {
  createMessageLink = createWhatsAppLink;
}
