import express from "express"
import { config } from "./config";
import { logger } from "./utils/logger";
import { GraphService } from "./services/GraphService";
import { RosService } from "./services/RosService";
import { WebSocketService } from "./services/WebSocketService";
import cors from "cors"

const app = express();
app.use(cors())
app.use(express.json())


app.get('/health', (_req, res) => {
    res.status(200).json({status : 'ok'})
})

// Intialize services
const graphService = new GraphService()
const rosService = new RosService()
const webSocketService = new WebSocketService(graphService)

// Start web socket
webSocketService.start().then(() => {
    logger.info(`WebSocket server started on port ${config.server.webSocketPort}`);
}).catch((error) => {
    logger.error('Failed to start WebSocket server', error);
});

// Connect ros service
rosService.on('rosMessage', (message) => {
    logger.info(`Processing ROS message: ${message.start} -> ${message.end}`);
    graphService.processRosMessage(message);
});

// start the ros service
rosService.initialize()
    .then(() => {
        logger.info('ROS service initialized');
    })
    .catch((error) => {
        logger.error('Failed to initialize ROS service', error);
    });

app.listen(config.server.port, () => {
    logger.info(`Express server running on port ${config.server.port}`);
});

// Handle graceful shutdown
const shutdown = async () => {
    logger.info('Shutting down...');
    await rosService.shutdown();
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);