import React from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  Node, 
  Edge,
  NodeTypes,
  EdgeTypes
} from 'reactflow';
import 'reactflow/dist/style.css';

import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import { GraphData, NodeData, EdgeData } from '../types';

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

interface DAGVisualizationProps {
  graphData: GraphData;
}

const DAGVisualization: React.FC<DAGVisualizationProps> = ({ graphData }) => {
  // Convert backend nodes to ReactFlow nodes
  const initialNodes: Node[] = graphData.nodes.map((node: NodeData) => ({
    id: node.id,
    type: 'custom',
    data: node,
    position: { x: 0, y: 0 }, // We'll layout the nodes in useEffect
  }));

  // Convert backend edges to ReactFlow edges
  const initialEdges: Edge[] = graphData.edges.map((edge: EdgeData) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: 'custom',
    data: edge,
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when graphData changes
  React.useEffect(() => {
    // Simple automatic layout
    const layoutNodes = graphData.nodes.map((node, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      return {
        id: node.id,
        type: 'custom',
        data: node,
        position: { x: col * 250 + 50, y: row * 150 + 50 },
      };
    });

    setNodes(layoutNodes);
    setEdges(graphData.edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'custom',
      data: edge,
    })));
  }, [graphData, setNodes, setEdges]);

  return (
    <div style={{ width: '100%', height: '80vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default DAGVisualization;