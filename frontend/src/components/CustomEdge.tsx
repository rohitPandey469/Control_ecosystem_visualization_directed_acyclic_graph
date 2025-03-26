import { memo, useState } from 'react';
import { EdgeProps, getBezierPath, useReactFlow } from 'reactflow';
import { EdgeData } from '../types';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected
}: EdgeProps<EdgeData>) => {
  const [hovered, setHovered] = useState(false);
  const { setEdges } = useReactFlow();
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const getEdgeColor = () => {
    if (selected || hovered) return '#ff5722'; // orange when selected/hovered
    if (data?.commandInterface) return '#e57373';
    if (data?.stateInterface) return '#64b5f6';
    return '#90a4ae';
  };

  const color = getEdgeColor();
  const markerEndId = `arrowhead-${id}`;
  const edgeThickness = selected ? 5 : (hovered ? 4 : 2);

  const onEdgeClick = () => {
    setEdges(eds => eds.map(edge => {
      if (edge.id === id) {
        return {
          ...edge,
          data: {
            ...edge.data,
            // Toggle visibility of metadata or other properties
            showDetails: !edge.data?.showDetails
          }
        };
      }
      return edge;
    }));
  };

  return (
    <g>
      <defs>
        <marker
          id={markerEndId}
          markerWidth="15"
          markerHeight="15"
          refX="5"
          refY="5"
          orient="auto"
        >
          <path
            d="M 0 0 L 10 5 L 0 10 z"
            fill={color}
            style={{ strokeWidth: 1 }}
          />
        </marker>
      </defs>
      <path
        id={id}
        style={{ 
          stroke: color,
          strokeWidth: edgeThickness,
          markerEnd: `url(#${markerEndId})`,
          cursor: 'pointer',
          opacity: hovered ? 1 : 0.8,
          transition: 'all 0.2s ease'
        }}
        className="react-flow__edge-path"
        d={edgePath}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onEdgeClick}
      />
      {hovered && (
        <text>
          <textPath
            href={`#${id}`}
            startOffset="50%"
            textAnchor="middle"
            style={{ 
              fontSize: 12,
              fill: '#333',
              fontWeight: 'bold',
              pointerEvents: 'none'
            }}
          >
            {data?.commandInterface 
            ? 'command_interface' 
            : data?.stateInterface 
              ? 'state_interface' 
              : 'connection'}
          </textPath>
        </text>
      )}
    </g>
  );
};

export default memo(CustomEdge);