import { useFactoryStore } from '../store/factoryStore';
import { BUILDING_MAP, RECIPE_MAP, calculatePerMinute, ITEM_MAP } from '../data/gameData';
import type { PowerBalance, ProductionCalculation, ThroughputIssue } from '../types';

export function calculateProduction(buildingId: string): ProductionCalculation | null {
  const building = useFactoryStore.getState().buildings.find(b => b.id === buildingId);
  if (!building || !building.recipe) return null;

  const recipe = RECIPE_MAP[building.recipe];
  if (!recipe) return null;

  const { inputs, outputs } = calculatePerMinute(recipe, building.overclock);
  const buildingDef = BUILDING_MAP[building.buildingType];
  const powerConsumption = buildingDef ? buildingDef.powerConsumption * building.overclock : 0;

  return {
    buildingId,
    recipe,
    inputsPerMinute: inputs,
    outputsPerMinute: outputs,
    powerConsumption,
    utilization: building.overclock,
  };
}

export function calculatePowerBalance(): PowerBalance {
  const buildings = useFactoryStore.getState().buildings;
  let production = 0;
  let consumption = 0;

  for (const building of buildings) {
    const def = BUILDING_MAP[building.buildingType];
    if (!def) continue;

    if (def.powerProduction) {
      production += def.powerProduction * building.overclock;
    } else if (def.powerConsumption > 0) {
      consumption += def.powerConsumption * building.overclock;
    }
  }

  return {
    production,
    consumption,
    surplus: production - consumption,
    percentage: consumption > 0 ? (production / consumption) * 100 : production > 0 ? Infinity : 0,
  };
}

export function calculateThroughputIssues(): ThroughputIssue[] {
  const connections = useFactoryStore.getState().connections;
  const buildings = useFactoryStore.getState().buildings;
  const issues: ThroughputIssue[] = [];

  for (const conn of connections) {
    const sourceBuilding = buildings.find(b => b.id === conn.sourceId);
    if (!sourceBuilding) continue;

    if (!sourceBuilding.recipe) continue;
    const recipe = RECIPE_MAP[sourceBuilding.recipe];
    if (!recipe) continue;

    const { outputs } = calculatePerMinute(recipe, sourceBuilding.overclock);
    const outputItem = outputs[0];
    const requiredFlow = outputItem?.perMinute ?? 0;

    let capacity = Infinity;
    if (conn.type === 'item' && conn.beltType) {
      const beltDefs: Record<string, number> = { mk1: 60, mk2: 120, mk3: 270, mk4: 480, mk5: 780 };
      capacity = beltDefs[conn.beltType] ?? Infinity;
    } else if (conn.type === 'fluid' && conn.pipeType) {
      const pipeDefs: Record<string, number> = { mk1: 300, mk2: 600 };
      capacity = pipeDefs[conn.pipeType] ?? Infinity;
    }

    if (capacity === Infinity) continue;

    let type: ThroughputIssue['type'] = 'ok';
    if (requiredFlow > capacity) type = 'bottleneck';
    else if (requiredFlow > capacity * 0.8) type = 'warning';

    issues.push({
      connectionId: conn.id,
      required: requiredFlow,
      capacity,
      type,
    });
  }

  return issues;
}

export function calculateBottleneckAnalysis(): { buildingId: string; itemName: string; shortage: number }[] {
  const buildings = useFactoryStore.getState().buildings;
  const bottlenecks: { buildingId: string; itemName: string; shortage: number }[] = [];

  const supplyMap = new Map<string, number>();

  for (const building of buildings) {
    if (!building.recipe) continue;
    const recipe = RECIPE_MAP[building.recipe];
    if (!recipe) continue;
    const { outputs } = calculatePerMinute(recipe, building.overclock);
    for (const output of outputs) {
      supplyMap.set(output.item, (supplyMap.get(output.item) ?? 0) + output.perMinute);
    }
  }

  const demandMap = new Map<string, { buildingId: string; item: string; demand: number }[]>();

  for (const building of buildings) {
    if (!building.recipe) continue;
    const recipe = RECIPE_MAP[building.recipe];
    if (!recipe) continue;
    const { inputs } = calculatePerMinute(recipe, building.overclock);
    for (const input of inputs) {
      if (!demandMap.has(input.item)) demandMap.set(input.item, []);
      demandMap.get(input.item)!.push({
        buildingId: building.id,
        item: input.item,
        demand: input.perMinute,
      });
    }
  }

  for (const [itemName, demands] of demandMap) {
    const supply = supplyMap.get(itemName) ?? 0;
    const totalDemand = demands.reduce((sum, d) => sum + d.demand, 0);
    if (totalDemand > supply) {
      for (const demand of demands) {
        bottlenecks.push({
          buildingId: demand.buildingId,
          itemName,
          shortage: totalDemand - supply,
        });
      }
    }
  }

  return bottlenecks;
}

export function getItemDisplayName(itemId: string): string {
  return ITEM_MAP[itemId]?.name ?? itemId;
}

export function getBuildingDisplayName(buildingType: string): string {
  return BUILDING_MAP[buildingType]?.name ?? buildingType;
}