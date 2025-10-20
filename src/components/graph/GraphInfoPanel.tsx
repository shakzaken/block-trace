'use client';

import styles from './GraphInfoPanel.module.css';

interface GraphInfoPanelProps {
  startAddress: string;
  graphData: {
    nodes: any[];
    links: any[];
  };
  logs: string[];
  expanded: Set<string>;
  nodeData?: {
    totalEdges: number;
    neighbors: string[];
    incomingCount: number;
    outgoingCount: number;
    connectedLinks: any[];
  };
  onClearLogs: () => void;
}

export default function GraphInfoPanel({ 
  startAddress, 
  graphData, 
  logs, 
  expanded, 
  nodeData,
  onClearLogs 
}: GraphInfoPanelProps) {
  return (
    <div className={styles.container}>
      
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              📊
            </div>
            <h2 className={styles.headerTitle}>Network Analysis</h2>
          </div>
          <button
            className={styles.clearButton}
            onClick={onClearLogs}
          >
            Clear Log
          </button>
        </div>
      </div>

      <div className={styles.content}>
        
        {/* Current Address Card */}
        {startAddress && (
          <div className={styles.addressCard}>
            <div className={styles.addressHeader}>
              <div className={styles.addressHeaderContent}>
                <span>🏦</span>
                <span className={styles.addressHeaderText}>Active Address</span>
              </div>
            </div>
            <div className={styles.addressBody}>
              <div className={styles.addressDisplay}>
                <p className={styles.addressLabel}>Address</p>
                <p className={styles.addressText}>{startAddress}</p>
              </div>
              
              {/* Stats Grid */}
              <div className={styles.statsGrid}>
                {nodeData ? (
                  // Show node-specific stats when a node is selected
                  <>
                    <div className={`${styles.statCard} ${styles.statCardNodes}`}>
                      <div className={`${styles.statNumber} ${styles.statNumberNodes}`}>{nodeData.totalEdges}</div>
                      <div className={`${styles.statLabel} ${styles.statLabelNodes}`}>Connected Edges</div>
                    </div>
                    <div className={`${styles.statCard} ${styles.statCardLinks}`}>
                      <div className={`${styles.statNumber} ${styles.statNumberLinks}`}>{nodeData.neighbors.length}</div>
                      <div className={`${styles.statLabel} ${styles.statLabelLinks}`}>Connected Addresses</div>
                    </div>
                    <div className={`${styles.statCard} ${styles.statCardNodes}`}>
                      <div className={`${styles.statNumber} ${styles.statNumberNodes}`}>{nodeData.incomingCount}</div>
                      <div className={`${styles.statLabel} ${styles.statLabelNodes}`}>Incoming Txns</div>
                    </div>
                    <div className={`${styles.statCard} ${styles.statCardLinks}`}>
                      <div className={`${styles.statNumber} ${styles.statNumberLinks}`}>{nodeData.outgoingCount}</div>
                      <div className={`${styles.statLabel} ${styles.statLabelLinks}`}>Outgoing Txns</div>
                    </div>
                  </>
                ) : (
                  // Show general graph stats when no specific node is selected
                  <>
                    <div className={`${styles.statCard} ${styles.statCardNodes}`}>
                      <div className={`${styles.statNumber} ${styles.statNumberNodes}`}>{graphData.nodes.length}</div>
                      <div className={`${styles.statLabel} ${styles.statLabelNodes}`}>Address Nodes</div>
                    </div>
                    <div className={`${styles.statCard} ${styles.statCardLinks}`}>
                      <div className={`${styles.statNumber} ${styles.statNumberLinks}`}>{graphData.links.length}</div>
                      <div className={`${styles.statLabel} ${styles.statLabelLinks}`}>Transaction Edges</div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Connected Addresses (Neighbors) */}
              {nodeData && nodeData.neighbors.length > 0 && (
                <div className={styles.neighborsCard}>
                  <div className={styles.neighborsHeader}>
                    <span>🔗</span>
                    <span className={styles.neighborsLabel}>Connected Addresses</span>
                  </div>
                  <div className={styles.neighborsList}>
                    {nodeData.neighbors.slice(0, 5).map((neighbor, index) => (
                      <div key={neighbor} className={styles.neighborItem}>
                        <span className={styles.neighborIndex}>{index + 1}</span>
                        <span className={styles.neighborAddress}>{neighbor}</span>
                      </div>
                    ))}
                    {nodeData.neighbors.length > 5 && (
                      <div className={styles.neighborsMore}>
                        +{nodeData.neighbors.length - 5} more addresses
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Expanded Addresses */}
              {expanded.size > 1 && (
                <div className={styles.exploredCard}>
                  <div className={styles.exploredHeader}>
                    <span>🔍</span>
                    <span className={styles.exploredLabel}>Explored</span>
                  </div>
                  <div className={styles.exploredCount}>{expanded.size - 1} additional addresses</div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Activity Log */}
        <div className={styles.logCard}>
          <div className={styles.logHeader}>
            <div className={styles.logHeaderContent}>
              <span>📋</span>
              <span className={styles.logHeaderText}>Activity Log</span>
              <div className={styles.logBadge}>
                {logs.length} events
              </div>
            </div>
          </div>
          
          <div className={styles.logBody}>
            {logs.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📝</div>
                <p className={styles.emptyTitle}>No activity yet</p>
                <p className={styles.emptySubtext}>Start exploring addresses to see logs</p>
              </div>
            ) : (
              <div className={styles.logList}>
                {logs.map((line, i) => {
                  const isSuccess = line.includes('✅');
                  const isError = line.includes('❌');
                  const isFetching = line.includes('Fetching');
                  
                  let logEntryClass = styles.logEntryDefault;
                  if (isSuccess) logEntryClass = styles.logEntrySuccess;
                  else if (isError) logEntryClass = styles.logEntryError;
                  else if (isFetching) logEntryClass = styles.logEntryFetching;
                  
                  return (
                    <div
                      key={i}
                      className={`${styles.logEntry} ${logEntryClass}`}
                    >
                      <div className={styles.logEntryContent}>
                        <span className={styles.logEntryNumber}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className={styles.logEntryText}>{line}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Instructions Card */}
        <div className={styles.instructionsCard}>
          <div className={styles.instructionsHeader}>
            <span>💡</span>
            <span className={styles.instructionsHeaderText}>How to Use</span>
          </div>
          <div className={styles.instructionsList}>
            <div className={styles.instructionItem}>
              <span className={styles.instructionBullet}>•</span>
              <span>Click on any address node to explore its transactions</span>
            </div>
            <div className={styles.instructionItem}>
              <span className={styles.instructionBullet}>•</span>
              <span>Red arrows = outgoing transactions</span>
            </div>
            <div className={styles.instructionItem}>
              <span className={styles.instructionBullet}>•</span>
              <span>Green arrows = incoming transactions</span>
            </div>
            <div className={styles.instructionItem}>
              <span className={styles.instructionBullet}>•</span>
              <span>Gray arrows = inter-node connections</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}