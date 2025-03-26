import * as rclnodejs from "rclnodejs"
import { RosMessage } from "../types"
import { config } from "../config"
import { EventEmitter } from "events"

export class RosService extends EventEmitter{
    private node  : rclnodejs.Node | null = null;
    private isIntialized = false;

    constructor(){
        super();
    }

    public async initialize() : Promise<void>{
        if(this.isIntialized) return;

        try{
            await rclnodejs.init();
            this.node = new rclnodejs.Node(config.ros.nodeName);

            // create subscription
            this.node.createSubscription(
                "std_msgs/msg/String",
                config.ros.topic,
                (msg : any) => this.handleRosMessage(msg)
            )

            rclnodejs.spin(this.node);
            this.isIntialized = true;
            console.log(`ROS node initialized and subscribed to ${config.ros.topic}`);
        } catch ( error : any ){
            console.error('Failed to initialize ROS service', error);
            throw error;
        }
    }

    private handleRosMessage(msg : any) : void{
        try{
            const data = JSON.parse(msg.data) as RosMessage;
            console.log('Received ROS message', data);
            this.emit('rosMessage', data);
        } catch (error){
            console.error('Failed to parse ROS message', error);
        }
    }

    public async shutdown(): Promise<void> {
        if(this.isIntialized && this.node){
            this.node.destroy()
            await rclnodejs.shutdown();
            this.isIntialized = false;
            this.node = null;
            console.log('ROS Node shutdown');
        }
    }
}