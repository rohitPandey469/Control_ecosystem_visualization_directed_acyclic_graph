import * as d3 from 'd3';

export function createArrowMarkers(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
  const defs = svg.append('defs');
  
  // Add markers for different edge types
  ['default', 'command', 'state'].forEach(type => {
    const color = type === 'command' ? '#e57373' : 
                 type === 'state' ? '#64b5f6' : '#90a4ae';
    
    defs.append('marker')
      .attr('id', `arrowhead-${type}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', color);
  });
}