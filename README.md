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





### Requirements

- Node.js >= 20
- pnpm 9





