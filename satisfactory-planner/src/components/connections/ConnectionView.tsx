import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  type Connection as RFConnection,
  type Node,
  type Edge,
  Handle,
  Position,
  type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useFactoryStore } from '../../store/factoryStore';
import { BUILDING_MAP, RECIPE_MAP, calculatePerMinute } from '../../data/gameData';

function BuildingNode({ data }: NodeProps<Node<{ buildingId: string; buildingType: string; recipe: string | null; overclock: number }>>) {
  const def = BUILDING_MAP[data.buildingType as string];
  if (!def) return <div className="node-unknown">Unknown</div>;

  const recipe = data.recipe ? RECIPE_MAP[data.recipe as string] : null;
  const perMin = recipe ? calculatePerMinute(recipe, data.overclock as number) : null;

  return (
    <div className="building-node" style={{ borderColor: def.color, backgroundColor: `${def.color}22` }}>
      <Handle type="target" position={Position.Left} id="input" style={{ background: '#FF6347', width: 10, height: 10 }} />
      <div className="node-header">
        <span className="node-icon">{def.icon}</span>
        <span className="node-name">{def.name}</span>
      </div>
      {recipe && perMin && (
        <div className="node-recipe">
          <div className="node-recipe-name">{recipe.name}</div>
          <div className="node-io">
            <div className="node-inputs">
              {perMin.inputs.map((io: { item: string; perMinute: number }, i: number) => (
                <div key={i} className="node-io-item input">
                  <span>{io.item.replace(/-/g, ' ')}</span>
                  <span className="io-rate">{io.perMinute.toFixed(1)}/min</span>
                </div>
              ))}
            </div>
            <div className="node-arrow">→</div>
            <div className="node-outputs">
              {perMin.outputs.map((io: { item: string; perMinute: number }, i: number) => (
                <div key={i} className="node-io-item output">
                  <span>{io.item.replace(/-/g, ' ')}</span>
                  <span className="io-rate">{io.perMinute.toFixed(1)}/min</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {def.powerConsumption > 0 && (
        <div className="node-power">
          ⚡ {Math.round(def.powerConsumption * (data.overclock as number))}MW
        </div>
      )}
      {def.powerProduction && (
        <div className="node-power gen">
          ⚡ +{Math.round(def.powerProduction * (data.overclock as number))}MW
        </div>
      )}
      <Handle type="source" position={Position.Right} id="output" style={{ background: '#4CAF50', width: 10, height: 10 }} />
    </div>
  );
}

const nodeTypes = { building: BuildingNode };

const EDGE_TYPES = {
  item: { stroke: '#FF6347', animated: false },
  fluid: { stroke: '#4A90D9', animated: true },
  power: { stroke: '#FFD700', animated: false },
};

export default function ConnectionView() {
  const buildings = useFactoryStore(s => s.buildings);
  const connections = useFactoryStore(s => s.connections);
  const addConnection = useFactoryStore(s => s.addConnection);

  const nodes: Node[] = useMemo(() => buildings.map(building => ({
    id: building.id,
    type: 'building',
    position: { x: building.gridX * 50 + Math.random() * 20, y: building.gridY * 50 + Math.random() * 20 },
    data: {
      buildingId: building.id,
      buildingType: building.buildingType,
      recipe: building.recipe,
      overclock: building.overclock,
      label: BUILDING_MAP[building.buildingType]?.name ?? building.buildingType,
    },
  })), [buildings]);

  const initialEdges: Edge[] = useMemo(() => connections.map(conn => {
    const edgeStyle = EDGE_TYPES[conn.type as keyof typeof EDGE_TYPES] ?? EDGE_TYPES.item;
    return {
      id: conn.id,
      source: conn.sourceId,
      target: conn.targetId,
      sourceHandle: conn.sourcePort || 'output',
      targetHandle: conn.targetPort || 'input',
      style: {
        stroke: edgeStyle.stroke,
        strokeWidth: 2,
      },
      animated: edgeStyle.animated,
      type: 'smoothstep',
    };
  }), [connections]);

  const [rfNodes, , onNodesChange] = useNodesState(nodes);
  const [rfEdges, , onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: RFConnection) => {
    if (params.source && params.target) {
      addConnection(
        params.source,
        params.sourceHandle ?? 'output',
        params.target,
        params.targetHandle ?? 'input',
        'item',
        'mk3',
      );
    }
  }, [addConnection]);

  return (
    <div className="connection-view">
      <div className="connection-view-header">
        <h2>Node-Based Connection View</h2>
        <p className="connection-view-subtitle">Drag from the green output handle on the right of a node to the red input handle on the left of another node to create connections.</p>
      </div>
      <div className="connection-flow-container">
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[20, 20]}
          connectionLineStyle={{ stroke: '#4A90D9', strokeWidth: 2 }}
          defaultEdgeOptions={{ type: 'smoothstep', animated: false }}
        >
          <Controls />
          <Background color="#333" gap={40} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}