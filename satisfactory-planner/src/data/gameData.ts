import type { BuildingCategory, BuildingDef, BeltDef, PipeDef, ItemDef } from '../types';

export const BELT_DEFS: Record<BeltTier, BeltDef> = {
  mk1: { id: 'mk1', name: 'Conveyor Belt Mk.1', throughput: 60, color: '#8B7355' },
  mk2: { id: 'mk2', name: 'Conveyor Belt Mk.2', throughput: 120, color: '#A0522D' },
  mk3: { id: 'mk3', name: 'Conveyor Belt Mk.3', throughput: 270, color: '#CD853F' },
  mk4: { id: 'mk4', name: 'Conveyor Belt Mk.4', throughput: 480, color: '#DAA520' },
  mk5: { id: 'mk5', name: 'Conveyor Belt Mk.5', throughput: 780, color: '#FFD700' },
} as const;

export type BeltTier = 'mk1' | 'mk2' | 'mk3' | 'mk4' | 'mk5';

export const PIPE_DEFS: Record<PipeTier, PipeDef> = {
  mk1: { id: 'mk1', name: 'Pipeline Mk.1', throughput: 300, color: '#4A90D9' },
  mk2: { id: 'mk2', name: 'Pipeline Mk.2', throughput: 600, color: '#6BB5FF' },
} as const;

export type PipeTier = 'mk1' | 'mk2';

export const BUILDINGS: BuildingDef[] = [
  { id: 'miner', name: 'Miner Mk.1', description: 'Extracts resources from resource nodes', category: 'production', width: 2, height: 2, powerConsumption: 5, overclockable: true, maxOverclock: 250, tier: 1, color: '#6B8E23', icon: '⛏️' },
  { id: 'miner', name: 'Miner Mk.2', description: 'Faster resource extraction', category: 'production', width: 2, height: 2, powerConsumption: 12, overclockable: true, maxOverclock: 250, tier: 3, color: '#8FBC8F', icon: '⛏️' },
  { id: 'smelter', name: 'Smelter', description: 'Smelts ores into ingots', category: 'production', width: 2, height: 2, powerConsumption: 4, overclockable: true, maxOverclock: 250, tier: 0, color: '#FF6347', icon: '🔥' },
  { id: 'foundry', name: 'Foundry', description: 'Combines ores into alloys', category: 'production', width: 3, height: 2, powerConsumption: 16, overclockable: true, maxOverclock: 250, tier: 2, color: '#B22222', icon: '🏭' },
  { id: 'constructor', name: 'Constructor', description: 'Crafts basic components', category: 'production', width: 2, height: 2, powerConsumption: 4, overclockable: true, maxOverclock: 250, tier: 0, color: '#4682B4', icon: '🔧' },
  { id: 'assembler', name: 'Assembler', description: 'Assembles parts from components', category: 'production', width: 3, height: 2, powerConsumption: 15, overclockable: true, maxOverclock: 250, tier: 1, color: '#5F9EA0', icon: '🔩' },
  { id: 'manufacturer', name: 'Manufacturer', description: 'Manufactures complex parts', category: 'production', width: 4, height: 3, powerConsumption: 55, overclockable: true, maxOverclock: 250, tier: 4, color: '#7B68EE', icon: '⚙️' },
  { id: 'refinery', name: 'Refinery', description: 'Refines fluids and solid materials', category: 'production', width: 3, height: 3, powerConsumption: 30, overclockable: true, maxOverclock: 250, tier: 3, color: '#3CB371', icon: '🛢️' },
  { id: 'packager', name: 'Packager', description: 'Packages and unpacks fluids', category: 'production', width: 2, height: 2, powerConsumption: 10, overclockable: true, maxOverclock: 250, tier: 3, color: '#20B2AA', icon: '📦' },
  { id: 'blender', name: 'Blender', description: 'Blends multiple inputs', category: 'production', width: 3, height: 3, powerConsumption: 75, overclockable: true, maxOverclock: 250, tier: 6, color: '#9370DB', icon: '🔮' },
  { id: 'particle-accelerator', name: 'Particle Accelerator', description: 'Accelerates particles for advanced recipes', category: 'production', width: 5, height: 3, powerConsumption: 500, overclockable: true, maxOverclock: 250, tier: 7, color: '#4169E1', icon: '⚛️' },
  { id: 'converter', name: 'Converter', description: 'Converts matter between forms', category: 'production', width: 3, height: 3, powerConsumption: 200, overclockable: true, maxOverclock: 250, tier: 8, color: '#8A2BE2', icon: '🫧' },
  { id: 'generator-biomass', name: 'Biomass Burner', description: 'Burns biomass for power', category: 'power', width: 2, height: 2, powerConsumption: 0, powerProduction: 30, overclockable: false, maxOverclock: 100, tier: 0, color: '#228B22', icon: '🌿' },
  { id: 'generator-coal', name: 'Coal Generator', description: 'Burns coal for power', category: 'power', width: 3, height: 2, powerConsumption: 0, powerProduction: 75, overclockable: true, maxOverclock: 250, tier: 1, color: '#2F4F4F', icon: '⚡' },
  { id: 'generator-fuel', name: 'Fuel Generator', description: 'Burns fuel for power', category: 'power', width: 2, height: 2, powerConsumption: 0, powerProduction: 250, overclockable: true, maxOverclock: 250, tier: 3, color: '#B8860B', icon: '⚡' },
  { id: 'nuclear-power-plant', name: 'Nuclear Power Plant', description: 'Generates power from nuclear fuel', category: 'power', width: 5, height: 5, powerConsumption: 0, powerProduction: 2500, overclockable: true, maxOverclock: 250, tier: 6, color: '#FFD700', icon: '☢️' },
  { id: 'storage', name: 'Storage Container', description: 'Stores items', category: 'logistics', width: 2, height: 2, powerConsumption: 0, overclockable: false, maxOverclock: 100, tier: 0, color: '#A9A9A9', icon: '🗄️' },
  { id: 'conveyor', name: 'Conveyor Pole', description: 'Support for conveyor belts', category: 'logistics', width: 1, height: 1, powerConsumption: 0, overclockable: false, maxOverclock: 100, tier: 0, color: '#D2691E', icon: '🏗️' },
  { id: 'pipe', name: 'Pipeline Support', description: 'Support for pipelines', category: 'logistics', width: 1, height: 1, powerConsumption: 0, overclockable: false, maxOverclock: 100, tier: 0, color: '#4682B4', icon: '🔧' },
  { id: 'power-pole', name: 'Power Pole', description: 'Distributes power', category: 'logistics', width: 1, height: 1, powerConsumption: 0, overclockable: false, maxOverclock: 100, tier: 0, color: '#DAA520', icon: '🔌' },
  { id: 'hub', name: 'The HUB', description: 'Central command center', category: 'special', width: 3, height: 3, powerConsumption: 0, overclockable: false, maxOverclock: 100, tier: 0, color: '#CD853F', icon: '🏠' },
  { id: 'space-elevator', name: 'Space Elevator', description: 'Sends items to orbit', category: 'special', width: 4, height: 4, powerConsumption: 0, overclockable: false, maxOverclock: 100, tier: 1, color: '#C0C0C0', icon: '🚀' },
  { id: 'awesome-sink', name: 'AWESOME Sink', description: 'Destroys items for coupons', category: 'special', width: 2, height: 2, powerConsumption: 0, overclockable: false, maxOverclock: 100, tier: 1, color: '#00CED1', icon: '🕳️' },
  { id: 'truck-station', name: 'Truck Station', description: 'Loads/unloads trucks', category: 'logistics', width: 3, height: 2, powerConsumption: 20, overclockable: false, maxOverclock: 100, tier: 2, color: '#8B4513', icon: '🚛' },
  { id: 'train-station', name: 'Train Station', description: 'Loads/unloads trains', category: 'logistics', width: 4, height: 3, powerConsumption: 50, overclockable: false, maxOverclock: 100, tier: 4, color: '#708090', icon: '🚂' },
];

export const BUILDING_MAP: Record<string, BuildingDef> = {};
for (const b of BUILDINGS) {
  BUILDING_MAP[b.id] = b;
}

export const ITEMS: ItemDef[] = [
  { id: 'iron-ore', name: 'Iron Ore', category: 'ore', stackSize: 100, fluid: false, color: '#8B7355', icon: '🪨' },
  { id: 'copper-ore', name: 'Copper Ore', category: 'ore', stackSize: 100, fluid: false, color: '#B87333', icon: '🟤' },
  { id: 'limestone', name: 'Limestone', category: 'ore', stackSize: 100, fluid: false, color: '#D3D3D3', icon: '⬜' },
  { id: 'coal', name: 'Coal', category: 'ore', stackSize: 100, fluid: false, color: '#2F2F2F', icon: '⚫' },
  { id: 'caterium-ore', name: 'Caterium Ore', category: 'ore', stackSize: 100, fluid: false, color: '#FFD700', icon: '✨' },
  { id: 'raw-quartz', name: 'Raw Quartz', category: 'ore', stackSize: 100, fluid: false, color: '#E8E8E8', icon: '💎' },
  { id: 'sulfur', name: 'Sulfur', category: 'ore', stackSize: 100, fluid: false, color: '#FFFF00', icon: '🟡' },
  { id: 'bauxite', name: 'Bauxite', category: 'ore', stackSize: 100, fluid: false, color: '#DEB887', icon: '🪨' },
  { id: 'uranium', name: 'Uranium', category: 'ore', stackSize: 100, fluid: false, color: '#00FF00', icon: '☢️' },
  { id: 'crude-oil', name: 'Crude Oil', category: 'fluid', stackSize: 0, fluid: true, color: '#1A1A1A', icon: '🛢️' },
  { id: 'water', name: 'Water', category: 'fluid', stackSize: 0, fluid: true, color: '#4A90D9', icon: '💧' },
  { id: 'iron-ingot', name: 'Iron Ingot', category: 'ingot', stackSize: 100, fluid: false, color: '#A9A9A9', icon: '🪙' },
  { id: 'copper-ingot', name: 'Copper Ingot', category: 'ingot', stackSize: 100, fluid: false, color: '#B87333', icon: '🪙' },
  { id: 'steel-ingot', name: 'Steel Ingot', category: 'ingot', stackSize: 100, fluid: false, color: '#808080', icon: '🪙' },
  { id: 'aluminum-ingot', name: 'Aluminum Ingot', category: 'ingot', stackSize: 100, fluid: false, color: '#C0C0C0', icon: '🪙' },
  { id: 'caterium-ingot', name: 'Caterium Ingot', category: 'ingot', stackSize: 100, fluid: false, color: '#FFD700', icon: '🪙' },
  { id: 'iron-plate', name: 'Iron Plate', category: 'part', stackSize: 200, fluid: false, color: '#B0B0B0', icon: '📋' },
  { id: 'iron-rod', name: 'Iron Rod', category: 'part', stackSize: 200, fluid: false, color: '#A0A0A0', icon: '🔩' },
  { id: 'screw', name: 'Screw', category: 'part', stackSize: 500, fluid: false, color: '#909090', icon: '🔧' },
  { id: 'reinforced-iron-plate', name: 'Reinforced Iron Plate', category: 'part', stackSize: 100, fluid: false, color: '#C0C0C0', icon: '🛡️' },
  { id: 'rotor', name: 'Rotor', category: 'part', stackSize: 100, fluid: false, color: '#707070', icon: '⚙️' },
  { id: 'wire', name: 'Wire', category: 'part', stackSize: 500, fluid: false, color: '#CD7F32', icon: '〰️' },
  { id: 'cable', name: 'Cable', category: 'part', stackSize: 200, fluid: false, color: '#8B4513', icon: '🔌' },
  { id: 'concrete', name: 'Concrete', category: 'part', stackSize: 500, fluid: false, color: '#808080', icon: '🧱' },
  { id: 'steel-beam', name: 'Steel Beam', category: 'part', stackSize: 200, fluid: false, color: '#696969', icon: '📏' },
  { id: 'steel-pipe', name: 'Steel Pipe', category: 'part', stackSize: 200, fluid: false, color: '#5A5A5A', icon: '🔧' },
  { id: 'encased-industrial-beam', name: 'Encased Industrial Beam', category: 'part', stackSize: 100, fluid: false, color: '#505050', icon: '🏗️' },
  { id: 'stator', name: 'Stator', category: 'part', stackSize: 100, fluid: false, color: '#4A4A4A', icon: '⚙️' },
  { id: 'modular-frame', name: 'Modular Frame', category: 'part', stackSize: 50, fluid: false, color: '#404040', icon: '🔲' },
  { id: 'heavy-modular-frame', name: 'Heavy Modular Frame', category: 'part', stackSize: 50, fluid: false, color: '#303030', icon: '🟫' },
  { id: 'motor', name: 'Motor', category: 'part', stackSize: 50, fluid: false, color: '#333333', icon: '⚡' },
  { id: 'circuit-board', name: 'Circuit Board', category: 'part', stackSize: 200, fluid: false, color: '#006400', icon: '📟' },
  { id: 'high-speed-connector', name: 'High-Speed Connector', category: 'part', stackSize: 100, fluid: false, color: '#006400', icon: '🔗' },
  { id: 'supercomputer', name: 'Supercomputer', category: 'part', stackSize: 50, fluid: false, color: '#000080', icon: '💻' },
  { id: 'plastic', name: 'Plastic', category: 'part', stackSize: 200, fluid: false, color: '#FFFFFF', icon: '🫙' },
  { id: 'rubber', name: 'Rubber', category: 'part', stackSize: 200, fluid: false, color: '#2E2E2E', icon: '⚫' },
  { id: 'fuel', name: 'Fuel', category: 'fluid', stackSize: 0, fluid: true, color: '#FF6600', icon: '⛽' },
  { id: 'heavy-oil-residue', name: 'Heavy Oil Residue', category: 'fluid', stackSize: 0, fluid: true, color: '#333333', icon: '🛢️' },
  { id: 'polymer-resin', name: 'Polymer Resin', category: 'fluid', stackSize: 0, fluid: true, color: '#FFCC00', icon: '🟡' },
];

export const ITEM_MAP: Record<string, ItemDef> = {};
for (const item of ITEMS) {
  ITEM_MAP[item.id] = item;
}

export const RECIPES = [
  { id: 'iron-ingot', name: 'Iron Ingot', building: 'smelter' as BuildingCategory, inputs: [{ item: 'iron-ore', amount: 1 }], outputs: [{ item: 'iron-ingot', amount: 1 }], durationSeconds: 2, tier: 0 as const },
  { id: 'copper-ingot', name: 'Copper Ingot', building: 'smelter' as BuildingCategory, inputs: [{ item: 'copper-ore', amount: 1 }], outputs: [{ item: 'copper-ingot', amount: 1 }], durationSeconds: 2, tier: 0 as const },
  { id: 'caterium-ingot', name: 'Caterium Ingot', building: 'smelter' as BuildingCategory, inputs: [{ item: 'caterium-ore', amount: 3 }], outputs: [{ item: 'caterium-ingot', amount: 1 }], durationSeconds: 4, tier: 0 as const },
  { id: 'steel-ingot', name: 'Steel Ingot', building: 'foundry' as BuildingCategory, inputs: [{ item: 'iron-ore', amount: 3 }, { item: 'coal', amount: 3 }], outputs: [{ item: 'steel-ingot', amount: 3 }], durationSeconds: 4, tier: 2 as const },
  { id: 'aluminum-ingot', name: 'Aluminum Ingot', building: 'foundry' as BuildingCategory, inputs: [{ item: 'bauxite', amount: 6 }, { item: 'coal', amount: 3 }], outputs: [{ item: 'aluminum-ingot', amount: 4 }], durationSeconds: 4, tier: 5 as const },
  { id: 'iron-plate', name: 'Iron Plate', building: 'constructor' as BuildingCategory, inputs: [{ item: 'iron-ingot', amount: 1 }], outputs: [{ item: 'iron-plate', amount: 1 }], durationSeconds: 6, tier: 0 as const },
  { id: 'iron-rod', name: 'Iron Rod', building: 'constructor' as BuildingCategory, inputs: [{ item: 'iron-ingot', amount: 1 }], outputs: [{ item: 'iron-rod', amount: 1 }], durationSeconds: 4, tier: 0 as const },
  { id: 'screw', name: 'Screw', building: 'constructor' as BuildingCategory, inputs: [{ item: 'iron-rod', amount: 1 }], outputs: [{ item: 'screw', amount: 4 }], durationSeconds: 6, tier: 0 as const },
  { id: 'concrete', name: 'Concrete', building: 'constructor' as BuildingCategory, inputs: [{ item: 'limestone', amount: 3 }], outputs: [{ item: 'concrete', amount: 4 }], durationSeconds: 4, tier: 0 as const },
  { id: 'wire', name: 'Wire', building: 'constructor' as BuildingCategory, inputs: [{ item: 'copper-ingot', amount: 1 }], outputs: [{ item: 'wire', amount: 2 }], durationSeconds: 4, tier: 0 as const },
  { id: 'cable', name: 'Cable', building: 'constructor' as BuildingCategory, inputs: [{ item: 'wire', amount: 2 }], outputs: [{ item: 'cable', amount: 1 }], durationSeconds: 2, tier: 0 as const },
  { id: 'reinforced-iron-plate', name: 'Reinforced Iron Plate', building: 'assembler' as BuildingCategory, inputs: [{ item: 'iron-plate', amount: 6 }, { item: 'screw', amount: 12 }], outputs: [{ item: 'reinforced-iron-plate', amount: 1 }], durationSeconds: 12, tier: 1 as const },
  { id: 'rotor', name: 'Rotor', building: 'assembler' as BuildingCategory, inputs: [{ item: 'iron-rod', amount: 5 }, { item: 'screw', amount: 25 }], outputs: [{ item: 'rotor', amount: 1 }], durationSeconds: 15, tier: 1 as const },
  { id: 'modular-frame', name: 'Modular Frame', building: 'assembler' as BuildingCategory, inputs: [{ item: 'reinforced-iron-plate', amount: 2 }, { item: 'iron-rod', amount: 12 }], outputs: [{ item: 'modular-frame', amount: 2 }], durationSeconds: 60, tier: 1 as const },
  { id: 'encased-industrial-beam', name: 'Encased Industrial Beam', building: 'assembler' as BuildingCategory, inputs: [{ item: 'steel-ingot', amount: 4 }, { item: 'concrete', amount: 12 }], outputs: [{ item: 'encased-industrial-beam', amount: 1 }], durationSeconds: 10, tier: 2 as const },
  { id: 'stator', name: 'Stator', building: 'assembler' as BuildingCategory, inputs: [{ item: 'steel-pipe', amount: 3 }, { item: 'wire', amount: 8 }], outputs: [{ item: 'stator', amount: 1 }], durationSeconds: 12, tier: 2 as const },
  { id: 'motor', name: 'Motor', building: 'assembler' as BuildingCategory, inputs: [{ item: 'rotor', amount: 1 }, { item: 'stator', amount: 1 }], outputs: [{ item: 'motor', amount: 1 }], durationSeconds: 12, tier: 2 as const },
  { id: 'steel-beam', name: 'Steel Beam', building: 'constructor' as BuildingCategory, inputs: [{ item: 'steel-ingot', amount: 4 }], outputs: [{ item: 'steel-beam', amount: 1 }], durationSeconds: 4, tier: 2 as const },
  { id: 'steel-pipe', name: 'Steel Pipe', building: 'constructor' as BuildingCategory, inputs: [{ item: 'steel-ingot', amount: 3 }], outputs: [{ item: 'steel-pipe', amount: 2 }], durationSeconds: 6, tier: 2 as const },
  { id: 'heavy-modular-frame', name: 'Heavy Modular Frame', building: 'assembler' as BuildingCategory, inputs: [{ item: 'modular-frame', amount: 5 }, { item: 'steel-pipe', amount: 15 }], outputs: [{ item: 'heavy-modular-frame', amount: 1 }], durationSeconds: 30, tier: 4 as const },
  { id: 'circuit-board', name: 'Circuit Board', building: 'assembler' as BuildingCategory, inputs: [{ item: 'copper-sheet', amount: 2 }, { item: 'plastic', amount: 3 }], outputs: [{ item: 'circuit-board', amount: 1 }], durationSeconds: 8, tier: 4 as const },
  { id: 'fuel', name: 'Fuel', building: 'refinery' as BuildingCategory, inputs: [{ item: 'crude-oil', amount: 6 }], outputs: [{ item: 'fuel', amount: 4 }, { item: 'polymer-resin', amount: 3 }], durationSeconds: 6, tier: 3 as const },
  { id: 'plastic', name: 'Plastic', building: 'refinery' as BuildingCategory, inputs: [{ item: 'crude-oil', amount: 3 }], outputs: [{ item: 'plastic', amount: 2 }, { item: 'heavy-oil-residue', amount: 1 }], durationSeconds: 6, tier: 3 as const },
  { id: 'rubber', name: 'Rubber', building: 'refinery' as BuildingCategory, inputs: [{ item: 'crude-oil', amount: 3 }, { item: 'water', amount: 2 }], outputs: [{ item: 'rubber', amount: 2 }, { item: 'heavy-oil-residue', amount: 2 }], durationSeconds: 6, tier: 3 as const },
  { id: 'high-speed-connector', name: 'High-Speed Connector', building: 'manufacturer' as BuildingCategory, inputs: [{ item: 'circuit-board', amount: 1 }, { item: 'cable', amount: 4 }, { item: 'plastic', amount: 2 }], outputs: [{ item: 'high-speed-connector', amount: 1 }], durationSeconds: 16, tier: 4 as const },
  { id: 'supercomputer', name: 'Supercomputer', building: 'manufacturer' as BuildingCategory, inputs: [{ item: 'circuit-board', amount: 2 }, { item: 'copper-ingot', amount: 3 }, { item: 'plastic', amount: 2 }, { item: 'high-speed-connector', amount: 2 }], outputs: [{ item: 'supercomputer', amount: 1 }], durationSeconds: 32, tier: 6 as const },
];

export const RECIPE_MAP: Record<string, typeof RECIPES[number]> = {};
for (const r of RECIPES) {
  RECIPE_MAP[r.id] = r;
}

export function getRecipesForBuilding(buildingType: BuildingCategory): typeof RECIPES[number][] {
  return RECIPES.filter(r => r.building === buildingType);
}

export function calculatePerMinute(recipe: typeof RECIPES[number], overclock: number = 1) {
  const cyclesPerMinute = (60 / recipe.durationSeconds) * overclock;
  return {
    inputs: recipe.inputs.map(io => ({ ...io, perMinute: io.amount * cyclesPerMinute })),
    outputs: recipe.outputs.map(io => ({ ...io, perMinute: io.amount * cyclesPerMinute })),
    cyclesPerMinute,
  };
}