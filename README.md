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
