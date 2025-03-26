import { useEffect, useState, useCallback } from 'react';
import { GraphData } from '../types';

const WS_URL = 'ws://localhost:5001';

export function useWebSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === 'graphUpdate') {
          setGraphData(message.payload);
          console.log('Received graph update:', message.payload);
        }
        // You could handle other message types here
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  // Request the current graph
  const requestGraph = useCallback(() => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({ type: 'getGraph' }));
    }
  }, [socket, isConnected]);

  // Clear the graph
  const clearGraph = useCallback(() => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({ type: 'clearGraph' }));
    }
  }, [socket, isConnected]);

  return {
    isConnected,
    graphData,
    requestGraph,
    clearGraph
  };
}