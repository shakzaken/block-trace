'use client';

import { useState } from 'react';
import styles from './WalletAddress.module.css';
import { blockCypherService } from '@/services/BlockCypherService';
import { useGraph, useGraphActions } from '@/context/GraphContext';

export default function WalletAddress() {
  const [inputValue, setInputValue] = useState('');

  // Validate Bitcoin wallet address format
  const validateWalletAddress = (address: string): boolean => {
    // Basic Bitcoin address validation
    if (!address || address.length < 26 || address.length > 35) {
      return false;
    }
    
    // Check if it starts with valid Bitcoin address prefixes
    const validPrefixes = ['1', '3', 'bc1'];
    return validPrefixes.some(prefix => address.startsWith(prefix));
  };
  
  // Use the graph context
  const { state } = useGraph();
  const { setAddress, setGraphData, setLoading, setError } = useGraphActions();
  
  const { address, graphData, loading, error } = state;
  
  const LIMIT = 10;
  const OFFSET = 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    // Validate wallet address format
    if (!validateWalletAddress(inputValue)) {
      setError('Please enter a valid Bitcoin wallet address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Set the address in the global context
      setAddress(inputValue);
      
      // Fetch the graph data
      const graph = await blockCypherService.fetchGraph(inputValue, OFFSET);
      console.log(graph);
      
      // Set the graph data in the global context
      setGraphData(graph);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="walletInput" className={styles.label}>
            Enter Bitcoin Wallet Address:
          </label>
          <input
            id="walletInput"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g., 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
            className={styles.input}
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className={styles.button}
          disabled={loading || !inputValue.trim()}
        >
          {loading ? 'Loading...' : 'Get Wallet Info'}
        </button>
      </form>

      {/* Display current address from context */}
      {address && (
        <div className={styles.currentAddress}>
          <strong>Current Address:</strong> {address}
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}