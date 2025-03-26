import { EdgeData } from '../types/index.js';

export class Edge {
    public id: string;
    public source: string;
    public target: string;
    public commandInterface: boolean;
    public stateInterface: boolean;
    public metadata: Record<string, any>;

    constructor(data: EdgeData) {
        this.id = data.id;
        this.source = data.source;
        this.target = data.target;
        this.commandInterface = data.commandInterface || false;
        this.stateInterface = data.stateInterface || false;
        this.metadata = data.metadata || {};
    }

    public toJSON(): EdgeData {
        return {
            id: this.id,
            source: this.source,
            target: this.target,
            commandInterface: this.commandInterface,
            stateInterface: this.stateInterface,
            metadata: this.metadata
        };
    }
}