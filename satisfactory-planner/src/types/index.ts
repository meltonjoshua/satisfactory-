export type BuildingCategory = 'miner' | 'smelter' | 'foundry' | 'constructor' | 'assembler' | 'manufacturer' | 'refinery' | 'packager' | 'blender' | 'particle-accelerator' | 'converter' | 'generator-coal' | 'generator-fuel' | 'generator-biomass' | 'nuclear-power-plant' | 'storage' | 'conveyor' | 'pipe' | 'power-pole' | 'hub' | 'space-elevator' | 'awesome-sink' | 'truck-station' | 'train-station';

export type Tier = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface BuildingDef {
  id: BuildingCategory;
  name: string;
  description: string;
  category: 'production' | 'logistics' | 'power' | 'special';
  width: number;
  height: number;
  powerConsumption: number;
  powerProduction?: number;
  overclockable: boolean;
  maxOverclock: number;
  tier: Tier;
  color: string;
  icon: string;
}

export interface Recipe {
  id: string;
  name: string;
  building: BuildingCategory;
  inputs: RecipeIO[];
  outputs: RecipeIO[];
  durationSeconds: number;
  tier: Tier;
}

export interface RecipeIO {
  item: string;
  amount: number;
  perMinute?: number;
}

export interface ItemDef {
  id: string;
  name: string;
  category: string;
  stackSize: number;
  fluid: boolean;
  color: string;
  icon: string;
}

export interface PlacedBuilding {
  id: string;
  buildingType: BuildingCategory;
  gridX: number;
  gridY: number;
  recipe: string | null;
  overclock: number;
  connections: Connection[];
}

export interface Connection {
  id: string;
  sourceId: string;
  sourcePort: string;
  targetId: string;
  targetPort: string;
  type: 'item' | 'fluid' | 'power';
  beltType?: BeltTier;
  pipeType?: PipeTier;
}

export type BeltTier = 'mk1' | 'mk2' | 'mk3' | 'mk4' | 'mk5';
export type PipeTier = 'mk1' | 'mk2';

export interface BeltDef {
  id: BeltTier;
  name: string;
  throughput: number;
  color: string;
}

export interface PipeDef {
  id: PipeTier;
  name: string;
  throughput: number;
  color: string;
}

export type ViewMode = 'grid' | 'connections' | 'map' | 'calculator' | 'power';

export interface FactoryState {
  id: string;
  name: string;
  buildings: PlacedBuilding[];
  connections: Connection[];
  viewMode: ViewMode;
  selectedBuildingId: string | null;
  gridZoom: number;
  gridOffsetX: number;
  gridOffsetY: number;
  showPowerOverlay: boolean;
  showThroughputOverlay: boolean;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export interface ThroughputIssue {
  connectionId: string;
  required: number;
  capacity: number;
  type: 'bottleneck' | 'warning' | 'ok';
}

export interface PowerBalance {
  production: number;
  consumption: number;
  surplus: number;
  percentage: number;
}

export interface ProductionCalculation {
  buildingId: string;
  recipe: Recipe | null;
  inputsPerMinute: RecipeIO[];
  outputsPerMinute: RecipeIO[];
  powerConsumption: number;
  utilization: number;
}