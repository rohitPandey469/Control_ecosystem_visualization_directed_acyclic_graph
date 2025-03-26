import * as d3 from 'd3';
import { NodeData, EdgeData } from '../../types';

export function renderNodes(
  container: d3.Selection<SVGGElement, unknown, null, undefined>,
  nodes: NodeData[],
  simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>,
  edges: EdgeData[],
  link: d3.Selection<SVGPathElement, EdgeData, SVGGElement, unknown>
) {
  // Functions for drag behavior
  function dragStarted(event: any) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }
  
  function dragged(event: any) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }
  
  function dragEnded(event: any) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  // Create the nodes
  const node = container.append('g')
    .selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .call(d3.drag<SVGGElement, NodeData>()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded) as any);
  
  // Add node backgrounds
  node.append('rect')
    .attr('width', 150)
    .attr('height', (d: NodeData) => {
      // Dynamic height based on metadata
      const metadataCount = Object.keys(d.metadata).length;
      return 30 + (metadataCount * 15);
    })
    .attr('rx', 5)
    .attr('ry', 5)
    .attr('fill', (d: NodeData) => d.isHardware ? '#ff8a65' : '#81c784')
    .attr('stroke', '#666')
    .attr('stroke-width', 1);
  
  // Add node labels
  node.append('text')
    .attr('x', 75)
    .attr('y', 15)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('font-weight', 'bold')
    .text((d: NodeData) => d.label);
  
  // Add metadata display
  node.each(function(d: NodeData) {
    const metadata = d.metadata;
    const nodeGroup = d3.select(this);
    
    Object.entries(metadata).forEach(([key, value], index) => {
      nodeGroup.append('text')
        .attr('x', 10)
        .attr('y', 35 + (index * 15))
        .attr('font-size', 10)
        .text(`${key}: ${JSON.stringify(value)}`);
    });
  });
  
  // Highlight connected paths
  node.on('mouseover', function(event, d) {
    // Find connected nodes and edges
    const connectedNodeIds = new Set<string>([d.id]);
    const connectedEdgeIds = new Set<string>();
    
    // Find all connections (both upstream and downstream)
    const findConnections = (nodeId: string, direction: 'up' | 'down') => {
      if (direction === 'down') {
        edges.forEach(edge => {
          if (edge.source === nodeId) {
            connectedEdgeIds.add(edge.id);
            if (!connectedNodeIds.has(edge.target)) {
              connectedNodeIds.add(edge.target);
              findConnections(edge.target, 'down');
            }
          }
        });
      } else {
        edges.forEach(edge => {
          if (edge.target === nodeId) {
            connectedEdgeIds.add(edge.id);
            if (!connectedNodeIds.has(edge.source)) {
              connectedNodeIds.add(edge.source);
              findConnections(edge.source, 'up');
            }
          }
        });
      }
    };
    
    findConnections(d.id, 'up');
    findConnections(d.id, 'down');
    
    // Highlight connected nodes and edges
    node.style('opacity', (d: NodeData) => 
      connectedNodeIds.has(d.id) ? 1 : 0.3);
    
    link.style('opacity', (d: EdgeData) => 
      connectedEdgeIds.has(d.id) ? 1 : 0.1)
      .style('stroke-width', (d: EdgeData) => 
        connectedEdgeIds.has(d.id) ? 3 : 1);
  })
  .on('mouseout', function() {
    // Reset highlighting
    node.style('opacity', 1);
    link.style('opacity', 0.8)
      .style('stroke-width', 2);
  });
  
  return node;
}