import { useFactoryStore } from '../../store/factoryStore';
import { calculatePowerBalance, calculateProduction } from '../../utils/calculations';
import { BUILDING_MAP, RECIPE_MAP } from '../../data/gameData';

export default function CalculatorPanel() {
  const buildings = useFactoryStore(s => s.buildings);
  const setViewMode = useFactoryStore(s => s.setViewMode);

  const calculations = buildings
    .filter(b => b.recipe)
    .map(b => calculateProduction(b.id))
    .filter(Boolean);

  const powerBalance = calculatePowerBalance();

  const totalInputItems: Record<string, { amount: number; isRaw: boolean }> = {};
  const totalOutputItems: Record<string, { amount: number; isIntermediate: boolean }> = {};

  for (const calc of calculations) {
    if (!calc) continue;
    for (const input of calc.inputsPerMinute) {
      if (!totalInputItems[input.item]) totalInputItems[input.item] = { amount: 0, isRaw: false };
      totalInputItems[input.item].amount += input.perMinute ?? 0;
    }
    for (const output of calc.outputsPerMinute) {
      if (!totalOutputItems[output.item]) totalOutputItems[output.item] = { amount: 0, isIntermediate: false };
      totalOutputItems[output.item].amount += output.perMinute ?? 0;
    }
  }

  for (const item of Object.keys(totalInputItems)) {
    if (totalOutputItems[item]) {
      totalInputItems[item].isRaw = false;
    } else {
      totalInputItems[item].isRaw = true;
    }
  }

  for (const item of Object.keys(totalOutputItems)) {
    if (totalInputItems[item]) {
      totalOutputItems[item].isIntermediate = true;
    } else {
      totalOutputItems[item].isIntermediate = false;
    }
  }

  return (
    <div className="calculator-panel">
      <div className="calculator-toolbar">
        <button className="toolbar-btn" onClick={() => setViewMode('grid')}>← Back to Grid</button>
        <h2>Production Calculator</h2>
      </div>

      <div className="calculator-grid">
        <div className="calculator-section">
          <h3>Power Overview</h3>
          <div className={`power-banner ${powerBalance.surplus >= 0 ? 'surplus' : 'deficit'}`}>
            <div className="power-banner-stat">
              <span>Production</span>
              <strong>+{powerBalance.production.toFixed(0)} MW</strong>
            </div>
            <div className="power-banner-stat">
              <span>Consumption</span>
              <strong>-{powerBalance.consumption.toFixed(0)} MW</strong>
            </div>
            <div className="power-banner-divider" />
            <div className="power-banner-stat">
              <span>Balance</span>
              <strong className={powerBalance.surplus >= 0 ? 'positive' : 'negative'}>
                {powerBalance.surplus >= 0 ? '+' : ''}{powerBalance.surplus.toFixed(0)} MW
              </strong>
            </div>
            {powerBalance.consumption > 0 && (
              <div className="power-progress">
                <div
                  className="power-progress-bar"
                  style={{
                    width: `${Math.min(powerBalance.production / powerBalance.consumption * 100, 100)}%`,
                    backgroundColor: powerBalance.surplus >= 0 ? '#4CAF50' : '#FF5252',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="calculator-section">
          <h3>Raw Inputs Required</h3>
          <div className="calc-items-grid">
            {Object.entries(totalInputItems)
              .filter(([, data]) => data.isRaw)
              .sort((a, b) => b[1].amount - a[1].amount)
              .map(([item, data]) => (
                <div key={item} className="calc-item-card input">
                  <span className="calc-item-name">{item.replace(/-/g, ' ')}</span>
                  <span className="calc-item-rate">{data.amount.toFixed(1)}/min</span>
                </div>
              ))}
            {Object.values(totalInputItems).filter(d => d.isRaw).length === 0 && (
              <p className="calc-empty">No raw inputs yet. Assign recipes to buildings.</p>
            )}
          </div>
        </div>

        <div className="calculator-section">
          <h3>Final Outputs</h3>
          <div className="calc-items-grid">
            {Object.entries(totalOutputItems)
              .filter(([, data]) => !data.isIntermediate)
              .sort((a, b) => b[1].amount - a[1].amount)
              .map(([item, data]) => (
                <div key={item} className="calc-item-card output">
                  <span className="calc-item-name">{item.replace(/-/g, ' ')}</span>
                  <span className="calc-item-rate">{data.amount.toFixed(1)}/min</span>
                </div>
              ))}
            {Object.values(totalOutputItems).filter(d => !d.isIntermediate).length === 0 && (
              <p className="calc-empty">No final outputs yet.</p>
            )}
          </div>
        </div>

        <div className="calculator-section">
          <h3>Building Breakdown</h3>
          <div className="calc-buildings-grid">
            {buildings.filter(b => b.recipe).map(building => {
              const def = BUILDING_MAP[building.buildingType];
              const recipe = building.recipe ? RECIPE_MAP[building.recipe] : null;
              const calc = calculateProduction(building.id);
              if (!def) return null;

              return (
                <div key={building.id} className="calc-building-card">
                  <div className="calc-building-header" style={{ borderColor: def.color }}>
                    <span>{def.icon} {def.name}</span>
                    <span className="calc-recipe">{recipe?.name ?? 'No recipe'}</span>
                  </div>
                  {calc && (
                    <div className="calc-building-details">
                      <div className="calc-io-col">
                        <strong>Inputs:</strong>
                        {calc.inputsPerMinute.map((io, i) => (
                          <div key={i}>{io.item.replace(/-/g, ' ')}: {(io.perMinute ?? 0).toFixed(1)}/min</div>
                        ))}
                      </div>
                      <div className="calc-io-col">
                        <strong>Outputs:</strong>
                        {calc.outputsPerMinute.map((io, i) => (
                          <div key={i}>{io.item.replace(/-/g, ' ')}: {(io.perMinute ?? 0).toFixed(1)}/min</div>
                        ))}
                      </div>
                      <div className="calc-power-line">
                        ⚡ {calc.powerConsumption.toFixed(0)} MW
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {buildings.filter(b => b.recipe).length === 0 && (
              <p className="calc-empty">No buildings with recipes assigned yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}