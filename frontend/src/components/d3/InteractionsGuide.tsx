import React from 'react';

const InteractionsGuide: React.FC = () => {
  return (
    <div style={{ 
      position: 'absolute', 
      top: 10, 
      left: 10, 
      background: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
    }}>
      <h4 style={{ margin: '0 0 5px 0' }}>Interactions Guide</h4>
      <ul style={{ fontSize: '0.8em', margin: 0, paddingLeft: '15px', textAlign:"left" }}>
        <li>Hover/Click Node: Show Metadata</li>
        <li>Scroll: Zoom in/out</li>
        <li>Drag background: Pan</li>
      </ul>
      <div style={{ marginTop: '10px', fontSize: '0.8em', display: 'flex', flexDirection: 'column' }}>
        <div style={{display:"flex", flexDirection:"row", gap:"1px", alignItems:"center"}}><span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#81c784', marginRight: '5px' }}></span> Software Node</div>
        <div style={{display:"flex", flexDirection:"row", gap:"1px", alignItems:"center"}}><span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#ff8a65', marginRight: '5px' }}></span> Hardware Node</div>
      </div>
    </div>
  );
};

export default InteractionsGuide;