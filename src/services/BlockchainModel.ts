export interface TxInput {
  prev_out?: {
    addr?: string;
    value?: number;
  };
}

export interface TxOutput {
  addr?: string;
  value?: number;
}

export interface BlockchainTx {
  hash: string;
  inputs: TxInput[];
  out: TxOutput[];
  result?: number; // net change in satoshis for this address
  time?: number;
}

export interface AddressData {
  address: string;
  n_tx: number;
  total_received: number;
  total_sent: number;
  final_balance: number;
  txs: BlockchainTx[];
}

export interface GraphData {
  nodes: { id: string; name?: string; val?: number }[];
  links: { source: string; target: string; value?: number; txHash?: string; color?: string }[];
}