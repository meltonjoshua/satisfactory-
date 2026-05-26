import { useFactoryStore } from '../../store/factoryStore';
import { BUILDING_MAP, getRecipesForBuilding, RECIPE_MAP, calculatePerMinute } from '../../data/gameData';
import { calculatePowerBalance, calculateBottleneckAnalysis } from '../../utils/calculations';

export default function Sidebar() {
  const selectedBuildingId = useFactoryStore(s => s.selectedBuildingId);
  const buildings = useFactoryStore(s => s.buildings);
  const setBuildingRecipe = useFactoryStore(s => s.setBuildingRecipe);
  const setBuildingOverclock = useFactoryStore(s => s.setBuildingOverclock);
  const removeBuilding = useFactoryStore(s => s.removeBuilding);
  const addConnection = useFactoryStore(s => s.addConnection);
  const viewMode = useFactoryStore(s => s.viewMode);

  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId);

  if (viewMode === 'calculator') return <CalculatorSidebar />;
  if (viewMode === 'power') return <PowerSidebar />;

  if (!selectedBuilding) {
    return (
      <div className="sidebar">
        <div className="sidebar-empty">
          <div className="sidebar-empty-icon">🏭</div>
          <h3>No Building Selected</h3>
          <p>Click a building on the grid to configure it, or drag one from the palette.</p>
          <div className="sidebar-tips">
            <h4>Tips</h4>
            <ul>
              <li>Drag buildings from the palette to the grid</li>
              <li>Right-click to delete a building</li>
              <li>Scroll to zoom, middle-click to pan</li>
              <li>Use the Calculator view for production analysis</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const def = BUILDING_MAP[selectedBuilding.buildingType];
  if (!def) return null;

  const recipes = getRecipesForBuilding(selectedBuilding.buildingType);
  const currentRecipe = selectedBuilding.recipe ? RECIPE_MAP[selectedBuilding.recipe] : null;
  const perMin = currentRecipe ? calculatePerMinute(currentRecipe, selectedBuilding.overclock) : null;

  return (
    <div className="sidebar">
      <div className="sidebar-header" style={{ borderColor: def.color }}>
        <span className="sidebar-icon">{def.icon}</span>
        <div>
          <h3>{def.name}</h3>
          <p className="sidebar-description">{def.description}</p>
        </div>
      </div>

      <div className="sidebar-section">
        <h4>Position</h4>
        <div className="sidebar-position">
          <span>X: {selectedBuilding.gridX}</span>
          <span>Y: {selectedBuilding.gridY}</span>
          <span>Size: {def.width}x{def.height}</span>
        </div>
      </div>

      {recipes.length > 0 && (
        <div className="sidebar-section">
          <h4>Recipe</h4>
          <select
            className="sidebar-select"
            value={selectedBuilding.recipe ?? ''}
            onChange={(e) => setBuildingRecipe(selectedBuilding.id, e.target.value || null)}
          >
            <option value="">Select a recipe...</option>
            {recipes.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      )}

      {def.overclockable && (
        <div className="sidebar-section">
          <h4>Overclock: {Math.round(selectedBuilding.overclock * 100)}%</h4>
          <input
            type="range"
            min="1"
            max={def.maxOverclock}
            value={Math.round(selectedBuilding.overclock * 100)}
            onChange={(e) => setBuildingOverclock(selectedBuilding.id, parseInt(e.target.value) / 100)}
            className="sidebar-slider"
          />
          <div className="sidebar-slider-labels">
            <span>1%</span>
            <span>{def.maxOverclock}%</span>
          </div>
        </div>
      )}

      {perMin && (
        <div className="sidebar-section">
          <h4>Production Rates</h4>
          <div className="sidebar-io">
            <div className="sidebar-io-col">
              <h5>Inputs</h5>
              {perMin.inputs.map((io: { item: string; perMinute: number }, i: number) => (
                <div key={i} className="io-item">
                  <span className="io-name">{io.item.replace(/-/g, ' ')}</span>
                  <span className="io-rate">{io.perMinute.toFixed(1)}/min</span>
                </div>
              ))}
            </div>
            <div className="sidebar-io-arrow">→</div>
            <div className="sidebar-io-col">
              <h5>Outputs</h5>
              {perMin.outputs.map((io: { item: string; perMinute: number }, i: number) => (
                <div key={i} className="io-item">
                  <span className="io-name">{io.item.replace(/-/g, ' ')}</span>
                  <span className="io-rate">{io.perMinute.toFixed(1)}/min</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {def.powerConsumption > 0 && (
        <div className="sidebar-section">
          <h4>Power</h4>
          <div className="sidebar-power">
            <span>Consumption: {Math.round(def.powerConsumption * selectedBuilding.overclock)} MW</span>
          </div>
        </div>
      )}
      {def.powerProduction && (
        <div className="sidebar-section">
          <h4>Power</h4>
          <div className="sidebar-power">
            <span className="power-gen">Production: +{Math.round(def.powerProduction * selectedBuilding.overclock)} MW</span>
          </div>
        </div>
      )}

      <div className="sidebar-section">
        <h4>Connect to...</h4>
        <div className="sidebar-connections">
          {buildings.filter(b => b.id !== selectedBuilding.id).map(b => {
            const bDef = BUILDING_MAP[b.buildingType];
            return (
              <button key={b.id} className="sidebar-connect-btn" onClick={() => {
                addConnection(
                  selectedBuilding.id,
                  'source',
                  b.id,
                  'target',
                  'item',
                  'mk3',
                );
              }}>
                {bDef?.icon} {bDef?.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="sidebar-actions">
        <button className="sidebar-btn danger" onClick={() => removeBuilding(selectedBuilding.id)}>
          Delete Building
        </button>
      </div>
    </div>
  );
}

function CalculatorSidebar() {
  const buildings = useFactoryStore(s => s.buildings);
  const bottlenecks = calculateBottleneckAnalysis();

  const totals: Record<string, { produced: number; consumed: number }> = {};

  for (const building of buildings) {
    if (!building.recipe) continue;
    const recipe = RECIPE_MAP[building.recipe];
    if (!recipe) continue;
    const { inputs, outputs } = calculatePerMinute(recipe, building.overclock);
    for (const output of outputs) {
      if (!totals[output.item]) totals[output.item] = { produced: 0, consumed: 0 };
      totals[output.item].produced += output.perMinute;
    }
    for (const input of inputs) {
      if (!totals[input.item]) totals[input.item] = { produced: 0, consumed: 0 };
      totals[input.item].consumed += input.perMinute;
    }
  }

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h3>Production Calculator</h3>
        <p className="sidebar-description">Analyzes your entire factory's production balance.</p>
      </div>

      <div className="sidebar-section">
        <h4>Item Balance</h4>
        <div className="calculator-items">
          {Object.entries(totals)
            .sort((a, b) => b[1].produced + b[1].consumed - a[1].produced - a[1].consumed)
            .map(([item, data]) => {
              const surplus = data.produced - data.consumed;
              return (
                <div key={item} className={`calculator-item ${surplus < 0 ? 'deficit' : surplus > 0 ? 'surplus' : 'balanced'}`}>
                  <span className="calc-item-name">{item.replace(/-/g, ' ')}</span>
                  <div className="calc-item-bars">
                    <div className="calc-bar produced" style={{ width: `${Math.min(data.produced / 100, 100)}%` }}>
                      {data.produced.toFixed(1)}/min
                    </div>
                    <div className="calc-bar consumed" style={{ width: `${Math.min(data.consumed / 100, 100)}%` }}>
                      {data.consumed.toFixed(1)}/min
                    </div>
                  </div>
                  <span className="calc-surplus">{surplus >= 0 ? '+' : ''}{surplus.toFixed(1)}/min</span>
                </div>
              );
            })}
        </div>
      </div>

      {bottlenecks.length > 0 && (
        <div className="sidebar-section">
          <h4>Bottlenecks</h4>
          <div className="bottleneck-list">
            {bottlenecks.map((b, i) => (
              <div key={i} className="bottleneck-item">
                <span>⚡ {b.itemName.replace(/-/g, ' ')}: short by {b.shortage.toFixed(1)}/min</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {Object.keys(totals).length === 0 && (
        <div className="sidebar-empty">
          <p>No recipes assigned yet. Select buildings and assign recipes to see production calculations.</p>
        </div>
      )}
    </div>
  );
}

function PowerSidebar() {
  const buildings = useFactoryStore(s => s.buildings);
  const powerBalance = calculatePowerBalance();

  const generators = buildings.filter(b => {
    const def = BUILDING_MAP[b.buildingType];
    return def && def.powerProduction;
  });

  const consumers = buildings.filter(b => {
    const def = BUILDING_MAP[b.buildingType];
    return def && def.powerConsumption > 0 && !def.powerProduction;
  });

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h3>Power Management</h3>
        <div className="power-summary">
          <div className={`power-balance ${powerBalance.surplus >= 0 ? 'surplus' : 'deficit'}`}>
            <div className="power-stat">
              <span className="power-label">Production</span>
              <span className="power-value gen">+{powerBalance.production.toFixed(0)} MW</span>
            </div>
            <div className="power-stat">
              <span className="power-label">Consumption</span>
              <span className="power-value con">-{powerBalance.consumption.toFixed(0)} MW</span>
            </div>
            <div className="power-divider"></div>
            <div className="power-stat">
              <span className="power-label">Balance</span>
              <span className={`power-value ${powerBalance.surplus >= 0 ? 'gen' : 'con'}`}>
                {powerBalance.surplus >= 0 ? '+' : ''}{powerBalance.surplus.toFixed(0)} MW
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <h4>Generators ({generators.length})</h4>
        <div className="power-list">
          {generators.map(b => {
            const def = BUILDING_MAP[b.buildingType];
            if (!def || !def.powerProduction) return null;
            return (
              <div key={b.id} className="power-item gen">
                <span>{def.icon} {def.name}</span>
                <span>+{Math.round(def.powerProduction * b.overclock)} MW</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sidebar-section">
        <h4>Consumers ({consumers.length})</h4>
        <div className="power-list">
          {consumers.map(b => {
            const def = BUILDING_MAP[b.buildingType];
            if (!def) return null;
            return (
              <div key={b.id} className="power-item con">
                <span>{def.icon} {def.name}</span>
                <span>-{Math.round(def.powerConsumption * b.overclock)} MW</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}