# JP Store — Site de Autenticação OAuth2

## Como funciona

1. Admin configura a URL do site no bot: `.auth siteurl https://SEU_SITE.vercel.app`
2. Quando usuário clica em **Verificar** no Discord, bot envia link para o site
3. Usuário clica em **Verificar com Discord** e autoriza
4. Site salva verificação no MongoDB e notifica o bot
5. Bot dá o cargo de verificado automaticamente (em até 5 segundos)

## Deploy na Vercel (GRATUITO)

### 1. Criar conta na Vercel
- Acesse [vercel.com](https://vercel.com)
- Crie conta com GitHub (gratuito)

### 2. Subir o código
**Opção A — Upload direto:**
- Zip a pasta `auth-site`
- Na Vercel, clique em **Add New Project → Upload**

**Opção B — GitHub:**
- Crie repositório no GitHub
- Conecte na Vercel

### 3. Configurar variáveis de ambiente
Na Vercel: **Settings → Environment Variables**

```
DISCORD_CLIENT_ID=       # ID do app Discord
DISCORD_CLIENT_SECRET=   # Secret do app Discord
MONGODB_URI=             # URI do MongoDB (mesmo do bot)
SITE_URL=                # https://SEU_PROJETO.vercel.app
DISCORD_BOT_TOKEN=       # Token do bot
DISCORD_GUILD_ID=        # ID do servidor
```

### 4. Configurar Discord OAuth2
Em [discord.com/developers](https://discord.com/developers/applications):
- Abra sua aplicação
- Vá em **OAuth2 → Redirects**
- Adicione: `https://SEU_PROJETO.vercel.app/callback`
- Salve

### 5. Configurar no bot
```
.auth siteurl https://SEU_PROJETO.vercel.app
```

## Fluxo completo
```
Usuário clica "Verificar-se" no Discord
    ↓
Bot envia link: https://site.vercel.app?user_id=123456
    ↓
Usuário clica "Verificar com Discord"
    ↓
Discord OAuth2 redireciona para /callback com código
    ↓
Site troca código por token, busca dados do usuário
    ↓
Salva verified=1 no MongoDB + insere em pending_verifications
    ↓
Bot (a cada 5s) lê pending_verifications
    ↓
Dá cargo verificado + envia DM de confirmação
```
