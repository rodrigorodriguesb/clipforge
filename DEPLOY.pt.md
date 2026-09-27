# Deploy na VPS (Hostinger) — trancado com senha e HTTPS

O app **não tem login próprio**. O acesso é protegido pelo Caddy (basic auth) na frente. A porta do app (3000) nunca é exposta direto.

## Pré-requisitos
- VPS com Docker + Docker Compose (Hostinger tem template com Docker pronto).
- Um domínio (ou subdomínio) com **registro A apontando pro IP da VPS**. Ex.: `clipforge.seudominio.com.br → 203.0.113.10`.
- Portas **80 e 443 abertas** no firewall da Hostinger.

## Passos
```bash
# 1. clonar seu fork
git clone https://github.com/rodrigorodriguesb/clipforge.git
cd clipforge

# 2. configurar
cp .env.example .env

# 3. gerar o hash da senha e colar em BASIC_AUTH_HASH no .env
docker run --rm caddy:2 caddy hash-password --plaintext 'suaSenhaForte'

# 4. editar o .env: domínio, usuário, hash, e a chave do LLM
nano .env

# 5. subir (build + HTTPS automático)
docker compose up -d --build
```

Abra `https://seu-dominio` → vai pedir usuário/senha → cai no app em português.

## Chaves de IA
- **LLM (roteiro):** vai no `.env` (`CLIPFORGE_LLM_*`).
- **Plataformas de imagem/vídeo (Atlas/Seedance etc.):** configure na tela de **Configurações** do app depois de logar. Ficam salvas no volume `clipforge-data`.

## Operação
```bash
docker compose logs -f          # ver logs
docker compose pull && docker compose up -d --build   # atualizar
docker compose down             # parar (dados ficam nos volumes)
```

- Dados (sqlite + vídeos) vivem no volume `clipforge-data`. Backup = backup desse volume.
- Certificados HTTPS vivem em `caddy-data` — não apague, senão o Let's Encrypt re-emite (tem limite de taxa).
- A pasta de dados cresce sem limite; limpe vídeos antigos de vez em quando.

## Tamanho da VPS
Sem GPU (IA é remota). RAM: 4 GB confortável pro FFmpeg (2 GB fica apertado no compose). Disco: 20–30 GB.
