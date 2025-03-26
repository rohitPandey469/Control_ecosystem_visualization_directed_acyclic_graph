import './App.css';
import InteractionsGuide from './components/d3/InteractionsGuide';
// import D3DAGVisualization from './components/D3DAGVisualization';
// import ForceGraph from './components/ForceGraph';
import TreeGraph from './components/TreeGraph';
import { useWebSocket } from './hooks/useWebSocket';
// import { GraphData } from './types';

// const dummyData: GraphData = {
//   "nodes": [
//     {
//       "id": "A",
//       "label": "Sensor A",
//       "metadata": {
//         "type": "sensor",
//         "rate": "100Hz",
//         "description": "IMU sensor reading orientation data"
//       },
//       "isHardware": true
//     },
//     {
//       "id": "B",
//       "label": "Processor B",
//       "metadata": {
//         "type": "processor",
//         "rate": "100Hz",
//         "description": "Data fusion module"
//       },
//       "isHardware": false
//     },
//     {
//       "id": "C",
//       "label": "Controller C",
//       "metadata": {
//         "type": "controller",
//         "rate": "50Hz",
//         "description": "Motion control system"
//       },
//       "isHardware": false
//     },
//     {
//       "id": "D",
//       "label": "Sensor D",
//       "metadata": {
//         "type": "camera",
//         "rate": "30Hz",
//         "description": "Visual perception sensor"
//       },
//       "isHardware": true
//     },
//     {
//       "id": "E",
//       "label": "Filter E",
//       "metadata": {
//         "type": "filter",
//         "rate": "60Hz",
//         "description": "Signal filtering module"
//       },
//       "isHardware": false
//     },
//     {
//       "id": "F",
//       "label": "Actuator F",
//       "metadata": {
//         "type": "actuator",
//         "rate": "50Hz",
//         "description": "Robot joint actuator"
//       },
//       "isHardware": true
//     },
//     {
//       "id": "G",
//       "label": "Planner G",
//       "metadata": {
//         "type": "planner",
//         "rate": "10Hz",
//         "description": "Path planning system"
//       },
//       "isHardware": false
//     }
//   ],
//   "edges": [
//     {
//       "id": "A_B",
//       "source": "A",
//       "target": "B",
//       "commandInterface": true,
//       "stateInterface": false,
//       "metadata": {
//         "type": "data",
//         "rate": "100Hz",
//         "description": "Raw sensor data flow"
//       },
//     },
//     {
//       "id": "B_C",
//       "source": "B",
//       "target": "C",
//       "commandInterface": false,
//       "stateInterface": true,
//       "metadata": {
//         "type": "command",
//         "rate": "50Hz",
//         "description": "Processed control commands"
//       },
//     },
//     {
//       "id": "D_E",
//       "source": "D",
//       "target": "E",
//       "commandInterface": true,
//       "stateInterface": false,
//       "metadata": {
//         "type": "image",
//         "rate": "30Hz",
//         "description": "Raw image data"
//       },
//     },
//     {
//       "id": "E_G",
//       "source": "E",
//       "target": "G",
//       "commandInterface": false,
//       "stateInterface": true,
//       "metadata": {
//         "type": "processed",
//         "rate": "30Hz",
//         "description": "Filtered image data"
//       },
//     },
//     {
//       "id": "B_E",
//       "source": "B",
//       "target": "E",
//       "commandInterface": true,
//       "stateInterface": true,
//       "metadata": {
//         "type": "config",
//         "rate": "5Hz",
//         "description": "Filter configuration"
//       },
//     },
//     {
//       "id": "C_F",
//       "source": "C",
//       "target": "F",
//       "commandInterface": true,
//       "stateInterface": false,
//       "metadata": {
//         "type": "command",
//         "rate": "50Hz",
//         "description": "Actuator commands"
//       },
//     },
//     {
//       "id": "G_C",
//       "source": "G",
//       "target": "C",
//       "commandInterface": true,
//       "stateInterface": false,
//       "metadata": {
//         "type": "plan",
//         "rate": "10Hz",
//         "description": "Motion plan data"
//       },
//     },
//     {
//       "id": "A_G",
//       "source": "A",
//       "target": "G",
//       "commandInterface": false,
//       "stateInterface": true,
//       "metadata": {
//         "type": "context",
//         "rate": "20Hz",
//         "description": "Environmental context data"
//       },
//     }
//   ]
// }

function App() {
  const { isConnected, graphData, requestGraph, clearGraph } = useWebSocket();

  return (
    <div className="App">
      <header className="App-header">
        <h1>ROS2 DAG Visualization</h1>
        <div className="connection-status">
          Status: {isConnected ? 
            <span style={{ color: 'green' }}>Connected</span> : 
            <span style={{ color: 'red' }}>Disconnected</span>}
        </div>
        <div className="controls">
          <button onClick={requestGraph} disabled={!isConnected}>
            Refresh Graph
          </button>
          <button onClick={clearGraph} disabled={!isConnected}>
            Clear Graph
          </button>
        </div>
      </header>
      <main className='App-main'>
        {/* <D3DAGVisualization graphData={graphData} /> */}
        {/* <ForceGraph data={dummyData} /> */}
        <TreeGraph data={graphData} />
        <InteractionsGuide/>
      </main>
      <footer className="App-footer">
        <p>Node Count: {graphData.nodes.length} | Edge Count: {graphData.edges.length}</p>
      </footer>
    </div>
  );
}

export default App;