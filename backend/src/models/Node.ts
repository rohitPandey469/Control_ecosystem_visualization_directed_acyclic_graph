import { NodeData } from '../types/index.js';

export class Node {
    public id: string;
    public label: string;
    public metadata: Record<string, any>;
    public isHardware: boolean;

    constructor(data: NodeData) {
        this.id = data.id;
        this.label = data.label;
        this.metadata = data.metadata || {};
        this.isHardware = data.isHardware || false;
    }

    public updateMetadata(metadata: Record<string, any>): void {
        this.metadata = { ...this.metadata, ...metadata };
    }

    public toJSON(): NodeData {
        return {
            id: this.id,
            label: this.label,
            metadata: this.metadata,
            isHardware: this.isHardware
        };
    }
}