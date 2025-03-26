import * as d3 from 'd3';
import { EdgeData } from '../../types';

export function renderEdges(
  container: d3.Selection<SVGGElement, unknown, null, undefined>,
  edges: EdgeData[]
) {
  // Create the links (edges)
  const link = container.append('g')
    .selectAll('path')
    .data(edges)
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('stroke', (d: EdgeData) => {
      if (d.commandInterface) return '#e57373';
      if (d.stateInterface) return '#64b5f6';
      return '#90a4ae';
    })
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .attr('marker-end', (d: EdgeData) => {
      if (d.commandInterface) return 'url(#arrowhead-command)';
      if (d.stateInterface) return 'url(#arrowhead-state)';
      return 'url(#arrowhead-default)';
    });
  
  // Add edge labels
  const edgeLabels = container.append('g')
    .selectAll('text')
    .data(edges)
    .enter()
    .append('text')
    .attr('class', 'edge-label')
    .attr('font-size', 10)
    .attr('text-anchor', 'middle')
    .text((d: EdgeData) => {
      if (d.commandInterface) return 'command';
      if (d.stateInterface) return 'state';
      return '';
    });
  
  return { link, edgeLabels };
}