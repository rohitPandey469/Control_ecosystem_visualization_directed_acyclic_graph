// Graph model
import { EdgeData, GraphData, NodeData } from '../types/index.js';
import { Node } from './Node.js';
import { Edge } from './Edge.js';

export class Graph {
    private nodes: Map<string, Node>;
    private edges: Map<string, Edge>;

    constructor(data?: GraphData) {
        this.nodes = new Map();
        this.edges = new Map();

        if (data) {
            data.nodes.forEach(nodeData => this.addNode(nodeData));
            data.edges.forEach(edgeData => this.addEdge(edgeData));
        }
    }

    public addNode(nodeData: NodeData): Node {
        const node = nodeData instanceof Node ? nodeData : new Node(nodeData);
        this.nodes.set(node.id, node);
        return node;
    }

    public getNode(id: string): Node | undefined {
        return this.nodes.get(id);
    }

    public hasNode(id: string): boolean {
        return this.nodes.has(id);
    }

    public removeNode(id: string): boolean {
        if (!this.nodes.has(id)) {
            return false;
        }
        
        // Remove any edges connected to this node
        for (const [edgeId, edge] of this.edges.entries()) {
            if (edge.source === id || edge.target === id) {
                this.edges.delete(edgeId);
            }
        }
        
        return this.nodes.delete(id);
    }

    public addEdge(edgeData: EdgeData): Edge {
        const edge = edgeData instanceof Edge ? edgeData : new Edge(edgeData);
        
        // Ensure source and target nodes exist
        if (!this.nodes.has(edge.source)) {
            throw new Error(`Source node ${edge.source} does not exist`);
        }
        
        if (!this.nodes.has(edge.target)) {
            throw new Error(`Target node ${edge.target} does not exist`);
        }
        
        // Check for cycles (important for DAG)
        if (this.wouldCreateCycle(edge.source, edge.target)) {
            throw new Error(`Adding edge from ${edge.source} to ${edge.target} would create a cycle`);
        }
        
        this.edges.set(edge.id, edge);
        return edge;
    }

    public getEdge(id: string): Edge | undefined {
        return this.edges.get(id);
    }

    public removeEdge(id: string): boolean {
        return this.edges.delete(id);
    }

    public getAllNodes(): Node[] {
        return Array.from(this.nodes.values());
    }

    public getAllEdges(): Edge[] {
        return Array.from(this.edges.values());
    }

    public toJSON(): GraphData {
        return {
            nodes: this.getAllNodes().map(node => node.toJSON()),
            edges: this.getAllEdges().map(edge => edge.toJSON())
        };
    }

    public clear(): void {
        this.nodes.clear();
        this.edges.clear();
    }

    private wouldCreateCycle(source: string, target: string): boolean {
        // If source and target are the same, it's a self-loop
        if (source === target) {
            return true;
        }
        
        // Simple DFS to detect cycles
        const visited = new Set<string>();
        const stack = [target];
        
        while (stack.length > 0) {
            const node = stack.pop()!;
            visited.add(node);
            
            for (const edge of this.getAllEdges()) {
                if (edge.source === node) {
                    if (edge.target === source) {
                        return true;
                    }
                    
                    if (!visited.has(edge.target)) {
                        stack.push(edge.target);
                    }
                }
            }
        }
        
        return false;
    }

    // Find topological ordering of nodes (useful for DAG visualization)
    public getTopologicalOrder(): string[] {
        const result: string[] = [];
        const visited = new Set<string>();
        const temp = new Set<string>();
        
        const visit = (nodeId: string) => {
            if (temp.has(nodeId)) {
                throw new Error("Graph has a cycle");
            }
            
            if (!visited.has(nodeId)) {
                temp.add(nodeId);
                
                // Visit all neighbors
                for (const edge of this.getAllEdges()) {
                    if (edge.source === nodeId) {
                        visit(edge.target);
                    }
                }
                
                temp.delete(nodeId);
                visited.add(nodeId);
                result.unshift(nodeId);
            }
        };
        
        // Visit all nodes
        for (const nodeId of this.nodes.keys()) {
            if (!visited.has(nodeId)) {
                visit(nodeId);
            }
        }
        
        return result;
    }
}