import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { authState } from '../data/products';

@Component({
  selector: 'admin-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section class="section-card">
      <h1>Login do dono</h1>
      <p>Use o painel para adicionar novos produtos ao catálogo WR3D.</p>
      <form class="form-card" (ngSubmit)="login()">
        <label>
          Usuário
          <input
            type="text"
            [ngModel]="username()"
            (ngModelChange)="username.set($event)"
            name="username"
            placeholder="wr3d"
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            [ngModel]="password()"
            (ngModelChange)="password.set($event)"
            name="password"
            placeholder="1234"
          />
        </label>

        <div class="form-actions">
          <button type="submit" class="cta-button">Entrar</button>
          <a routerLink="/" class="secondary-button">Voltar para o site</a>
        </div>

        <div *ngIf="errorMessage()" class="alert">{{ errorMessage() }}</div>
      </form>
    </section>
  `,
})
export class AdminLoginPage {
  username = signal('');
  password = signal('');
  errorMessage = signal('');

  constructor(private router: Router) {}

  login() {
    if (this.username().toLowerCase() === 'wr3d' && this.password() === '1234') {
      authState.login();
      this.errorMessage.set('');
      this.router.navigate(['/admin']);
      return;
    }

    this.errorMessage.set('Usuário ou senha incorretos. Use wr3d / 1234.');
  }
}
