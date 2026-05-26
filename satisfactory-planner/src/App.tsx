import { useCallback, useEffect } from 'react';
import { useFactoryStore } from './store/factoryStore';
import BuildingPalette from './components/palette/BuildingPalette';
import FactoryGrid from './components/grid/FactoryGrid';
import ConnectionView from './components/connections/ConnectionView';
import Sidebar from './components/sidebar/Sidebar';
import Toolbar from './components/sidebar/Toolbar';
import CalculatorPanel from './components/calculator/CalculatorPanel';
import MapView from './components/map/MapView';
import type { BuildingCategory } from './types';

function App() {
  const viewMode = useFactoryStore(s => s.viewMode);

  const handleDragStart = useCallback((e: React.DragEvent, buildingType: BuildingCategory) => {
    e.dataTransfer.setData('buildingType', buildingType);
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareData = params.get('share');
    if (shareData) {
      try {
        const data = JSON.parse(atob(shareData));
        useFactoryStore.getState().loadState({
          buildings: data.buildings ?? [],
          connections: data.connections ?? [],
          factoryName: data.factoryName ?? 'Shared Factory',
        });
        const url = new URL(window.location.href);
        url.searchParams.delete('share');
        window.history.replaceState({}, '', url.toString());
      } catch {
        console.error('Failed to load shared factory');
      }
    }
  }, []);

  return (
    <div className="app">
      <Toolbar />
      <div className="app-body">
        {viewMode !== 'calculator' && viewMode !== 'map' && (
          <BuildingPalette onDragStart={handleDragStart} />
        )}
        <div className="app-content">
          {viewMode === 'grid' && <FactoryGrid />}
          {viewMode === 'connections' && <ConnectionView />}
          {viewMode === 'calculator' && <CalculatorPanel />}
          {viewMode === 'map' && <MapView />}
          {viewMode === 'power' && <CalculatorPanel />}
        </div>
        <Sidebar />
      </div>
    </div>
  );
}

export default App;