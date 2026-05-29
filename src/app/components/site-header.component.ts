import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'site-header',
  standalone: true,
  imports: [RouterModule],
  template: `
    <header class="app-header">
      <div class="brand">
        <div class="brand-mark">WR3D</div>
        <div class="brand-copy">
          <strong>WR3D</strong>
          <span>Impressões 3D criativas, rápidas e sob medida.</span>
        </div>
      </div>

      <nav class="top-nav">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Início</a>
        <a routerLink="/produtos" routerLinkActive="active">Produtos</a>
        <a routerLink="/pedidos" routerLinkActive="active">Pedidos</a>
        <a routerLink="/pagamentos" routerLinkActive="active">Pagamentos</a>
        <a routerLink="/login" routerLinkActive="active">Login</a>
      </nav>
    </header>
  `,
})
export class SiteHeaderComponent {}
