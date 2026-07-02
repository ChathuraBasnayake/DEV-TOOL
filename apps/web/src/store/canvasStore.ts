import { create } from "zustand";
import {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import toast from "react-hot-toast";
import {
  CanvasNode,
  CanvasEdge,
  CanvasViewport,
  AWSResourceType,
  isValidAWSConnection,
  getEdgeLabel,
} from "@canvascloud/shared";

// Required fields mapping for node configuration validation
const REQUIRED_FIELDS: Record<string, string[]> = {
  ec2: ["ami", "instance_type"],
  asg: ["name", "min_size", "max_size"],
  "launch-template": ["name"],
  vpc: ["cidr_block"],
  subnet: ["cidr_block"],
  "security-group": ["name"],
  igw: [],
  "nat-gw": [],
  "route-table": [],
  eip: [],
  alb: ["name"],
  "target-group": ["name", "port", "protocol"],
  rds: ["allocated_storage", "engine", "instance_class"],
  elasticache: ["cluster_id", "engine", "node_type"],
  dynamodb: ["name", "billing_mode", "hash_key"],
  s3: ["bucket"],
  "iam-role": ["name", "assume_role_policy"],
  "iam-policy": ["name", "policy_document"],
  lambda: ["function_name", "runtime", "handler"],
  "api-gateway": ["name", "protocol_type"],
  route53: ["name"],
  cloudfront: [],
};

// Helper function to check if a node's config has all required fields populated
function checkNodeStatus(
  resourceType: AWSResourceType,
  config: Record<string, unknown>
): "unconfigured" | "configured" {
  const fields = REQUIRED_FIELDS[resourceType] || [];
  const isValid = fields.every((f) => {
    const val = config?.[f];
    return val !== undefined && val !== null && val !== "";
  });
  return isValid ? "configured" : "unconfigured";
}

interface CanvasStore {
  projectId: string | null;
  projectName: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  viewport: CanvasViewport;
  selectedNodeId: string | null;
  isSaving: boolean;

  // Setters
  setProject: (id: string | null, name: string, state: { nodes: CanvasNode[]; edges: CanvasEdge[]; viewport?: CanvasViewport }) => void;
  setProjectName: (name: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSaving: (isSaving: boolean) => void;
  setNodes: (nodes: CanvasNode[]) => void;
  setEdges: (edges: CanvasEdge[]) => void;
  setViewport: (viewport: CanvasViewport) => void;

  // React Flow Handlers
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Builder Actions
  addNode: (resourceType: AWSResourceType, position: { x: number; y: number }) => void;
  updateNodeConfig: (nodeId: string, updatedConfig: Record<string, unknown>) => void;
  updateNodeLabel: (nodeId: string, label: string) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  projectId: null,
  projectName: "Untitled Project",
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  selectedNodeId: null,
  isSaving: false,

  setProject: (id, name, state) => {
    set({
      projectId: id,
      projectName: name,
      nodes: state.nodes,
      edges: state.edges,
      viewport: state.viewport || { x: 0, y: 0, zoom: 1 },
      selectedNodeId: null,
    });
  },

  setProjectName: (name) => {
    set({ projectName: name });
  },

  setSelectedNodeId: (id) => {
    set({ selectedNodeId: id });
  },

  setSaving: (isSaving) => {
    set({ isSaving });
  },

  setNodes: (nodes) => {
    set({ nodes });
  },

  setEdges: (edges) => {
    set({ edges });
  },

  setViewport: (viewport) => {
    set({ viewport });
  },

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(
        changes,
        get().nodes as unknown as Node[]
      ) as unknown as CanvasNode[],
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(
        changes,
        get().edges as unknown as Edge[]
      ) as unknown as CanvasEdge[],
    });
  },

  onConnect: (connection) => {
    const sourceNode = get().nodes.find((n) => n.id === connection.source);
    const targetNode = get().nodes.find((n) => n.id === connection.target);

    if (!sourceNode || !targetNode) return;

    const sourceResourceType = sourceNode.data.resourceType;
    const targetResourceType = targetNode.data.resourceType;

    // Validate connection using shared schema rules
    if (!isValidAWSConnection(sourceResourceType, targetResourceType)) {
      toast.error(
        `Invalid Connection: ${sourceResourceType.toUpperCase()} cannot link to ${targetResourceType.toUpperCase()}`
      );
      return;
    }

    const edgeDetails = getEdgeLabel(sourceResourceType, targetResourceType);
    const relationship = edgeDetails ? edgeDetails.label : "dependency";

    const newEdge: CanvasEdge = {
      id: `edge-${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle ?? undefined,
      targetHandle: connection.targetHandle ?? undefined,
      type: "dependency", // Animated matching-ant style path
      data: { relationship },
    };

    set({
      edges: [...get().edges, newEdge],
    });

    toast.success(`Linked via: ${relationship}`);
  },

  addNode: (resourceType, position) => {
    const id = `node-${Math.random().toString(36).substring(2, 11)}`;
    const label = `${resourceType.toUpperCase()}-${id.substring(5, 9)}`;

    const newNode: CanvasNode = {
      id,
      type: "awsNode",
      position,
      data: {
        label,
        resourceType,
        config: {},
        status: "unconfigured",
      },
    };

    set({
      nodes: [...get().nodes, newNode],
      selectedNodeId: id, // Automatically focus property edits on dropped node
    });

    toast.success(`Added ${resourceType.toUpperCase()}`);
  },

  updateNodeConfig: (nodeId, updatedConfig) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id !== nodeId) return node;

        const newConfig = { ...node.data.config, ...updatedConfig };
        const newStatus = checkNodeStatus(node.data.resourceType, newConfig);

        return {
          ...node,
          data: {
            ...node.data,
            config: newConfig,
            status: newStatus,
          },
        };
      }),
    });
  },

  updateNodeLabel: (nodeId, label) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id !== nodeId) return node;
        return {
          ...node,
          data: {
            ...node.data,
            label,
          },
        };
      }),
    });
  },

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      // Automatically clean up dangling connections attached to deleted resource
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    });
    toast.success("Resource removed");
  },

  deleteEdge: (edgeId) => {
    set({
      edges: get().edges.filter((edge) => edge.id !== edgeId),
    });
    toast.success("Connection removed");
  },
}));

// Reusable Selector Hooks for efficient sub-rendering
export const useProjectId = () => useCanvasStore((state) => state.projectId);
export const useProjectName = () => useCanvasStore((state) => state.projectName);
export const useCanvasNodes = () => useCanvasStore((state) => state.nodes);
export const useCanvasEdges = () => useCanvasStore((state) => state.edges);
export const useCanvasViewport = () => useCanvasStore((state) => state.viewport);
export const useSelectedNodeId = () => useCanvasStore((state) => state.selectedNodeId);
export const useIsSaving = () => useCanvasStore((state) => state.isSaving);

export const useSelectedNode = () =>
  useCanvasStore((state) => {
    const selectedId = state.selectedNodeId;
    return selectedId
      ? state.nodes.find((node) => node.id === selectedId) || null
      : null;
  });
