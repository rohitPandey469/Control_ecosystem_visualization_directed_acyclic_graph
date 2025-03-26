import * as d3 from 'd3';
import { NodeData, EdgeData } from '../../types';

export function createForceSimulation(
  nodes: NodeData[],
  edges: EdgeData[],
  width: number,
  height: number
) {
  // Create the simulation
  const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
    .force('link', d3.forceLink(edges)
      .id((d: any) => d.id)
      .distance(150)
      .strength(1))
    .force('charge', d3.forceManyBody().strength(-500))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('x', d3.forceX(width / 2).strength(0.05))
    .force('y', d3.forceY(height / 2).strength(0.05));
  
  // Cool down the simulation after initial positioning
  // This will make the simulation stop after a short time
  simulation.alpha(1).alphaDecay(0.0228);
  
  return simulation;
}