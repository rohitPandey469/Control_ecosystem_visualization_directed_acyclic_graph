import { memo, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { NodeData } from '../types';

const CustomNode = ({ data, selected }: NodeProps<NodeData>) => {
  const [expanded, setExpanded] = useState(false);
  const { setNodes } = useReactFlow();

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const onNodeClick = () => {
    toggleExpand();
    setNodes(nds => nds.map(node => {
      if (node.id === data.id) {
        return {
          ...node,
          data: {
            ...node.data,
            // You could add any node-specific interaction logic here
            lastClicked: new Date().toISOString()
          }
        };
      }
      return node;
    }));
  };
  return (
    
    <div 
      className={`node ${data.isHardware ? 'hardware-node' : 'software-node'}`}
      style={{ 
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: selected ? '#ffcc80' : (data.isHardware ? '#ff8a65' : '#81c784'),
        border: selected ? '2px solid #ff5722' : '1px solid #ccc',
        width: expanded ? '200px' : '150px',
        boxShadow: selected ? '0 4px 8px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
      onClick={onNodeClick}
      onDoubleClick={toggleExpand}
      title={data.metadata.dummyKey}
    >
      <Handle type="target" position={Position.Top} />
      
      <div 
        className="node-header" 
        style={{ 
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span>{data.label}</span>
        <span style={{ fontSize: '0.8em' }}>
          {data.isHardware ? 'Hardware' : 'software'}
        </span>
      </div>
      
      {expanded && Object.keys(data.metadata).length > 0 && (
        <div 
          className="node-metadata" 
          style={{ 
            fontSize: '0.8em', 
            marginTop: '5px',
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: '5px',
            borderRadius: '3px'
          }}
        >
          {Object.entries(data.metadata).map(([key, value]) => (
            <div key={key} className="metadata-item" style={{ marginBottom: '3px' }}>
              <span style={{ fontWeight: 'bold' }}>{key}:</span> {value}
            </div>
          ))}
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(CustomNode);