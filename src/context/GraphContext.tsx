'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';

interface GraphState {
  address: string;
  graphData: {
    nodes: any[];
    links: any[];
  } | null;
  loading: boolean;
  error: string | null;
}

type GraphAction = 
  | { type: 'SET_ADDRESS'; payload: string }
  | { type: 'SET_GRAPH_DATA'; payload: { nodes: any[]; links: any[] } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

const initialState: GraphState = {
  address: '',
  graphData: null,
  loading: false,
  error: null,
};

const graphReducer = (state: GraphState, action: GraphAction): GraphState => {
  switch (action.type) {
    case 'SET_ADDRESS':
      return { ...state, address: action.payload };
    case 'SET_GRAPH_DATA':
      return { ...state, graphData: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const GraphContext = createContext<{
  state: GraphState;
  dispatch: React.Dispatch<GraphAction>;
} | null>(null);

export function GraphProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(graphReducer, initialState);
  
  return (
    <GraphContext.Provider value={{ state, dispatch }}>
      {children}
    </GraphContext.Provider>
  );
}

export function useGraph() {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error('useGraph must be used within GraphProvider');
  }
  return context;
}

// Helper hook with actions for easier usage
export function useGraphActions() {
  const { dispatch } = useGraph();
  
  return {
    setAddress: (address: string) => 
      dispatch({ type: 'SET_ADDRESS', payload: address }),
    setGraphData: (data: { nodes: any[]; links: any[] }) => 
      dispatch({ type: 'SET_GRAPH_DATA', payload: data }),
    setLoading: (loading: boolean) => 
      dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error: string | null) => 
      dispatch({ type: 'SET_ERROR', payload: error }),
    reset: () => 
      dispatch({ type: 'RESET' }),
  };
}