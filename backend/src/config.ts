export const config = {
    server: {
        port: parseInt(process.env.PORT || '3000', 10),
        webSocketPort: parseInt(process.env.WS_PORT || '5001', 10)
    },
    ros: {
        nodeName: 'dag_subscriber',
        topic: "graph_updates",
    }
};