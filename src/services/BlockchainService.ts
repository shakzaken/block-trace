// src/services/blockchainService.ts
import axios from "axios";

/** ---------- Types ---------- **/
import {BlockchainTx,TxInput,TxOutput,AddressData,GraphData} from "./BlockchainModel"
import { blockCypherService } from "./BlockCypherService";

/** ---------- Service ---------- **/

const API_BASE = "https://blockchain.info";
const PAGE_LIMIT = 10;

export class BlockchainService {
  // Rate limiting: track last API call time
  private  lastApiCall: number = 0;
  private  readonly API_DELAY = 12000; // 12 seconds in milliseconds

  /**
   * Enforces 12-second delay between API calls
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastApiCall;
    
    if (timeSinceLastCall < this.API_DELAY) {
      const waitTime = this.API_DELAY - timeSinceLastCall;
      console.log(`Rate limiting: waiting ${Math.ceil(waitTime / 1000)} seconds before next API call...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastApiCall = Date.now();
  }

  /**
   * Fetches an address and its transactions from Blockchain.com API
   */
   async fetchAddressData(address: string, offset = 0): Promise<AddressData> {
    // Enforce rate limiting before making API call
    await this.enforceRateLimit();
    
    const url = `${API_BASE}/rawaddr/${address}?limit=${PAGE_LIMIT}&offset=${offset}&cors=true`;

    try {
      const { data } = await axios.get<AddressData>(url, { timeout: 15000 });
      return data;
    } catch (error) {
      console.error("Error fetching address data:", error);
      throw new Error("Failed to fetch blockchain data.");
    }
  }

  /**
   * Converts transactions into graphData for react-force-graph
   */
   buildGraphData(address: string, txs: BlockchainTx[]): GraphData {
    const links: GraphData["links"] = [];
    const nodeSet = new Set<string>([address]);

    for (const tx of txs) {
      const txHash = tx.hash;

      const inputAddrs = tx.inputs
        .map((i) => i.prev_out?.addr)
        .filter((a): a is string => Boolean(a));

      const outputAddrs = tx.out
        .map((o) => o.addr)
        .filter((a): a is string => Boolean(a));

      const isSender = inputAddrs.includes(address);
      const isReceiver = outputAddrs.includes(address);

      // CASE 1: Outgoing transactions
      if (isSender) {
        for (const out of tx.out) {
          const outAddr = out.addr;
          if (!outAddr || outAddr === address) continue;
          if (!out.value || out.value <= 0) continue;

          nodeSet.add(outAddr);
          links.push({
            source: address,
            target: outAddr,
            value: out.value / 1e8, // convert to BTC
            txHash,
            color: "#ff6666", // red for outgoing
          });
        }
        continue;
      }

      // CASE 2: Incoming transactions
      if (!isSender && isReceiver) {
        for (const inAddr of inputAddrs) {
          nodeSet.add(inAddr);
          links.push({
            source: inAddr,
            target: address,
            value: Math.abs(tx.result ?? 0) / 1e8,
            txHash,
            color: "#00ff88", // green for incoming
          });
        }
      }
    }

    // Build node list for react-force-graph
    const nodes = Array.from(nodeSet).map((id) => ({
      id,
      name: id,
      val: 3,
    }));

    return { nodes, links };
  }

  /**
   * Full flow: fetch + build graph data
   */
  async fetchGraph(address: string, offset = 0): Promise<GraphData> {
    // const data = await this.fetchAddressData(address, offset);
    // return this.buildGraphData(address, data.txs);
    
    return blockCypherService.fetchGraph(address, offset);
  }

  /**
   * Development helper: returns fake graph data to avoid API rate limits
   */
  async fetchFakeGraph(address: string, offset = 0): Promise<GraphData> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    const nodes = [
      { id: address, name: address, val: 5 }, // Main address (larger node)
    ];
    
    const links: GraphData["links"] = [];
    
    // Generate 9 additional random addresses
    const fakeAddresses: string[] = [];
    for (let i = 1; i <= 9; i++) {
      const fakeAddr = this.generateFakeAddress();
      fakeAddresses.push(fakeAddr);
      nodes.push({
        id: fakeAddr,
        name: fakeAddr,
        val: Math.random() * 3 + 1, // Random node size
      });
    }
    
    // Create random connections between nodes
    const numConnections = Math.floor(Math.random() * 8) + 8; // 8-15 connections
    
    for (let i = 0; i < numConnections; i++) {
      const isOutgoing = Math.random() > 0.5;
      const targetIndex = Math.floor(Math.random() * fakeAddresses.length);
      const targetAddr = fakeAddresses[targetIndex]!; // Non-null assertion since we know the index is valid
      const value = Math.random() * 5 + 0.001; // Random BTC amount
      const txHash = this.generateFakeTxHash();
      
      if (isOutgoing) {
        links.push({
          source: address,
          target: targetAddr,
          value,
          txHash,
          color: "#ff6666", // red for outgoing
        });
      } else {
        links.push({
          source: targetAddr,
          target: address,
          value,
          txHash,
          color: "#00ff88", // green for incoming
        });
      }
    }
    
    // Add some inter-node connections for a more realistic graph
    for (let i = 0; i < 3; i++) {
      const sourceIndex = Math.floor(Math.random() * fakeAddresses.length);
      const targetIndex = Math.floor(Math.random() * fakeAddresses.length);
      
      if (sourceIndex !== targetIndex) {
        links.push({
          source: fakeAddresses[sourceIndex]!,
          target: fakeAddresses[targetIndex]!,
          value: Math.random() * 2 + 0.001,
          txHash: this.generateFakeTxHash(),
          color: "#aaa", // gray for inter-node connections
        });
      }
    }
    
    return { nodes, links };
  }
  
  /**
   * Helper: Generate a fake Bitcoin address
   */
  private generateFakeAddress(): string {
    const prefixes = ['1', '3', 'bc1'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]!;
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let address = prefix;
    
    const length = prefix === 'bc1' ? 42 : 34;
    for (let i = prefix.length; i < length; i++) {
      address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return address;
  }
  
  /**
   * Helper: Generate a fake transaction hash
   */
  private  generateFakeTxHash(): string {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
  }
}






export const blockchainService = new BlockchainService();