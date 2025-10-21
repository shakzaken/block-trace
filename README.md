# Block Trace - Bitcoin Transaction Network Visualizer

## Overview

Block Trace is an interactive web application that visualizes Bitcoin transaction networks as dynamic, explorable graphs. Enter any Bitcoin wallet address to generate a real-time visualization of its transaction relationships, allowing you to explore the blockchain's interconnected nature through an intuitive, node-based interface. The application reveals transaction patterns, connected addresses, and financial flows, making complex blockchain data accessible and visually comprehensible. Users can click on any address node to dive deeper into its transaction history, load additional transactions, and analyze the broader network of Bitcoin movements with detailed metrics including balance, transaction counts, and connection patterns.

## Libraries and Technologies

This application is built with **Next.js 15** and **React 19** using **TypeScript** for type safety and developer experience. The core visualization engine is powered by **react-force-graph-2d**, a React wrapper for the D3.js force-directed graph library that renders interactive network diagrams with physics-based animations and user interactions. The graph library enables smooth zooming, panning, node dragging, and click events, creating an engaging exploration experience. **Axios** handles HTTP requests to blockchain APIs with built-in error handling and timeout management. **CSS Modules** provide component-scoped styling for maintainable, collision-free styles. The application integrates with the **BlockCypher API** for reliable Bitcoin blockchain data access, featuring automatic rate limiting (12-second delays between requests) to prevent API throttling. Additional libraries include dynamic imports for client-side rendering compatibility and React Context API for global state management across components.

## Components and Services

The application follows a modular architecture with clear separation of concerns. **Components** include: `WalletAddress` - the main input component with address validation and submission handling; `Graph` - the core visualization component managing the force-graph display, node interactions, and graph data merging; `GraphInfoPanel` - a comprehensive information sidebar showing active address details, transaction statistics, activity logs, and exploration instructions; `Button` - a reusable UI component for consistent styling. **Services** layer includes: `BlockCypherService` - handles all blockchain API interactions with automatic rate limiting, address data fetching, and graph data transformation; `blockchainModel` - defines TypeScript interfaces and data structures for transactions, addresses, and graph objects. **Context** management through `GraphContext` provides global state for the selected address, graph data, loading states, and error handling, enabling seamless communication between components. The architecture supports real-time data updates, pagination through "Load More" functionality, and maintains address metadata (balance, total received/sent) for enhanced analysis capabilities.

## Installation and Local Development

Clone the repository and install dependencies using your preferred package manager:

```bash
# Clone the repository
git clone <repository-url>
cd block-trace

# Install dependencies (choose one)
npm install
# or
yarn install  
# or
pnpm install

# Start the development server
npm run dev
# or
yarn dev
# or  
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the application. The development server supports hot reloading for instant updates during development. For production builds, use `npm run build` followed by `npm start`. The application requires an active internet connection to fetch blockchain data from the BlockCypher API.

## Features

- 🔍 **Interactive Graph Exploration** - Click on any address node to explore its transaction network
- 📊 **Real-time Statistics** - View balance, total received/sent, and transaction counts
- 🔄 **Pagination Support** - Load more transactions with the "Load More" button
- 📝 **Activity Logging** - Track your exploration with detailed activity logs  
- 🎯 **Smart Node Selection** - Easily switch between addresses with dynamic stats updates
- ⚡ **Rate Limiting** - Automatic API throttling to prevent service interruptions
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Usage Examples

Try these well-known Bitcoin addresses:

- **Satoshi's Genesis Block**: `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa`
- **Large Exchange Address**: `1P5ZEDWTKTFGxQjZphgWPQUpe554WKDfHQ`
- **Historical Address**: `1FfmbHfnpaZjKFvyi1okTjJJusN455paPH`

## Technical Details

- **API Integration**: BlockCypher API with 12-second rate limiting
- **Graph Rendering**: Force-directed layout with physics simulation  
- **Data Processing**: Real-time transaction parsing and network analysis
- **State Management**: React Context for global application state
- **Responsive Design**: CSS Modules with mobile-first approach

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for more information.

---

Built with ❤️ for blockchain exploration and education.

## Quick Start

The best way to start with this template is using [Create Next App](https://nextjs.org/docs/api-reference/create-next-app).

```
# pnpm
pnpm create next-app -e https://github.com/jpedroschmitz/typescript-nextjs-starter
# yarn
yarn create next-app -e https://github.com/jpedroschmitz/typescript-nextjs-starter
# npm
npx create-next-app -e https://github.com/jpedroschmitz/typescript-nextjs-starter
```

### Development

To start the project locally, run:

```bash
pnpm dev
```

Open `http://localhost:3000` with your browser to see the result.

## Testimonials

> [**“This starter is by far the best TypeScript starter for Next.js. Feature packed but un-opinionated at the same time!”**](https://github.com/jpedroschmitz/typescript-nextjs-starter/issues/87#issue-789642190)<br>
> — Arafat Zahan

> [**“I can really recommend the Next.js Typescript Starter repo as a solid foundation for your future Next.js projects.”**](https://corfitz.medium.com/create-a-custom-create-next-project-command-2a6b35a1c8e6)<br>
> — Corfitz

> [**“Brilliant work!”**](https://github.com/jpedroschmitz/typescript-nextjs-starter/issues/87#issuecomment-769314539)<br>
> — Soham Dasgupta

## Showcase

List of websites that started off with Next.js TypeScript Starter:

- [FreeInvoice.dev](https://freeinvoice.dev)
- [Notion Avatar Maker](https://github.com/Mayandev/notion-avatar)
- [IKEA Low Price](https://github.com/Mayandev/ikea-low-price)
- [hygraph.com](https://hygraph.com)
- [rocketseat.com.br](https://www.rocketseat.com.br)
- [vagaschapeco.com](https://vagaschapeco.com)
- [unfork.vercel.app](https://unfork.vercel.app)
- [cryptools.dev](https://cryptools.dev)
- [Add yours](https://github.com/jpedroschmitz/typescript-nextjs-starter/edit/main/README.md)

## Documentation

### Requirements

- Node.js >= 20
- pnpm 9

### Directory Structure

- [`.github`](.github) — GitHub configuration including the CI workflow.<br>
- [`.husky`](.husky) — Husky configuration and hooks.<br>
- [`public`](./public) — Static assets such as robots.txt, images, and favicon.<br>
- [`src`](./src) — Application source code, including pages, components, styles.

### Scripts

- `pnpm dev` — Starts the application in development mode at `http://localhost:3000`.
- `pnpm build` — Creates an optimized production build of your application.
- `pnpm start` — Starts the application in production mode.
- `pnpm type-check` — Validate code using TypeScript compiler.
- `pnpm lint` — Runs ESLint for all files in the `src` directory.
- `pnpm lint:fix` — Runs ESLint fix for all files in the `src` directory.
- `pnpm format` — Runs Prettier for all files in the `src` directory.
- `pnpm format:check` — Check Prettier list of files that need to be formatted.
- `pnpm format:ci` — Prettier check for CI.

### Path Mapping

TypeScript are pre-configured with custom path mappings. To import components or files, use the `@` prefix.

```tsx
import { Button } from '@/components/Button';
// To import images or other files from the public folder
import avatar from '@/public/avatar.png';
```

### Switch to Yarn/npm

This starter uses pnpm by default, but this choice is yours. If you'd like to switch to Yarn/npm, delete the `pnpm-lock.yaml` file, install the dependencies with Yarn/npm, change the CI workflow, and Husky Git hooks to use Yarn/npm commands.

> **Note:** If you use Yarn, make sure to follow these steps from the [Husky documentation](https://typicode.github.io/husky/troubleshoot.html#yarn-on-windows) so that Git hooks do not fail with Yarn on Windows.

### Environment Variables

We use [T3 Env](https://env.t3.gg/) to manage environment variables. Create a `.env.local` file in the root of the project and add your environment variables there.

When adding additional environment variables, the schema in `./src/lib/env/client.ts` or `./src/lib/env/server.ts` should be updated accordingly.

### Redirects

To add redirects, update the `redirects` array in `./redirects.ts`. It's typed, so you'll get autocompletion for the properties.

### CSP (Content Security Policy)

The Content Security Policy (CSP) is a security layer that helps to detect and mitigate certain types of attacks, including Cross-Site Scripting (XSS) and data injection attacks. The CSP is implemented in the `next.config.ts` file.

It contains a default and minimal policy that you can customize to fit your application needs. It's a foundation to build upon.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for more information.
