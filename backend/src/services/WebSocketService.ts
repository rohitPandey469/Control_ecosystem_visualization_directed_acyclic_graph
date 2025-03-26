import { WebSocketServer, WebSocket } from 'ws';
import { GraphService } from './GraphService.js';
import { config } from '../config.js';
import { WebSocketMessage } from '../types/index.js';

export class WebSocketService {
    private wss!: WebSocketServer;
    private clients: Set<WebSocket> = new Set();

    constructor(private graphService: GraphService) {
        this.setupGraphServiceListeners();
    }

    public async start(): Promise<void> {
        this.wss = new WebSocketServer({ 
            port: config.server.webSocketPort 
        });
        
        this.setupWebSocketServer();
        
        return new Promise((resolve) => {
            this.wss.on('listening', () => {
                resolve();
            });
        });
    }

    private setupWebSocketServer(): void {
        this.wss.on('connection', (ws: WebSocket) => {
            console.log('WebSocket client connected');
            this.clients.add(ws);

            // Send the current graph state to the new client
            this.sendMessage(ws, {
                type: 'graphUpdate',
                payload: this.graphService.getGraph().toJSON()
            });

            ws.on('message', (message: string) => {
                try {
                    const data = JSON.parse(message.toString());
                    
                    // Handle client requests (if needed)
                    if (data.type === 'getGraph') {
                        this.sendMessage(ws, {
                            type: 'graphUpdate',
                            payload: this.graphService.getGraph().toJSON()
                        });
                    } else if (data.type === 'clearGraph') {
                        console.log('Clearing graph');
                        this.graphService.clear();
                    }
                } catch (error) {
                    console.error('Error processing WebSocket message:', error);
                }
            });

            ws.on('close', () => {
                console.log('WebSocket client disconnected');
                this.clients.delete(ws);
            });
        });

        console.log(`WebSocket server started on port ${config.server.webSocketPort}`);
    }

    private setupGraphServiceListeners(): void {
        // Listen for graph updates
        this.graphService.on('graphUpdated', (graphData) => {
            console.log("Listened for Graph update",graphData);
            this.broadcast({
                type: 'graphUpdate',
                payload: graphData
            });
        });

        // Listen for node additions
        this.graphService.on('nodeAdded', (nodeData) => {
            console.log("Listened for Node addition");
            this.broadcast({
                type: 'nodeAdded',
                payload: nodeData
            });
        });

        // Listen for edge additions
        this.graphService.on('edgeAdded', (edgeData) => {
            console.log("Listened for Edge addition");
            this.broadcast({
                type: 'edgeAdded',
                payload: edgeData
            });
        });

        // Listen for graph clearing
        this.graphService.on('graphCleared', () => {
            console.log("Listened for Graph clearing");
            this.broadcast({
                type: 'graphCleared',
                payload: null
            });
        });
    }

    private sendMessage(client: WebSocket, message: WebSocketMessage): void {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    }

    private broadcast(message: WebSocketMessage): void {
        this.clients.forEach(client => {
            this.sendMessage(client, message);
        });
    }
}