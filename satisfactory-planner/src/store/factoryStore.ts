import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import type { PlacedBuilding, Connection, ViewMode, BuildingCategory, BeltTier, PipeTier } from '../types';

interface FactoryStore {
  buildings: PlacedBuilding[];
  connections: Connection[];
  viewMode: ViewMode;
  selectedBuildingId: string | null;
  gridZoom: number;
  gridOffsetX: number;
  gridOffsetY: number;
  showPowerOverlay: boolean;
  showThroughputOverlay: boolean;
  factoryName: string;
  versionHistory: { version: number; timestamp: number; snapshot: string }[];
  currentVersion: number;

  addBuilding: (buildingType: BuildingCategory, gridX: number, gridY: number) => string;
  removeBuilding: (id: string) => void;
  moveBuilding: (id: string, gridX: number, gridY: number) => void;
  updateBuilding: (id: string, updates: Partial<PlacedBuilding>) => void;
  setBuildingRecipe: (id: string, recipeId: string | null) => void;
  setBuildingOverclock: (id: string, overclock: number) => void;
  selectBuilding: (id: string | null) => void;

  addConnection: (sourceId: string, sourcePort: string, targetId: string, targetPort: string, type: 'item' | 'fluid' | 'power', beltType?: BeltTier, pipeType?: PipeTier) => string;
  removeConnection: (id: string) => void;
  updateConnection: (id: string, updates: Partial<Connection>) => void;

  setViewMode: (mode: ViewMode) => void;
  setGridZoom: (zoom: number) => void;
  setGridOffset: (x: number, y: number) => void;
  togglePowerOverlay: () => void;
  toggleThroughputOverlay: () => void;
  setFactoryName: (name: string) => void;

  saveVersion: () => void;
  loadVersion: (version: number) => void;

  loadState: (state: Partial<FactoryStore>) => void;
  reset: () => void;
}

const initialState = {
  buildings: [],
  connections: [],
  viewMode: 'grid' as ViewMode,
  selectedBuildingId: null as string | null,
  gridZoom: 1,
  gridOffsetX: 0,
  gridOffsetY: 0,
  showPowerOverlay: false,
  showThroughputOverlay: false,
  factoryName: 'My Factory',
  versionHistory: [],
  currentVersion: 0,
};

export const useFactoryStore = create<FactoryStore>((set, get) => ({
  ...initialState,

  addBuilding: (buildingType, gridX, gridY) => {
    const id = uuid();
    const building: PlacedBuilding = {
      id,
      buildingType,
      gridX,
      gridY,
      recipe: null,
      overclock: 1,
      connections: [],
    };
    set(state => ({ buildings: [...state.buildings, building] }));
    return id;
  },

  removeBuilding: (id) => {
    set(state => ({
      buildings: state.buildings.filter(b => b.id !== id),
      connections: state.connections.filter(c => c.sourceId !== id && c.targetId !== id),
      selectedBuildingId: state.selectedBuildingId === id ? null : state.selectedBuildingId,
    }));
  },

  moveBuilding: (id, gridX, gridY) => {
    set(state => ({
      buildings: state.buildings.map(b => b.id === id ? { ...b, gridX, gridY } : b),
    }));
  },

  updateBuilding: (id, updates) => {
    set(state => ({
      buildings: state.buildings.map(b => b.id === id ? { ...b, ...updates } : b),
    }));
  },

  setBuildingRecipe: (id, recipeId) => {
    set(state => ({
      buildings: state.buildings.map(b => b.id === id ? { ...b, recipe: recipeId } : b),
    }));
  },

  setBuildingOverclock: (id, overclock) => {
    set(state => ({
      buildings: state.buildings.map(b => b.id === id ? { ...b, overclock } : b),
    }));
  },

  selectBuilding: (id) => {
    set({ selectedBuildingId: id });
  },

  addConnection: (sourceId, sourcePort, targetId, targetPort, type, beltType, pipeType) => {
    const id = uuid();
    const connection: Connection = { id, sourceId, sourcePort, targetId, targetPort, type, beltType, pipeType };
    set(state => ({ connections: [...state.connections, connection] }));
    return id;
  },

  removeConnection: (id) => {
    set(state => ({
      connections: state.connections.filter(c => c.id !== id),
    }));
  },

  updateConnection: (id, updates) => {
    set(state => ({
      connections: state.connections.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
  },

  setViewMode: (mode) => {
    set({ viewMode: mode });
  },

  setGridZoom: (zoom) => {
    set({ gridZoom: Math.min(3, Math.max(0.25, zoom)) });
  },

  setGridOffset: (x, y) => {
    set({ gridOffsetX: x, gridOffsetY: y });
  },

  togglePowerOverlay: () => {
    set(state => ({ showPowerOverlay: !state.showPowerOverlay }));
  },

  toggleThroughputOverlay: () => {
    set(state => ({ showThroughputOverlay: !state.showThroughputOverlay }));
  },

  setFactoryName: (name) => {
    set({ factoryName: name });
  },

  saveVersion: () => {
    const state = get();
    const snapshot = JSON.stringify({
      buildings: state.buildings,
      connections: state.connections,
      factoryName: state.factoryName,
    });
    const versionEntry = {
      version: state.currentVersion + 1,
      timestamp: Date.now(),
      snapshot,
    };
    set(state => ({
      versionHistory: [...state.versionHistory, versionEntry],
      currentVersion: state.currentVersion + 1,
    }));
  },

  loadVersion: (version) => {
    const state = get();
    const entry = state.versionHistory.find(v => v.version === version);
    if (entry) {
      const parsed = JSON.parse(entry.snapshot);
      set({
        buildings: parsed.buildings,
        connections: parsed.connections,
        factoryName: parsed.factoryName,
        currentVersion: version,
      });
    }
  },

  loadState: (newState) => {
    set(newState);
  },

  reset: () => {
    set(initialState);
  },
}));