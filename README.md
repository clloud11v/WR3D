WR3D — Site estático de comércio (projeto local)
===============================================

Resumo
-----

Projeto estático com páginas HTML/CSS/JS para catálogo, carrinho, checkout e administração local (sem backend). Use para prototipagem local e deploy em hosting estático.

Testar localmente
-----------------

Opção rápida com Python (porta 8000):

```bash
cd "caminho/para/WR3D"
python -m http.server 8000
# então abra http://localhost:8000/pedidos.html
```

Opção com `npx serve`:

```bash
npx serve . -p 8000
# ou: npx http-server -p 8000
```

Deploy estático (opções)
-----------------------

- GitHub Pages (para repositórios públicos):
  1. No GitHub, vá em Settings → Pages e selecione a branch `main` (pasta `/`).
  2. Aguarde alguns minutos; o site ficará disponível em https://<seu-usuario>.github.io/<repo>.

- Netlify / Vercel:
  1. Conecte o repositório no painel do serviço.
  2. Configure como um deploy estático (build command vazio). O serviço detectará o projeto e fará o deploy.

Notas sobre dados locais
-----------------------

O projeto persiste produtos, usuários e pedidos no `localStorage` do navegador sob as chaves:

- `wr3d-products`
- `wr3d-users`
- `wr3d-current-user`
- `wr3d-cart`
- `wr3d-orders`

Ao abrir `pedidos.html` pela primeira vez, um pedido de exemplo é gerado automaticamente (seed) quando não há pedidos no storage.

Próximos passos sugeridos
------------------------

- Adicionar testes automatizados ou CI (GitHub Actions) para verificação de build.
- Mover dados para um backend ou armazenar pedidos em um endpoint para produção.
- Criar um workflow de release automatizado.

Integração com Firebase (opcional)
---------------------------------

Para sincronização em tempo real entre todos os usuários (admin e clientes), você pode usar Firestore.
Este projeto suporta uma integração cliente-only com Firestore e Firebase Auth. Passos rápidos:

1. Crie um projeto no Firebase Console e ative Firestore e Authentication (e-mail/password).
2. Copie `firebase-config.example.js` para `firebase-config.js` na raiz do projeto e preencha os valores.
3. (Opcional) Em `firebase-config.js` ajuste `window.FIREBASE_ADMIN_EMAILS` com e-mails de administradores.
4. **Copie as Security Rules do arquivo `firestore.rules` para o console do Firebase:**
   - No Firebase Console, navegue para Firestore Database → Rules.
   - Cole o conteúdo de `firestore.rules` e publique.

Com isso o site irá:
- carregar automaticamente o SDK do Firebase quando `firebase-config.js` estiver presente;
- sincronizar em tempo real as coleções `products` e `orders` para todos os clientes;
- mapear o usuário autenticado do Firebase para o usuário local (`wr3d-current-user`) — se o usuário for administrador (por claim ou lista de e-mails) ele ganhará acesso ao painel admin;
- usar Firebase UI para login (Google, Facebook, Apple, e-mail) na página de login se o Firebase estiver configurado.

Backend seguro (opcional)
------------------------

Para operações administrativas com segurança adicional, você pode usar o backend Node.js fornecido em `backend/`:

1. Navegue para `backend/`.
2. Crie `.env` e `service-account.json` (veja `backend/README.md` para detalhes).
3. Execute `npm install && npm start`.
4. O backend oferecerá endpoints REST autenticados para criar produtos e gerenciar pedidos.

Veja `backend/README.md` para instruções completas e endpoints disponíveis.

Segurança recomendada
---------------------

- **Firestore Rules**: Use as regras fornecidas em `firestore.rules`. Permitem leitura pública de produtos, mas escrita apenas para admins.
- **Custom Claims**: Em produção, use custom claims do Firebase Auth para marcar admins, em vez de apenas uma lista de e-mails.
- **Backend**: Para operações críticas, prefira usar o backend seguro (`backend/server.js`) — ele valida permissões com Firebase Admin SDK.
- **HTTPS**: sempre use HTTPS em produção.
