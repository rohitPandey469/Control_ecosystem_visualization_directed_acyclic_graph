import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { EdgeData, GraphData, NodeData } from "../types";

// Define a type that combines NodeData with D3's SimulationNodeDatum
type SimNodeData = NodeData & d3.SimulationNodeDatum;
type SimLinkData = EdgeData & d3.SimulationLinkDatum<SimNodeData>;

interface ForceGraphProps {
  data: GraphData;
}

const ForceGraph: React.FC<ForceGraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    if (!data.nodes.length) return;

    const container = svgRef.current?.parentElement;
    const width = container ? container.clientWidth : 800;
    const height = container ? container.clientHeight : 600;
    
    const svg = d3.select(svgRef.current)
      .attr("width", "100%")  
      .attr("height", "100%") 
      .attr("viewBox", `0 0 ${width} ${height}`) // Preserve aspect ratio
      .style("border", "1px solid black");

    // Cast nodes and links to simulation compatible types
    const nodes = data.nodes as SimNodeData[];
    const links = data.edges as SimLinkData[];

    // Simulation setup with proper type casting
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Draw links
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-width", d => (d.commandInterface ? 3 : 1))
      .attr("stroke-dasharray", d => (d.stateInterface ? "5,5" : "0"));

    // Draw nodes with properly typed drag behavior
    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 10)
      .attr("fill", d => (d.isHardware ? "blue" : "green"))
      .call((d3.drag<SVGCircleElement, SimNodeData>()
        .on("start", (event, d: SimNodeData) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d: SimNodeData) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d: SimNodeData) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })) as any);

    // Node labels
    const text = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text(d => d.label)
      .attr("x", 12)
      .attr("y", 4)
      .attr("font-size", "12px")
      .attr("fill", "black");

    // Simulation tick updates with proper type handling
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as SimNodeData).x!)
        .attr("y1", d => (d.source as SimNodeData).y!)
        .attr("x2", d => (d.target as SimNodeData).x!)
        .attr("y2", d => (d.target as SimNodeData).y!);

      node
        .attr("cx", d => d.x!)
        .attr("cy", d => d.y!);

      text
        .attr("x", d => d.x! + 10)
        .attr("y", d => d.y! + 4);
    });

    return () => {
      simulation.stop();
      svg.selectAll("*").remove();
    };
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default ForceGraph;
