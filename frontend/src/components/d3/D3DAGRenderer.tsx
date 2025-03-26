import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { GraphData } from '../../types';
import { createArrowMarkers } from './markers';
import { renderEdges } from './edges';
import { renderNodes } from './nodes';
import { createForceSimulation } from './simulation';

interface D3DAGRendererProps {
  svgRef: React.RefObject<SVGSVGElement>;
  graphData: GraphData;
  dimensions: { width: number; height: number };
}

const D3DAGRenderer: React.FC<D3DAGRendererProps> = ({ 
  svgRef, 
  graphData, 
  dimensions 
}) => {
  useEffect(() => {
    if (!svgRef.current || !graphData.nodes.length) return;
    
    const { width, height } = dimensions;
    
    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Set up SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    
    // Create a container for all elements
    const container = svg.append('g');
    
    // Add zoom and pan behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });
    
    svg.call(zoom as any);
    
    // Create arrow markers
    createArrowMarkers(svg);
    
    // Create the simulation
    const simulation = createForceSimulation(graphData.nodes, graphData.edges, width, height);
    
    // Render edges and get the edge elements
    const { link, edgeLabels } = renderEdges(container, graphData.edges);
    
    // Render nodes and set up interactions
    const node = renderNodes(container, graphData.nodes, simulation, graphData.edges, link);
    
    // Update positions on each tick of the simulation
    simulation.on('tick', () => {
      link.attr('d', (d: any) => {
        return `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`;
      });
      
      edgeLabels.attr('transform', (d: any) => {
        const x = (d.source.x + d.target.x) / 2;
        const y = (d.source.y + d.target.y) / 2;
        return `translate(${x},${y})`;
      });
      
      node.attr('transform', (d: any) => `translate(${d.x - 75},${d.y - 15})`);
    });
    
    // Fit graph to view on first render
    const fitGraph = () => {
      if (!svgRef.current) return;
      const bounds = container.node()?.getBBox();
      
      if (bounds) {
        const dx = bounds.width;
        const dy = bounds.height;
        const x = bounds.x + dx / 2;
        const y = bounds.y + dy / 2;
        
        // Calculate scale to fit graph with padding
        const scale = 0.9 / Math.max(dx / width, dy / height);
        const translate = [width / 2 - scale * x, height / 2 - scale * y];
        
        svg.transition()
          .duration(750)
          .call(
            zoom.transform as any,
            d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
          );
      }
    };
    
    // Call fit graph after simulation has settled
    setTimeout(fitGraph, 1000);
    
    return () => {
      // Clean up simulation when component unmounts
      simulation.stop();
    };
  }, [svgRef, graphData, dimensions]);
  
  // This component doesn't render anything directly
  return null;
};

export default D3DAGRenderer;