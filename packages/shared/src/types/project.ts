import type { CanvasState } from './canvas.js';

export interface ProjectMeta {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  nodeCount: number;
  edgeCount: number;
}

export interface Project extends ProjectMeta {
  canvas: CanvasState;
}
