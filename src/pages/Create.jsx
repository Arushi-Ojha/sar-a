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
    <div className="w-screen h-screen bg-gray-200 antialiased relative overflow-hidden">
      {/* --- On-Screen Feedback Message --- */}
      <div className={`absolute top-5 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 ${selectionFeedback ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
        {selectionFeedback}
      </div>
      
      <canvas
          ref={canvasRef}
          className="cursor-crosshair w-full h-full shadow-inner"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
      />
      
      {/* --- Floating Controls Panel --- */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-2xl flex items-center gap-6 border border-gray-600">
        
        {/* Color Palette */}
        <div className="flex items-end gap-3" title="Select Landscape Type">
          {SAR_COLORS.map(({ name, fullName, color }) => (
            <div key={name} className="flex flex-col items-center gap-1.5">
                <button
                    title={fullName}
                    onClick={() => handleColorSelect(color, name.toLowerCase())}
                    className={`w-7 h-7 rounded-full transition-transform duration-200 transform hover:scale-110 border-2 ${brushColor === color ? 'border-cyan-400 scale-110' : 'border-white/20'}`}
                    style={{ backgroundColor: color }}
                />
                <span className={`text-xs font-medium ${brushColor === color ? 'text-cyan-400' : 'text-gray-300'}`}>{name}</span>
            </div>
          ))}
        </div>

        <div className="w-px h-16 bg-gray-600" />

        {/* Brush Sliders */}
        <div className="flex flex-col gap-2 text-white w-40">
          <div className="flex items-center gap-2">
            <label htmlFor="brushSize" className="text-xs font-medium text-gray-300 w-12">Size</label>
            <input id="brushSize" type="range" min="5" max="100" value={brushSize} onChange={(e) => setBrushSize(e.target.value)} className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer"/>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="brushIntensity" className="text-xs font-medium text-gray-300 w-12">Intensity</label>
            <input id="brushIntensity" type="range" min="10" max="1000" value={brushIntensity} onChange={(e) => setBrushIntensity(e.target.value)} className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer"/>
          </div>
        </div>

        <div className="w-px h-16 bg-gray-600" />

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
            <button onClick={downloadImage} title="Download Image" className="p-3 text-gray-300 hover:text-white bg-blue-600/50 hover:bg-blue-600/80 rounded-full transition-all duration-200">
                <DownloadIcon />
            </button>
            <button onClick={clearCanvas} title="Clear Canvas" className="p-3 text-gray-300 hover:text-white bg-red-600/50 hover:bg-red-600/80 rounded-full transition-all duration-200">
                <TrashIcon />
            </button>
        </div>
      </div>
    </div>
  );
}

