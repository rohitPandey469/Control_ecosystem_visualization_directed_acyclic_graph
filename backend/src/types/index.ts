export interface NodeData { 
    id: string;
    label: string;
    metadata: Record<string, any>;
    isHardware: boolean;
}

export interface EdgeData {
    id: string;
    source: string;
    target: string;
    commandInterface: boolean;
    stateInterface: boolean;
    metadata: Record<string, any>;
}

export interface GraphData {
    nodes: NodeData[];
    edges: EdgeData[];
}

export interface RosMessage {
    start: string;
    end: string;
    command_interface: boolean;
    state_interface: boolean;
    is_hardware: boolean;
    metadataSource : string;
    metadataTarget : string;
    metadataEdge: string;
}

export interface WebSocketMessage {
    type: 'graphUpdate' | 'nodeAdded' | 'edgeAdded' | 'graphCleared';
    payload: any;
}