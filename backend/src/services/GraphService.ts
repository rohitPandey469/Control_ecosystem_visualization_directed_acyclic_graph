import { RosMessage, NodeData, EdgeData } from '../types/index.js';
import { Graph } from '../models/Graph.js';
import { Node } from '../models/Node.js';
import { Edge } from '../models/Edge.js';
import { EventEmitter } from 'events';

export class GraphService extends EventEmitter {
    private graph: Graph;
    
    constructor() {
        super();
        this.graph = new Graph();
    }
    
    public getGraph(): Graph {
        return this.graph;
    }
    
    public clear(): void {
        this.graph = new Graph();
        this.emit('graphUpdated', this.graph.toJSON());
    }
    
    public processRosMessage(message: RosMessage): { 
        addedNodes: NodeData[],
        addedEdge: EdgeData | null
    } {
        const addedNodes: NodeData[] = [];
        let addedEdge: EdgeData | null = null;
        console.log("-------------------processRosMessageHit-------------------");
        
        // Check if nodes exist, if not create them
        if (!this.graph.hasNode(message.start)) {
            const startNode = this.createNodeFromRosMessage(message.start, message, true);
            addedNodes.push(startNode.toJSON());
            this.emit('nodeAdded', startNode.toJSON());
        }
        
        if (!this.graph.hasNode(message.end)) {
            const endNode = this.createNodeFromRosMessage(message.end, message, false);
            addedNodes.push(endNode.toJSON());
            this.emit('nodeAdded', endNode.toJSON());
        }
        
        // Create the edge
        try {
            const edgeId = `${message.start}_${message.end}`;
            const edge = new Edge({
                id: edgeId,
                source: message.start,
                target: message.end,
                commandInterface: message.command_interface,
                stateInterface: message.state_interface,
                metadata: JSON.parse(message.metadataEdge)
            });
            
            this.graph.addEdge(edge);
            addedEdge = edge.toJSON();
            this.emit('edgeAdded', edge.toJSON());
        } catch (error) {
            console.error('Error adding edge:', error);
        }
        
        // Emit the updated graph
        this.emit('graphUpdated', this.graph.toJSON());
        
        return { addedNodes, addedEdge };
    }
    
    private createNodeFromRosMessage(id: string, message: RosMessage, isStart: boolean): Node {
        let metadata = {};
        
        if(isStart){
            try {
                if (message.metadataSource) {
                    metadata = JSON.parse(message.metadataSource);
                }
            } catch (e) {
                metadata = { rawMetadata: message.metadataSource };
            }
        } else {
            try {
                if (message.metadataTarget) {
                    metadata = JSON.parse(message.metadataTarget);
                }
            } catch (e) {
                metadata = { rawMetadata: message.metadataTarget };
            }
        }
        
        const node = new Node({
            id,
            label: id,
            isHardware: message.is_hardware,
            metadata
        });
        
        this.graph.addNode(node);
        return node;
    }
}