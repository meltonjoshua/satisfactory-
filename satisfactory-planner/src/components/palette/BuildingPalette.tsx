import { useFactoryStore } from '../../store/factoryStore';
import { BUILDINGS } from '../../data/gameData';
import type { BuildingCategory, BuildingDef } from '../../types';

const PALETTE_SECTIONS: { label: string; category: BuildingDef['category']; items: BuildingDef[] }[] = [];

const categories: BuildingDef['category'][] = ['production', 'logistics', 'power', 'special'];
const categoryLabels: Record<string, string> = {
  production: 'Production',
  logistics: 'Logistics',
  power: 'Power',
  special: 'Special',
};

for (const cat of categories) {
  const items = BUILDINGS.filter(b => b.category === cat);
  const seen = new Set<string>();
  const unique = items.filter(b => {
    if (seen.has(b.id)) return false;
    seen.add(b.id);
    return true;
  });
  if (unique.length > 0) {
    PALETTE_SECTIONS.push({ label: categoryLabels[cat], category: cat, items: unique });
  }
}

interface PaletteItemProps {
  building: BuildingDef;
  onDragStart: (e: React.DragEvent, buildingType: BuildingCategory) => void;
}

function PaletteItem({ building, onDragStart }: PaletteItemProps) {
  const addBuilding = useFactoryStore(s => s.addBuilding);

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, building.id);
  };

  const handleClick = () => {
    const id = addBuilding(building.id, 5, 5);
    useFactoryStore.getState().selectBuilding(id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      className="palette-item"
      style={{ borderLeftColor: building.color }}
      title={building.description}
    >
      <span className="palette-icon">{building.icon}</span>
      <span className="palette-name">{building.name}</span>
      {building.powerConsumption > 0 && (
        <span className="palette-power">{building.powerConsumption}MW</span>
      )}
      {building.powerProduction && (
        <span className="palette-power gen">{building.powerProduction}MW</span>
      )}
    </div>
  );
}

export default function BuildingPalette({ onDragStart }: { onDragStart: (e: React.DragEvent, buildingType: BuildingCategory) => void }) {
  return (
    <div className="building-palette">
      <h2 className="palette-header">Buildings</h2>
      <div className="palette-search">
        <input type="text" placeholder="Search buildings..." className="palette-search-input" />
      </div>
      {PALETTE_SECTIONS.map(section => (
        <div key={section.label} className="palette-section">
          <h3 className="palette-section-title">{section.label}</h3>
          <div className="palette-items">
            {section.items.map(building => (
              <PaletteItem key={building.id} building={building} onDragStart={onDragStart} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}