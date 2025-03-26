import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { GraphData, NodeData } from "../types";

interface ForceGraphProps {
  data: GraphData;
}

const TreeGraph: React.FC<ForceGraphProps> = ({ data }) => {
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
      
    // Clear previous render
    svg.selectAll("*").remove();

    // Create a hierarchical structure from the graph data
    // First, identify root nodes (nodes with no incoming edges)
    // Define extended node type that includes children
    interface NodeWithChildren extends NodeData {
      children: NodeWithChildren[];
    }
    
    const nodeMap = new Map<string, NodeWithChildren>(
      data.nodes.map(node => [node.id, { ...node, children: [] as NodeWithChildren[] }])
    );
    const hasIncomingEdge = new Set();
    
    data.edges.forEach(edge => {
      hasIncomingEdge.add(edge.target);
      
      const sourceNode = nodeMap.get(edge.source);
      if (sourceNode) {
        const targetNode = nodeMap.get(edge.target);
        if (targetNode) {
          if (!sourceNode.children) sourceNode.children = [];
          sourceNode.children.push(targetNode);
        }
      }
    });
    
    // Find root nodes (nodes with no incoming edges)
    const rootNodes = Array.from(nodeMap.values())
      .filter(node => !hasIncomingEdge.has(node.id));
    
    // If no clear root is found, use first node as root
    const rootNode = rootNodes.length > 0 ? rootNodes[0] : nodeMap.get(data.nodes[0].id);
    
    // Create a tree layout
    const treeLayout = d3.tree<NodeWithChildren>()
      .size([width - 100, height - 100])
      .nodeSize([120, 180]); // Adjust node spacing
    
    // Convert to hierarchy with proper typing
    const root = d3.hierarchy(rootNode as NodeWithChildren);
    
    // Apply the tree layout
    const treeData = treeLayout(root);
    
    // Add zoom capability
    const zoom = d3.zoom()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        mainGroup.attr("transform", event.transform);
      });
      
    svg.call(zoom as any);
    
    // Add a group for all elements
    const mainGroup = svg.append("g")
      .attr("transform", `translate(50, 50)`);
    
    // Create links
    const defs = svg.append("defs");
    
    ["default", "command", "state"].forEach(type => {
      const color = type === "command" ? "red" : type === "state" ? "green" : "#999";
      defs.append("marker")
      .attr("id", `arrow-${type}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15.75) // Position the arrow away from the target node
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", color);
    });
    
    mainGroup.append("g")
      .attr("fill", "none")
      .attr("stroke", "#999")
      .selectAll("path")
      .data(treeData.links())
      .enter().append("path")
      .attr("d", d3.linkHorizontal<d3.HierarchyLink<any>, [number, number]>()
      .x(d => (d as any).y) // Swap x and y for horizontal layout
      .y(d => (d as any).x))
      .attr("stroke", d => {
      const sourceId = (d.source as any).data.id;
      const targetId = (d.target as any).data.id;
      const edge = data.edges.find(e => 
      e.source === sourceId && e.target === targetId);
      
      if (edge?.commandInterface) return "red";
      if (edge?.stateInterface) return "green";
      return "#999";
      })
      .attr("marker-end", d => {
      const sourceId = (d.source as any).data.id;
      const targetId = (d.target as any).data.id;
      const edge = data.edges.find(e => 
      e.source === sourceId && e.target === targetId);
      
      if (edge?.commandInterface) return "url(#arrow-command)";
      if (edge?.stateInterface) return "url(#arrow-state)";
      return "url(#arrow-default)";
      })
      .attr("stroke-width", 2.5);

    // Add link metadata (instead of command/state labels)
    mainGroup.append("g")
      .selectAll("g")
      .data(treeData.links())
      .enter()
      .append("g")
      .each(function(d) {
      const sourceId = (d.source as any).data.id;
      const targetId = (d.target as any).data.id;
      const edge = data.edges.find(e => 
        e.source === sourceId && e.target === targetId);
      
      const g = d3.select(this);
      const xPos = (d.source.y + d.target.y) / 2;
      const yPos = (d.source.x + d.target.x) / 2;
      
      if (edge?.metadata && Object.keys(edge.metadata).length > 0) {
        // Display all metadata entries
        Object.entries(edge.metadata).forEach(([key, value], index) => {
        let textData = `${key}: ${value}`;
        if(textData.length > 60) {
          textData = textData.substring(0, 58) + "...";
        }
        
        g.append("text")
          .attr("x", xPos)
          .attr("y", yPos + (index * 12) - 5)
          .attr("text-anchor", "middle")
          .attr("font-size", "9px")
          .attr("font-style", "italic")
          .attr("fill", "black")
          .text(textData);
        });
      }
      });
      
    // Create node groups
    const nodeGroups = mainGroup.append("g")
      .selectAll("g")
      .data(treeData.descendants())
      .enter().append("g")
      .attr("transform", d => `translate(${d.y},${d.x})`) // Swap x and y for horizontal layout
      .attr("cursor", "pointer")
      .on("mouseover", function (event, d){
          d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", 12)
          .attr("stroke-width", 2);
        
          const metadataStr = Object.entries((d.data as any).metadata || {})
            .map(([key, val]) => `${key}: ${val}`)
            .join('<br/>');

            let tooltip : any = d3.select("#tree-tooltip");
            if (tooltip.empty()) {
              tooltip = d3.select("body").append("div")
                .attr("id", "tree-tooltip")
                .style("position", "absolute")
                .style("background", "white")
                .style("padding", "10px")
                .style("border-radius", "5px")
                .style("box-shadow", "0 0 10px rgba(0,0,0,0.25)")
                .style("pointer-events", "none")
                .style("opacity", 0);
            }

            tooltip
            .html(`<strong>${(d.data as any).label}</strong><br/>${metadataStr}`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`)
            .transition()
            .duration(200)
            .style("opacity", 1);
      })
      .on("mouseout", function() {
        // Reset node appearance
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", 10)
          .attr("stroke-width", 1.5);
        
        // Hide tooltip
        d3.select("#tree-tooltip")
          .transition()
          .duration(200)
          .style("opacity", 0);
      })
      .on("click", function(event, d) {
        // Toggle detailed view when clicked
        event.stopPropagation();
        
        // Remove any existing detail panels
        d3.select("#node-detail-panel").remove();
        
        // Create a detailed panel with all metadata
        const detailPanel = svg.append("g")
          .attr("id", "node-detail-panel")
          .attr("transform", `translate(${width - 330}, 20)`);
        
        detailPanel.append("rect")
          .attr("width", 320)
          .attr("height", () => {
            const metadataCount = Object.keys((d.data as any).metadata || {}).length;
            return 60 + (metadataCount * 20);
          })
          .attr("fill", "white")
          .attr("stroke", "#333")
          .attr("rx", 5);
        
        detailPanel.append("text")
          .attr("x", 10)
          .attr("y", 20)
          .text(`Node: ${(d.data as any).label}`);
        
        detailPanel.append("text")
          .attr("x", 10)
          .attr("y", 40)
          .attr("font-size", "14px")
          .attr("font-weight", "bold")
          .text(`Type: ${(d.data as any).isHardware ? "Hardware" : "Software"}`);
         // Add metadata entries
        const metadata = (d.data as any).metadata || {};
        Object.entries(metadata).forEach(([key, val], i) => {
          let textData = `${key}: ${val}`;
          if(textData.length > 60){
            textData = textData.substring(0,60) + "..."
          }
          detailPanel.append("text")
            .attr("x", 15)
            .attr("y", 60 + i * 20)
            .attr("font-size", "14px")
            .text(textData);
        });
        
        // Add close button
        const closeButton = detailPanel.append("g")
          .attr("cursor", "pointer")
          .attr("transform", "translate(310, 10)")
          .on("click", () => {
            detailPanel.transition()
              .duration(200)
              .style("opacity", 0)
              .remove();
          });
        
        closeButton.append("circle")
          .attr("r", 8)
          .attr("fill", "white");
        
        closeButton.append("text")
          .attr("text-anchor", "middle")
          .attr("dy", "0.3em")
          .attr("fill", "black")
          .attr("font-size", "10px")
          .text("X");
      });
        
    // Add node circles
    nodeGroups.append("circle")
      .attr("r", 10)
      .attr("fill", d => (d.data as any).isHardware ? "#ff8a65" : "#81c784")
      .attr("stroke", "#333")
      .attr("stroke-width", 1.5);
    
    // Add node labels
    nodeGroups.append("text")
      .attr("dy", "0.32em")
      .attr("x", d => d.children ? -12 : 12)
      .attr("font-weight" , "bold")
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text(d => (d.data as any).label)
      .attr("fill", "#333");
    
    // Auto-center the trees
    svg.call(zoom.transform as any, 
      d3.zoomIdentity
        .translate(width/2 - (root as any).x || 0, height/2 - (root as any).y || 0)
        .scale(0.8));

    return () => {
      svg.selectAll("*").remove();
    };
  }, [data]);

  return <svg ref={svgRef} style={{ width: '100%', height: '100%' }}></svg>;
};

export default TreeGraph;