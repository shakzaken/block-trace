import WalletAddress from '../components/wallet/WalletAddress';
import BlockchainGraph from '../components/graph/Graph';

export default function Home() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
        Bitcoin Blockchain Visualizer
      </h1>
      
      {/* Address Input Component */}
      <WalletAddress />
      
      {/* Graph Component - will update when address is submitted */}
      <BlockchainGraph />
    </main>
  );
}
