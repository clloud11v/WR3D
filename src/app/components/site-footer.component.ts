import { Component } from '@angular/core';

@Component({
  selector: 'site-footer',
  standalone: true,
  template: `
    <footer class="app-footer">
      <span>WR3D • Contato: <a href="https://wa.me/5561996232331" target="_blank" rel="noreferrer">61 99623-2331</a></span>
      <span>Peça diretamente pelo WhatsApp e receba orçamento imediato.</span>
    </footer>
  `,
})
export class SiteFooterComponent {}
