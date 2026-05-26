export default function MapView() {
  return (
    <div className="map-view">
      <div className="map-header">
        <h2>World Map</h2>
        <p>Interactive map overlay — select a location in the game world to place your factory.</p>
      </div>
      <div className="map-container">
        <svg viewBox="0 0 800 600" className="map-svg">
          <defs>
            <radialGradient id="grass-gradient" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#4a7c3f" />
              <stop offset="100%" stopColor="#2d5a20" />
            </radialGradient>
            <linearGradient id="water-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2980b9" />
              <stop offset="100%" stopColor="#1a5276" />
            </linearGradient>
            <filter id="terrain-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" />
              <feDisplacementMap in="SourceGraphic" scale="5" />
            </filter>
          </defs>

          <rect width="800" height="600" fill="url(#grass-gradient)" />
          
          <ellipse cx="650" cy="100" rx="180" ry="90" fill="url(#water-gradient)" opacity="0.8" />
          <text x="650" y="105" fill="white" textAnchor="middle" fontSize="12">Northern Lake</text>
          
          <ellipse cx="120" cy="480" rx="200" ry="80" fill="url(#water-gradient)" opacity="0.8" />
          <text x="120" y="485" fill="white" textAnchor="middle" fontSize="12">Southern Ocean</text>
          
          <path d="M0 200 Q200 180 400 220 T800 200" fill="none" stroke="#8B7355" strokeWidth="8" opacity="0.6" />
          <path d="M0 350 Q150 330 300 360 T800 340" fill="none" stroke="#8B7355" strokeWidth="6" opacity="0.5" />
          
          <rect x="80" y="80" width="30" height="30" fill="#CD853F" stroke="#8B6914" strokeWidth="2" rx="3" />
          <text x="95" y="75" fill="#FFD700" textAnchor="middle" fontSize="10" fontWeight="bold">Iron</text>
          
          <rect x="250" y="150" width="30" height="30" fill="#B87333" stroke="#8B4513" strokeWidth="2" rx="3" />
          <text x="265" y="145" fill="#FFD700" textAnchor="middle" fontSize="10" fontWeight="bold">Copper</text>
          
          <rect x="500" y="300" width="30" height="30" fill="#FFD700" stroke="#DAA520" strokeWidth="2" rx="3" />
          <text x="515" y="295" fill="#FFD700" textAnchor="middle" fontSize="10" fontWeight="bold">Caterium</text>
          
          <rect x="350" y="400" width="30" height="30" fill="#2F2F2F" stroke="#1A1A1A" strokeWidth="2" rx="3" />
          <text x="365" y="395" fill="#FFD700" textAnchor="middle" fontSize="10" fontWeight="bold">Coal</text>
          
          <rect x="600" y="450" width="30" height="30" fill="#DEB887" stroke="#8B7355" strokeWidth="2" rx="3" />
          <text x="615" y="445" fill="#FFD700" textAnchor="middle" fontSize="10" fontWeight="bold">Bauxite</text>
          
          <rect x="150" y="250" width="30" height="30" fill="#D3D3D3" stroke="#808080" strokeWidth="2" rx="3" />
          <text x="165" y="245" fill="#FFD700" textAnchor="middle" fontSize="10" fontWeight="bold">Limestone</text>
          
          <circle cx="700" cy="350" r="40" fill="#1A1A1A" stroke="#333" strokeWidth="2" opacity="0.7" />
          <text x="700" y="355" fill="#FF6600" textAnchor="middle" fontSize="10" fontWeight="bold">Oil Field</text>
          
          <g transform="translate(380, 280)">
            <rect x="-5" y="-5" width="50" height="40" fill="#CD853F" stroke="#8B6914" strokeWidth="2" rx="3" opacity="0.6" />
            <text x="20" y="20" fill="white" textAnchor="middle" fontSize="8">Starting Area</text>
          </g>

          <g transform="translate(350, 250)">
            <rect width="100" height="60" fill="rgba(76, 175, 80, 0.3)" stroke="#4CAF50" strokeWidth="2" strokeDasharray="5 3" rx="4" />
            <text x="50" y="35" fill="#4CAF50" textAnchor="middle" fontSize="12" fontWeight="bold">Factory Zone</text>
          </g>

          <g opacity="0.4">
            <path d="M100 150 Q200 100 300 160" fill="#4a7c3f" stroke="none" />
            <path d="M400 80 Q450 50 500 90" fill="#3a6c2f" stroke="none" />
            <path d="M600 500 Q700 480 750 520" fill="#4a7c3f" stroke="none" />
          </g>

          <rect x="10" y="10" width="780" height="580" fill="none" stroke="#666" strokeWidth="1" />
        </svg>
      </div>
      <div className="map-legend">
        <h4>Legend</h4>
        <div className="map-legend-items">
          <span className="legend-item"><span className="legend-swatch" style={{ background: '#CD853F' }}></span> Iron</span>
          <span className="legend-item"><span className="legend-swatch" style={{ background: '#B87333' }}></span> Copper</span>
          <span className="legend-item"><span className="legend-swatch" style={{ background: '#FFD700' }}></span> Caterium</span>
          <span className="legend-item"><span className="legend-swatch" style={{ background: '#2F2F2F' }}></span> Coal</span>
          <span className="legend-item"><span className="legend-swatch" style={{ background: '#DEB887' }}></span> Bauxite</span>
          <span className="legend-item"><span className="legend-swatch" style={{ background: '#D3D3D3' }}></span> Limestone</span>
          <span className="legend-item"><span className="legend-swatch" style={{ background: '#1A1A1A' }}></span> Oil</span>
        </div>
      </div>
    </div>
  );
}