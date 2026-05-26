import { useCallback, useRef, useState } from 'react';
import { useFactoryStore } from '../../store/factoryStore';
import { BUILDING_MAP } from '../../data/gameData';
import type { BuildingCategory, Connection, PlacedBuilding } from '../../types';

const CELL_SIZE = 40;

export default function FactoryGrid() {
  const buildings = useFactoryStore(s => s.buildings);
  const connections = useFactoryStore(s => s.connections);
  const selectedBuildingId = useFactoryStore(s => s.selectedBuildingId);
  const gridZoom = useFactoryStore(s => s.gridZoom);
  const gridOffsetX = useFactoryStore(s => s.gridOffsetX);
  const gridOffsetY = useFactoryStore(s => s.gridOffsetY);
  const showPowerOverlay = useFactoryStore(s => s.showPowerOverlay);
  const addBuilding = useFactoryStore(s => s.addBuilding);
  const moveBuilding = useFactoryStore(s => s.moveBuilding);
  const removeBuilding = useFactoryStore(s => s.removeBuilding);
  const selectBuilding = useFactoryStore(s => s.selectBuilding);
  const setGridZoom = useFactoryStore(s => s.setGridZoom);
  const setGridOffset = useFactoryStore(s => s.setGridOffset);

  const [draggedBuildingId, setDraggedBuildingId] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const buildingType = e.dataTransfer.getData('buildingType') as BuildingCategory;
    if (!buildingType) return;

    const rect = gridRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.floor((e.clientX - rect.left - gridOffsetX) / (CELL_SIZE * gridZoom));
    const y = Math.floor((e.clientY - rect.top - gridOffsetY) / (CELL_SIZE * gridZoom));
    const id = addBuilding(buildingType, x, y);
    selectBuilding(id);
  }, [addBuilding, selectBuilding, gridOffsetX, gridOffsetY, gridZoom]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleMouseDownOnBuilding = useCallback((e: React.MouseEvent, buildingId: string) => {
    e.stopPropagation();
    if (e.button === 2) {
      removeBuilding(buildingId);
      return;
    }
    selectBuilding(buildingId);
    setDraggedBuildingId(buildingId);
  }, [selectBuilding, removeBuilding]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggedBuildingId) {
      const rect = gridRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = Math.floor((e.clientX - rect.left - gridOffsetX) / (CELL_SIZE * gridZoom));
      const y = Math.floor((e.clientY - rect.top - gridOffsetY) / (CELL_SIZE * gridZoom));
      moveBuilding(draggedBuildingId, x, y);
    }
    if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setGridOffset(gridOffsetX + dx, gridOffsetY + dy);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  }, [draggedBuildingId, isPanning, panStart, gridOffsetX, gridOffsetY, gridZoom, moveBuilding, setGridOffset]);

  const handleMouseUp = useCallback(() => {
    setDraggedBuildingId(null);
    setIsPanning(false);
  }, []);

  const handleMouseDownOnGrid = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && !draggedBuildingId)) {
      if (e.button === 1) {
        setIsPanning(true);
        setPanStart({ x: e.clientX, y: e.clientY });
      }
      selectBuilding(null);
    }
  }, [draggedBuildingId, selectBuilding]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setGridZoom(gridZoom + delta);
  }, [gridZoom, setGridZoom]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div
      ref={gridRef}
      className="factory-grid"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseDown={handleMouseDownOnGrid}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onContextMenu={handleContextMenu}
    >
      <svg className="grid-background" style={{
        transform: `translate(${gridOffsetX}px, ${gridOffsetY}px) scale(${gridZoom})`,
      }}>
        <defs>
          <pattern id="grid-pattern" width={CELL_SIZE} height={CELL_SIZE} patternUnits="userSpaceOnUse">
            <path d={`M ${CELL_SIZE} 0 L 0 0 0 ${CELL_SIZE}`} fill="none" stroke="rgba(100,100,120,0.15)" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid-pattern-major" width={CELL_SIZE * 5} height={CELL_SIZE * 5} patternUnits="userSpaceOnUse">
            <rect width={CELL_SIZE * 5} height={CELL_SIZE * 5} fill="url(#grid-pattern)" />
            <path d={`M ${CELL_SIZE * 5} 0 L 0 0 0 ${CELL_SIZE * 5}`} fill="none" stroke="rgba(100,100,120,0.3)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="10000" height="10000" x="-5000" y="-5000" fill="url(#grid-pattern-major)" />
      </svg>

      <div className="grid-buildings" style={{
        transform: `translate(${gridOffsetX}px, ${gridOffsetY}px) scale(${gridZoom})`,
        transformOrigin: '0 0',
      }}>
        {buildings.map(building => {
          const def = BUILDING_MAP[building.buildingType];
          if (!def) return null;
          const isSelected = building.id === selectedBuildingId;
          return (
            <div
              key={building.id}
              className={`grid-building ${isSelected ? 'selected' : ''}`}
              style={{
                left: building.gridX * CELL_SIZE,
                top: building.gridY * CELL_SIZE,
                width: def.width * CELL_SIZE,
                height: def.height * CELL_SIZE,
                backgroundColor: def.color,
                opacity: showPowerOverlay ? (def.powerProduction ? 0.4 + 0.6 * (def.powerProduction / 2500) : def.powerConsumption > 0 ? 0.3 : 0.6) : undefined,
              }}
              onMouseDown={(e) => handleMouseDownOnBuilding(e, building.id)}
            >
              <span className="building-icon">{def.icon}</span>
              <span className="building-label">{def.name}</span>
              {def.powerConsumption > 0 && (
                <span className="building-power-label">{Math.round(def.powerConsumption * building.overclock)}MW</span>
              )}
              {def.powerProduction && (
                <span className="building-power-label gen">+{Math.round(def.powerProduction * building.overclock)}MW</span>
              )}
            </div>
          );
        })}
      </div>

      {connections.map(conn => (
        <ConnectionLine key={conn.id} connection={conn} buildings={buildings} />
      ))}

      <div className="grid-info">
        <span>Buildings: {buildings.length}</span>
        <span>Connections: {connections.length}</span>
        <span>Zoom: {Math.round(gridZoom * 100)}%</span>
      </div>
    </div>
  );
}

function ConnectionLine({ connection, buildings }: { connection: Connection; buildings: PlacedBuilding[] }) {
  const source = buildings.find(b => b.id === connection.sourceId);
  const target = buildings.find(b => b.id === connection.targetId);
  if (!source || !target) return null;

  const sourceDef = BUILDING_MAP[source.buildingType];
  const targetDef = BUILDING_MAP[target.buildingType];
  if (!sourceDef || !targetDef) return null;

  const CELL_SIZE_ = 40;
  const x1 = (source.gridX + sourceDef.width / 2) * CELL_SIZE_;
  const y1 = (source.gridY + sourceDef.height / 2) * CELL_SIZE_;
  const x2 = (target.gridX + targetDef.width / 2) * CELL_SIZE_;
  const y2 = (target.gridY + targetDef.height / 2) * CELL_SIZE_;

  const color = connection.type === 'power' ? '#FFD700' : connection.type === 'fluid' ? '#4A90D9' : '#FF6347';

  return (
    <svg className="connection-layer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="3" strokeDasharray={connection.type === 'power' ? '8 4' : 'none'} opacity={0.8} />
      <circle cx={x1} cy={y1} r="5" fill={color} />
      <circle cx={x2} cy={y2} r="5" fill={color} />
    </svg>
  );
}