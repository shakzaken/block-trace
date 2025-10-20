"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { BlockchainService } from "@/services/BlockchainService";
import { GraphData } from "@/services/blockchainModel";
import { Button } from "../Button";
import { useGraph } from "@/context/GraphContext";
import GraphInfoPanel from "./GraphInfoPanel";

// Dynamically import to avoid SSR issues in Next.js
const ForceGraph2D = dynamic(
  () => import("react-force-graph-2d"),
  { ssr: false }
);

export default function BlockchainGraph() {
  const { state, dispatch } = useGraph();
  const { address: startAddress, graphData: contextGraphData, loading: contextLoading, error: contextError } = state;
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(new Set<string>());
  const [activeAddress, setActiveAddress] = useState<string | null>(null);

  // Load initial graph when context data changes
  useEffect(() => {
    if (contextGraphData && contextGraphData.nodes && contextGraphData.links) {
      setGraphData(contextGraphData);
      if (startAddress) {
        setExpanded(new Set([startAddress]));
        setActiveAddress(startAddress); // Set initial active address
      }
    }
  }, [contextGraphData, startAddress]);

  // Load initial graph for the starting address
  useEffect(() => {
    if (startAddress && !expanded.has(startAddress)) {
      loadAddress(startAddress);
      setActiveAddress(startAddress); // Set as active when first loaded
    }
  }, [startAddress]);

  async function loadAddress(address: string) {
    if (expanded.has(address)) return; // already loaded

    setLoading(true);
    setError(null);
    setLogs((prev) => [...prev, `Fetching ${address} ...`]);

    try {
      const data = await BlockchainService.fetchGraph(address);
      setLogs((prev) => [...prev, `✅ Loaded ${data.nodes.length} nodes, ${data.links.length} links for ${address}`]);

      // Merge with existing graph data
      setGraphData((prev) => mergeGraphData(prev, data));

      // Mark as expanded
      setExpanded((prev) => new Set([...prev, address]));
    } catch (err) {
      console.error(err);
      setError(`Failed to fetch data for ${address}`);
      setLogs((prev) => [...prev, `❌ Error fetching ${address}`]);
    } finally {
      setLoading(false);
    }
  }

  // Helper: merge new nodes/links into existing graph
  function mergeGraphData(oldGraph: GraphData, newGraph: GraphData): GraphData {
    const existingNodes = new Set(oldGraph.nodes.map((n) => n.id));
    const mergedNodes = [
      ...oldGraph.nodes,
      ...newGraph.nodes.filter((n) => !existingNodes.has(n.id)),
    ];

    const existingLinks = new Set(
      oldGraph.links.map((l) => `${l.source}->${l.target}->${l.txHash}`)
    );
    const mergedLinks = [
      ...oldGraph.links,
      ...newGraph.links.filter(
        (l) => !existingLinks.has(`${l.source}->${l.target}->${l.txHash}`)
      ),
    ];

    return { nodes: mergedNodes, links: mergedLinks };
  }

  // Helper: get data about a specific node
  function getNodeData(address: string) {
    // Find connected links (both incoming and outgoing)
    const connectedLinks = graphData.links.filter(
      (link) => link.source === address || link.target === address
    );
    
    // Get neighbors (connected addresses)
    const neighbors = new Set<string>();
    connectedLinks.forEach((link) => {
      if (link.source === address) neighbors.add(link.target as string);
      if (link.target === address) neighbors.add(link.source as string);
    });
    
    // Separate incoming and outgoing links
    const incomingLinks = connectedLinks.filter((link) => link.target === address);
    const outgoingLinks = connectedLinks.filter((link) => link.source === address);
    
    return {
      totalEdges: connectedLinks.length,
      neighbors: Array.from(neighbors),
      incomingCount: incomingLinks.length,
      outgoingCount: outgoingLinks.length,
      connectedLinks
    };
  }

  // Handle node click - set as active address and load more data if needed
  function handleNodeClick(node: any) {
    const nodeId = node.id;
    setActiveAddress(nodeId);
    setLogs((prev) => [...prev, `🎯 Selected address: ${nodeId}`]);
    
    // Load more data for this node if not already expanded
    if (!expanded.has(nodeId)) {
      loadAddress(nodeId);
    }
  }

  if (!startAddress) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl">
        <div className="text-center text-gray-500">
          <h2 className="text-xl font-semibold mb-2">Blockchain Graph Visualization</h2>
          <p>Enter a wallet address above to see the transaction graph.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* ---- Graph Area ---- */}
      <div className="flex-shrink-0 w-full lg:w-[400px] bg-white border-2 border-gray-200 rounded-xl p-4 relative min-h-[700px]">
        {loading && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center text-gray-800 text-lg rounded-xl border">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              Loading...
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-red-50/95 flex flex-col items-center justify-center text-red-800 text-center p-4 rounded-xl border border-red-200">
            <p className="mb-4">{error}</p>
            <Button onClick={() => loadAddress(startAddress)}>Retry</Button>
          </div>
        )}

        <ForceGraph2D
          graphData={graphData}
          width={1000}
          height={700}
          nodeLabel={(node: any) => node.id}
          nodeAutoColorBy="id"
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
          linkWidth={(link: any) => Math.max(1, link.value * 2)}
          linkColor={(link: any) => link.color || "#666"}
          backgroundColor="#ffffff"
          onNodeClick={handleNodeClick} // Use new click handler
          onLinkClick={(link: any) => {
            setLogs((prev) => [
              ...prev,
              `🔗 Clicked tx: ${link.txHash} (${link.source} → ${link.target})`,
            ]);
          }}
        />
      </div>

      {/* ---- Enhanced Info Panel ---- */}
      <div className="flex-1 min-w-0">
        <GraphInfoPanel
          startAddress={activeAddress || startAddress}
          graphData={graphData}
          logs={logs}
          expanded={expanded}
          nodeData={activeAddress ? getNodeData(activeAddress) : undefined}
          onClearLogs={() => setLogs([])}
        />
      </div>
    </div>
  );
}
