import axios from "axios";

/** ---------- Types ---------- **/

import {BlockchainTx,TxInput,TxOutput,AddressData,GraphData} from "./BlockchainModel"

/** ---------- Constants ---------- **/

const API_BASE = "https://api.blockcypher.com/v1/btc/main/addrs";
const PAGE_LIMIT = 5;

/** ---------- Service ---------- **/

export class BlockCypherService {
    private  lastApiCall: number = 0;
    private  readonly API_DELAY = 12000; // 12 seconds in milliseconds


    private  async enforceRateLimit(): Promise<void> {
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
   * Fetches an address and its transactions from BlockCypher
   */
  async fetchAddressData(address: string, offset = 0): Promise<AddressData> {

    // BlockCypher uses 'before' parameter for pagination with block height, not offset
    // For now, let's use a simpler approach and fetch more transactions initially
    const effectiveLimit = PAGE_LIMIT + offset;
    const url = `${API_BASE}/${address}/full?limit=${effectiveLimit}`;

    try {
        // Enforce rate limiting before making API call
        await this.enforceRateLimit();

      const { data } = await axios.get(url, { timeout: 15000 });

      // Convert BlockCypher's full transaction data to our format
      // Slice the results to simulate pagination (skip 'offset' transactions, take PAGE_LIMIT)
      const allTxs = data.txs || [];
      const paginatedTxs = offset > 0 ? allTxs.slice(offset, offset + PAGE_LIMIT) : allTxs.slice(0, PAGE_LIMIT);
      
      const txs: BlockchainTx[] = paginatedTxs.map((tx: any) => ({
        hash: tx.hash,
        inputs: tx.inputs.map((input: any) => ({
          prev_out: {
            addr: input.addresses?.[0],
            value: input.output_value,
          },
        })),
        out: tx.outputs.map((output: any) => ({
          addr: output.addresses?.[0],
          value: output.value,
        })),
        result: tx.outputs
          .filter((o: any) => o.addresses?.includes(address))
          .reduce((sum: number, o: any) => sum + o.value, 0) -
          tx.inputs
          .filter((i: any) => i.addresses?.includes(address))
          .reduce((sum: number, i: any) => sum + i.output_value, 0),
        time: new Date(tx.confirmed).getTime() / 1000,
      }));

      return {
        address: data.address,
        n_tx: data.n_tx ?? txs.length,
        total_received: data.total_received ?? 0,
        total_sent: data.total_sent ?? 0,
        final_balance: data.balance,
        txs,
      };
    } catch (error: any) {
      console.error("Error fetching BlockCypher data:", error.message);
      throw new Error("Failed to fetch BlockCypher API data");
    }
  }

  /**
   * Converts BlockCypher transactions into react-force-graph format
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

      // Outgoing transfers
      if (isSender) {
        for (const out of tx.out) {
          const outAddr = out.addr;
          if (!outAddr || outAddr === address) continue;
          if (!out.value || out.value <= 0) continue;
          nodeSet.add(outAddr);
          links.push({
            source: address,
            target: outAddr,
            value: out.value / 1e8,
            txHash,
            color: "#ff6666", // red = outgoing
          });
        }
        continue;
      }

      // Incoming transfers
      if (!isSender && isReceiver) {
        for (const inAddr of inputAddrs) {
          nodeSet.add(inAddr);
          links.push({
            source: inAddr,
            target: address,
            value: Math.abs(tx.result ?? 0) / 1e8,
            txHash,
            color: "#00ff88", // green = incoming
          });
        }
      }
    }

    const nodes = Array.from(nodeSet).map((id) => ({
      id,
      name: id,
      val: 3,
    }));

    return { nodes, links };
  }

  /**
   * Full flow: fetch address → build graph
   */
async fetchGraph(address: string, offset = 0): Promise<GraphData> {
    const data = await this.fetchAddressData(address, offset);
    return this.buildGraphData(address, data.txs);
  }

  
}

export const blockCypherService = new BlockCypherService();
