import React, { useRef, useEffect, useState } from 'react';
import { GraphData } from '../types';
import D3DAGRenderer from './d3/D3DAGRenderer';
import InteractionsGuide from './d3/InteractionsGuide';

interface D3DAGVisualizationProps {
  graphData: GraphData;
}

const D3DAGVisualization: React.FC<D3DAGVisualizationProps> = ({ graphData }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Update dimensions on resize
  useEffect(() => {
    if (!svgRef.current) return;
    
    const updateDimensions = () => {
      if (svgRef.current) {
        setDimensions({
          width: svgRef.current.clientWidth,
          height: svgRef.current.clientHeight
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  return (
    <div style={{ width: '100%', height: '80vh', position: 'relative' }}>
      <svg 
        ref={svgRef} 
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
      
      {dimensions.width > 0 && (
        <D3DAGRenderer
          svgRef={svgRef as React.RefObject<SVGSVGElement>}
          graphData={graphData}
          dimensions={dimensions}
        />
      )}
      
      <InteractionsGuide />
    </div>
  );
};

export default D3DAGVisualization;