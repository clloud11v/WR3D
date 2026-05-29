import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroPanelComponent } from '../components/hero-panel.component';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [CommonModule, HeroPanelComponent],
  template: `
    <hero-panel></hero-panel>

    <section class="section-card feature-intro">
      <div class="feature-list">
        <article class="feature-card animated-card">
          <span class="section-badge">Rápido</span>
          <h2>Interface simples e direta</h2>
          <p>Navegação por páginas distintas para cada área do site, com um menu interativo e visual moderno.</p>
        </article>
        <article class="feature-card animated-card delay-1">
          <span class="section-badge">Visual</span>
          <h2>Design chamativo</h2>
          <p>Cores vibrantes, cartões suaves e animações fluidas para destacar produtos e informações.</p>
        </article>
        <article class="feature-card animated-card delay-2">
          <span class="section-badge">Flexível</span>
          <h2>Pedidos e pagamentos</h2>
          <p>Fluxo pronto para receber solicitações, com opções de pagamento completas e painel administrativo rápido.</p>
        </article>
      </div>
    </section>
  `,
})
export class HomePage {}
