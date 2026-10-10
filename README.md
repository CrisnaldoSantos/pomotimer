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

O Pomotimer é um timer de foco com visual minimalista e tema escuro, pensado para quem quer manter o ritmo de trabalho sem perder o controle do tempo. O fluxo principal alterna entre:

- foco intenso
- pausa curta
- pausa longa

A interface foi criada com um estilo de terminal/editor, usando tipografia monoespaçada, superfícies escuras e detalhes em verde, azul e laranja para reforçar o estado da sessão.

## Recursos

- temporizador de foco com contagem regressiva
- ciclos automáticos de pausa curta e longa
- histórico local de sessões concluídas e interrompidas
- configurações persistidas no navegador
- notificações do sistema para mudança de fase
- atalhos de teclado para controlar rapidamente o timer
- layout responsivo para desktop e mobile

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Local Storage para persistência

## Como rodar

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
pnpm start   # inicia a build gerada
pnpm lint    # valida o código com ESLint
```

## Estrutura do projeto

```txt
pomotimer/
├── app/
│   ├── ciclos/
│   ├── configuracoes/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
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

1. Inicie uma sessão de foco.
2. Trabalhe na tarefa escolhida sem interrupções.
3. Quando a sessão terminar, o app alterna para pausa curta ou longa.
4. Acompanhe o histórico em "Ciclos" e ajuste os tempos em "Configurações".

## Observação

Este projeto foi desenvolvido para funcionar de forma leve e local, sem dependência de backend, priorizando performance e simplicidade no fluxo de produtividade.
