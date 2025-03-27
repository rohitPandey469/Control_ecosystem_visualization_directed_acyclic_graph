# Control Ecosystem Visualization - Directed Acyclic Graph (DAG)

A ROS 2 based visualization system for control ecosystem graphs with frontend and backend components.

## Prerequisites

- ROS 2 Humble (or your ROS 2 distribution)
- Node.js (v16+ recommended)
- npm/yarn
- Python 3.8+

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rohitPandey469/Control_ecosystem_visualization_directed_acyclic_graph.git
cd Control_ecosystem_visualization_directed_acyclic_graph
```


### 2. Run Backend Server
```bash
cd backend
source /opt/ros/humble/setup.bash  # Or your ROS 2 distribution
npm install
npx tsc
node dist/index.js
```

### 3. Run Frontend Server(in new terminal)
```bash
cd frontend
npm install
npm run dev
```

### 4. Run DAG Publisher
```bash
git clone https://github.com/rohitPandey469/Control_ecosystem_visualization_DAG_publisher.git
cd Control_ecosystem_visualization_DAG_publisher
source /opt/ros/humble/setup.bash
rosdep install --from-paths src --ignore-src -y --rosdistro humble
colcon build
source install/setup.bash
ros2 run talker publishDagNode
```
Ctrl^C to stop this and then -

### 5. Modify the graph structure
```bash
code src/talker/talker/talker_node.py
```
Change fields source target state_interface command_interface is_hardware metadataSource/Edge/Target
then again
```bash
colcon build
source install/setup.bash
ros2 run talker publishDagNode
```

Please look at http://localhost:5173
