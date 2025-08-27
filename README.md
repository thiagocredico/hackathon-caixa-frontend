# hackathon-caixa-frontend

Este projeto foi desenvolvido para atender ao Hackathon da CAIXA 2025. consiste em um APP front-end de uma simulação de empréstimos, construída com Angular, Anula Material e Tailwind, preparado para desenvolvimento local e produção.

## Tecnologias

- Angular (CLI) — estrutura principal do app
- TypeScript — linguagem principal
- Angular Material — componentes UI (mat-icon, mat-accordion, mat-card, etc.)
- Tailwind CSS — estilização utilitária no lugar de muitos SCSS locais
- RxJS — reatividade e streams (usado internamente pelo Angular)
- Karma/Jasmine — testes unitários (configuração padrão do Angular)
- Node.js & npm — gerenciador de pacotes e runtime para scripts

## Pré-requisitos

- Node.js (recomendado >= 18)
- npm (recomendado)
- Angular CLI (opcional, mas útil): `npm i -g @angular/cli`

## Instalar dependências

Abra um terminal na raiz do projeto e rode:

```bash
npm install
```

## Rodando em desenvolvimento

Executar o servidor de desenvolvimento com live-reload:

```bash
npm run start
```

O comando padrão usa o Angular CLI (`ng serve`) e, por padrão, abre em http://localhost:4200.

Se quiser rodar uma build de desenvolvimento (sem servidor):

```bash
npm run build -- --configuration development
```

## Build para produção

Gerar artefatos otimizados para produção:

```bash
npm run build -- --configuration production
```

Os arquivos finais vão para `dist/app-simula-emprestimos` (veja o `angular.json` para detalhes).

## Testes

Executar testes unitários:

```bash
npm run test
```

## Estilização

Este projeto usa Tailwind CSS em conjunto com os estilos do Angular Material. A maior parte da UI foi migrada para utilitários Tailwind diretamente nas templates; componentes ainda podem usar SCSS locais quando necessário.
