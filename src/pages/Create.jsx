import React, { useState, useRef, useEffect, useCallback } from 'react';

// Color palette representing different SAR landscape features
const SAR_COLORS = [
  { name: 'Urban', fullName: 'Urban / Strong Scatter', color: '#FFFFFF' },
  { name: 'Rocky', fullName: 'Rocky Terrain / Dry Soil', color: '#a9a9a9' },
  { name: 'Water', fullName: 'Water / Radar Shadow', color: '#0d0030' },
  { name: 'Vegetation', fullName: 'Vegetation / Forest', color: '#228B22' },
  { name: 'Mixed', fullName: 'Desert', color: '#FFA500' },
  { name: 'Man-made', fullName: 'Man-made Structures', color: '#FF00FF' },
  { name: 'Wetlands', fullName: 'Wetlands / Moist Areas', color: '#00CED1' },
];

// --- SVG Icons ---
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
);


// Main Application Component
export default function App() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState(SAR_COLORS[0].color);
  const [brushSize, setBrushSize] = useState(30);
  const [brushIntensity, setBrushIntensity] = useState(50);
  const [selectionFeedback, setSelectionFeedback] = useState('');

  // --- Feedback Message Timeout ---
  useEffect(() => {
    if (selectionFeedback) {
      const timer = setTimeout(() => {
        setSelectionFeedback('');
      }, 2000); // Message disappears after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [selectionFeedback]);


  // --- Canvas Setup and Responsive Sizing ---
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = '#FFFFFF'; // Set initial background to white
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);
  
  useEffect(() => {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => {
      window.removeEventListener('resize', setupCanvas);
    };
  }, [setupCanvas]);


  // --- Drawing Logic ---
  const getCoords = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;
    const rect = canvas.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const draw = useCallback((event) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoords(event);
    const density = brushIntensity;
    ctx.fillStyle = brushColor;
    for (let i = 0; i < density; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * brushSize;
      const dotX = x + radius * Math.cos(angle);
      const dotY = y + radius * Math.sin(angle);
      ctx.fillRect(dotX, dotY, 1, 1);
    }
  }, [isDrawing, brushColor, brushSize, brushIntensity]);

  const startDrawing = (event) => {
    setIsDrawing(true);
    draw(event); 
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };
  
  const clearCanvas = () => {
     const canvas = canvasRef.current;
     const ctx = canvas?.getContext('2d');
     if (!ctx) return;
     ctx.fillStyle = '#FFFFFF'; // Clear to white
     ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // --- File Operations ---
  const downloadImage = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const imageURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageURL;
      link.download = 'sar-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }

  const handleColorSelect = (color, name) => {
      setBrushColor(color);
      setSelectionFeedback(`Add ${name}`);
  }

  // --- UI ---
  return (
    <div className="creator-container">
        <div className={`feedback-message ${selectionFeedback ? 'feedback-visible' : 'feedback-hidden'}`}>
          {selectionFeedback}
        </div>
        
        <canvas
            ref={canvasRef}
            className="creator-canvas"
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onMouseMove={draw}
            onTouchStart={startDrawing}
            onTouchEnd={stopDrawing}
            onTouchMove={draw}
        />
        
        <div className="controls-panel">
          <div className="color-palette" title="Select Landscape Type">
            {SAR_COLORS.map(({ name, fullName, color }) => (
              <div key={name} className="color-item">
                  <button
                      title={fullName}
                      onClick={() => handleColorSelect(color, name.toLowerCase())}
                      className={`color-swatch ${brushColor === color ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                  />
                  <span className={`color-label ${brushColor === color ? 'active-label' : ''}`}>{name}</span>
              </div>
            ))}
          </div>

          <div className="divider" />

          <div className="sliders">
            <div className="slider-control">
              <label htmlFor="brushSize">Size</label>
              <input id="brushSize" type="range" min="5" max="100" value={brushSize} onChange={(e) => setBrushSize(e.target.value)} />
            </div>
            <div className="slider-control">
              <label htmlFor="brushIntensity">Intensity</label>
              <input id="brushIntensity" type="range" min="10" max="1000" value={brushIntensity} onChange={(e) => setBrushIntensity(e.target.value)}/>
            </div>
          </div>

          <div className="divider" />

          <div className="action-buttons">
              <button onClick={downloadImage} title="Download Image" className="action-btn">
                  <DownloadIcon />
              </button>
              <button onClick={clearCanvas} title="Clear Canvas" className="action-btn">
                  <TrashIcon />
              </button>
          </div>
        </div>
      </div>
  );
}

