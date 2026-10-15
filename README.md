<div align="center">
  <h1 style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace; color: #e6edf3; letter-spacing: 0.12em; font-size: 2.5rem; margin-bottom: 0.35rem;">
    <span style="color: #3fb950;">~/</span>pomotimer
  </h1>
  <p style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace; color: #8b949e; letter-spacing: 0.08em; margin-top: 0;">
    foco, pausas e disciplina em um único timer
  </p>
</div>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16.4.0-000000?style=flat-square&logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19.3.0-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
</p>

## Visão geral

O pomotimer é um timer Pomodoro para sessões de foco e descanso, com interface inspirada em terminais e ferramentas de desenvolvimento. Ele funciona no navegador e pode ser instalado como Progressive Web App (PWA) em dispositivos compatíveis.

**Versão de produção:** [my-pomo-timer.netlify.app](https://my-pomo-timer.netlify.app/)

O fluxo alterna entre:

- foco intenso
- pausa curta
- pausa longa

O tema escuro usa tipografia monoespaçada e cores diferentes para indicar o estado da sessão.

## Recursos

- Timer com controles para iniciar, pausar, continuar, reiniciar e pular uma sessão.
- Alternância entre foco, pausa curta e pausa longa, com contagem de sessões de foco.
- Histórico local de sessões concluídas e interrompidas.
- Duração configurável para cada tipo de sessão; as alterações passam a valer na próxima sessão.
- Som e notificações do sistema ao fim de uma sessão. As notificações dependem da permissão do navegador.
- Atalhos de teclado: `Espaço` inicia/pausa, `R` reinicia e `S` pula a sessão (quando o foco não está em um campo ou controle).
- Interface responsiva para desktop e dispositivos móveis.
- PWA com modo de exibição independente, ícones próprios e suporte a abertura offline após o cache das páginas e recursos.

## Stack

- Next.js 16 com App Router
- React 19 e TypeScript
- Tailwind CSS 4
- Service worker próprio para cache de páginas e arquivos estáticos
- `localStorage` para configurações e histórico, sem backend ou conta de usuário

## PWA e instalação

O manifesto é definido em `app/manifest.ts`. Ele configura o nome, o tema, a abertura em modo `standalone`, os ícones e atalhos para as páginas **Ciclos** e **Configurações**. Os arquivos de ícone ficam em `public/icons/`:

- `icon-192.png`: ícone de 192 × 192 px.
- `icon-512.png`: ícone de 512 × 512 px.
- `icon-maskable-512.png`: ícone de 512 × 512 px com finalidade `maskable`, para máscaras de ícones em dispositivos compatíveis.

Para instalar, publique o app em uma origem HTTPS e use a opção de instalação do navegador. Em dispositivos móveis, essa opção pode aparecer como **Instalar app** ou **Adicionar à tela inicial**. O app também pode ser testado em `localhost`.

O service worker é registrado apenas em produção. Ele usa a rede primeiro para páginas e mantém uma cópia em cache como alternativa offline; arquivos estáticos e ícones são servidos do cache quando disponíveis. As rotas principais (`/`, `/ciclos` e `/configuracoes`) são pré-carregadas quando possível. Para validar esse comportamento localmente, gere e inicie a versão de produção:

```bash
pnpm build
pnpm start
```

O modo offline depende de uma visita ou instalação com rede para preencher o cache. Notificações podem exigir autorização e variam conforme o navegador e o sistema operacional.

## Como rodar

Requisitos: Node.js compatível com Next.js 16 e pnpm 10 (a versão do gerenciador está indicada no `package.json`).

1. Instale as dependências:

```bash
pnpm install
```

2. Inicie o ambiente de desenvolvimento:

```bash
pnpm dev
```

3. Acesse no navegador:

```txt
http://localhost:3000
```

## Scripts

```bash
pnpm dev     # inicia a aplicação em modo de desenvolvimento
pnpm build   # gera a build de produção
pnpm start   # inicia a build de produção (execute build antes)
pnpm lint    # valida o código com ESLint
```

## Estrutura do projeto

```txt
pomotimer/
├── app/
│   ├── ciclos/                 # página do histórico
│   ├── configuracoes/          # página de configurações
│   ├── components/             # timer, navegação, histórico e componentes PWA
│   ├── hooks/                  # hooks para dados locais
│   ├── lib/                    # regras e formatação do Pomodoro
│   ├── services/               # persistência de ciclos e configurações
│   ├── manifest.ts             # manifesto PWA
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # timer principal
├── public/
│   ├── icons/                  # ícones do PWA
│   └── sw.js                   # service worker
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
└── README.md
```

## Design

O visual do projeto foi pensado para refletir ambientes de desenvolvimento e produtividade:

- fundo principal: `#0d1117`
- superfície: `#161b22`
- texto principal: `#e6edf3`
- texto secundário: `#8b949e`
- destaque foco: `#3fb950`
- destaque pausa: `#58a6ff`
- alerta/acento: `#ffa657`

A tipografia predominante é monoespaçada para transmitir velocidade, clareza e sensação de controle visual.

## Fluxo de uso

1. Inicie uma sessão de foco e trabalhe até o timer terminar.
2. O app registra a sessão e alterna para a pausa correspondente.
3. Consulte sessões anteriores em **Ciclos**.
4. Ajuste as durações em **Configurações**; sessões já iniciadas mantêm a duração original.

## Dados e privacidade

O histórico e as configurações são salvos no `localStorage` do navegador em uso. Não há sincronização entre dispositivos nem backend; limpar os dados do site remove as informações salvas naquele navegador.
