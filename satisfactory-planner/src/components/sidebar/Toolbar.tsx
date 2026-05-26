import { useCallback } from 'react';
import { useFactoryStore } from '../../store/factoryStore';
import { calculatePowerBalance } from '../../utils/calculations';
import type { ViewMode } from '../../types';

const VIEW_MODES: { id: ViewMode; label: string; icon: string }[] = [
  { id: 'grid', label: 'Grid', icon: '🏗️' },
  { id: 'connections', label: 'Nodes', icon: '🔗' },
  { id: 'calculator', label: 'Calculator', icon: '🔢' },
  { id: 'power', label: 'Power', icon: '⚡' },
  { id: 'map', label: 'Map', icon: '🗺️' },
];

export default function Toolbar() {
  const viewMode = useFactoryStore(s => s.viewMode);
  const setViewMode = useFactoryStore(s => s.setViewMode);
  const factoryName = useFactoryStore(s => s.factoryName);
  const setFactoryName = useFactoryStore(s => s.setFactoryName);
  const showPowerOverlay = useFactoryStore(s => s.showPowerOverlay);
  const togglePowerOverlay = useFactoryStore(s => s.togglePowerOverlay);
  const showThroughputOverlay = useFactoryStore(s => s.showThroughputOverlay);
  const toggleThroughputOverlay = useFactoryStore(s => s.toggleThroughputOverlay);
  const saveVersion = useFactoryStore(s => s.saveVersion);
  const buildings = useFactoryStore(s => s.buildings);
  const powerBalance = calculatePowerBalance();

  const handleExport = useCallback(() => {
    const state = useFactoryStore.getState();
    const data = JSON.stringify({
      buildings: state.buildings,
      connections: state.connections,
      factoryName: state.factoryName,
    }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.factoryName.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        const data = JSON.parse(text);
        useFactoryStore.getState().loadState({
          buildings: data.buildings ?? [],
          connections: data.connections ?? [],
          factoryName: data.factoryName ?? 'Imported Factory',
        });
      } catch {
        alert('Invalid file format');
      }
    };
    input.click();
  }, []);

  const handleShare = useCallback(() => {
    const state = useFactoryStore.getState();
    const data = btoa(JSON.stringify({
      buildings: state.buildings,
      connections: state.connections,
      factoryName: state.factoryName,
    }));
    const url = `${window.location.origin}${window.location.pathname}?share=${encodeURIComponent(data)}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Share link copied to clipboard!');
    }).catch(() => {
      prompt('Copy this share link:', url);
    });
  }, []);

  const handleReset = useCallback(() => {
    if (confirm('Reset the entire factory? This cannot be undone.')) {
      useFactoryStore.getState().reset();
    }
  }, []);

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <input
          className="toolbar-factory-name"
          value={factoryName}
          onChange={(e) => setFactoryName(e.target.value)}
          title="Factory name"
        />
        <div className="toolbar-stats">
          <span className="stat">🏗️ {buildings.length}</span>
          <span className={`stat ${powerBalance.surplus >= 0 ? 'positive' : 'negative'}`}>
            ⚡ {powerBalance.surplus >= 0 ? '+' : ''}{powerBalance.surplus.toFixed(0)}MW
          </span>
        </div>
      </div>

      <div className="toolbar-center">
        {VIEW_MODES.map(mode => (
          <button
            key={mode.id}
            className={`toolbar-view-btn ${viewMode === mode.id ? 'active' : ''}`}
            onClick={() => setViewMode(mode.id)}
            title={mode.label}
          >
            {mode.icon} {mode.label}
          </button>
        ))}
      </div>

      <div className="toolbar-right">
        <button
          className={`toolbar-btn ${showPowerOverlay ? 'active' : ''}`}
          onClick={togglePowerOverlay}
          title="Toggle power overlay"
        >
          ⚡ Power
        </button>
        <button
          className={`toolbar-btn ${showThroughputOverlay ? 'active' : ''}`}
          onClick={toggleThroughputOverlay}
          title="Toggle throughput overlay"
        >
          📊 Throughput
        </button>
        <div className="toolbar-separator" />
        <button className="toolbar-btn" onClick={saveVersion} title="Save version">💾 Save</button>
        <button className="toolbar-btn" onClick={handleExport} title="Export factory">📤 Export</button>
        <button className="toolbar-btn" onClick={handleImport} title="Import factory">📥 Import</button>
        <button className="toolbar-btn" onClick={handleShare} title="Share link">🔗 Share</button>
        <div className="toolbar-separator" />
        <button className="toolbar-btn danger" onClick={handleReset} title="Reset factory">🗑️ Reset</button>
      </div>
    </div>
  );
}