# Firebase Admin Backend (opcional)

Este diretório contém um servidor Node.js / Express opcional que oferece operações administrativas seguras para o site WR3D com Firestore como backend.

## Por quê?

Este backend fornece:
- **Operações administrativas autenticadas**: definir claims de admin, criar/atualizar produtos com validação de servidor.
- **Segurança em camada**: reduz o risco de confiança em claims de cliente apenas; usa Firebase Admin SDK com chaves de serviço.
- **Escalabilidade**: APIs simples REST para integrar com scripts, webhooks ou ferramentas externas.

## Instalação & Configuração

1. Crie um arquivo `.env` neste diretório:
   ```
   PORT=5000
   ```

2. Baixe a chave de serviço do Firebase Console:
   - Vá para Firebase Project Settings → Service Accounts.
   - Clique em "Generate new private key" e salve como `service-account.json` **neste diretório**.
   - **Mantenha este arquivo privado e jamais o publique no Git!**

3. Instale dependências:
   ```bash
   npm install
   ```

4. Inicie o servidor:
   ```bash
   npm start
   ```

O servidor será executado em `http://localhost:5000` (ou a porta especificada em `.env`).

## Endpoints

### `GET /health`
Verifica se o servidor está operacional.

### `POST /api/admin/products`
Cria ou atualiza um produto (requer token de admin).

**Headers:**
```
Authorization: Bearer <id-token-firebase>
Content-Type: application/json
```

**Body:**
```json
{
  "id": "product-id",
  "name": "Product Name",
  "description": "...",
  "price": 120,
  "gramatura": "50g",
  "complexity": "Média",
  "productionTime": "18h",
  "image": "https://...url"
}
```

### `GET /api/products`
Lista todos os produtos (acesso público).

### `GET /api/orders`
Lista pedidos: admins veem todos, clientes veem os seus (requer token).

**Headers:**
```
Authorization: Bearer <id-token-firebase>
```

### `POST /api/admin/set-admin-claim`
Define status de admin para um usuário (apenas admins).

**Headers:**
```
Authorization: Bearer <id-token-firebase>
Content-Type: application/json
```

**Body:**
```json
{
  "userId": "user-uid",
  "admin": true
}
```

## Deploy

Você pode hospedar este backend em:
- **Google Cloud Run**
- **Heroku**
- **AWS Lambda** (com adaptações)
- **Firebase Cloud Functions** (reescrever como funções)

### Exemplo: Deploy no Google Cloud Run

1. Crie um `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --production
   COPY . .
   EXPOSE 5000
   CMD ["node", "server.js"]
   ```

2. Construa e envie para Cloud Run:
   ```bash
   gcloud run deploy wr3d-backend --source .
   ```

## Segurança

- Mantenha `service-account.json` confidencial—nunca o publique.
- Use HTTPS em produção.
- Configure CORS adequadamente se o frontend estiver em domínio diferente.
- Implemente rate limiting e autenticação robustas se exposto publicamente.
