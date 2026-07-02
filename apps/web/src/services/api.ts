import type {
  Project,
  ProjectMeta,
  CompileRequest,
  CompileResponse,
  ScanRequest,
  ScanResponse,
  ValidateConnectionRequest,
  ValidateConnectionResponse,
  ValidateConfigRequest,
  ValidateConfigResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "@canvascloud/shared";

// Base API URI configured via environment variables with default local fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

/**
 * Generic request wrapper handling body formatting, header insertion, 
 * response status validations, and error payload parsing.
 */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const headers = new Headers(options.headers);

  if (!(options.body instanceof Blob || options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
    try {
      const errorJson = await response.json() as { message?: string };
      errorMessage = errorJson.message || errorMessage;
    } catch {
      // Fallback to generic status string if response is not JSON
    }
    throw new Error(errorMessage);
  }

  // Handle file downloads (specifically compiler zip archives)
  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.includes("application/zip")) {
    const blob = await response.blob();
    return blob as unknown as T;
  }

  // Parse standardized NestJS API response wraps
  const payload = await response.json() as { success: boolean; data: T };
  return payload.data;
}

/**
 * Project Management API calls
 */
export const projectsApi = {
  findAll: () => request<ProjectMeta[]>("/projects"),
  
  findOne: (id: string) => request<Project>(`/projects/${id}`),
  
  create: (dto: CreateProjectRequest) =>
    request<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
  
  update: (id: string, dto: UpdateProjectRequest) =>
    request<Project>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    }),
  
  delete: (id: string) =>
    request<void>(`/projects/${id}`, {
      method: "DELETE",
    }),
};

/**
 * HCL Terraform Compiler API calls
 */
export const compilerApi = {
  compile: (dto: CompileRequest) =>
    request<CompileResponse>("/compile", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
  
  downloadZip: (dto: CompileRequest) =>
    request<Blob>("/compile/download", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
};

/**
 * Security Guardrail API calls
 */
export const guardrailsApi = {
  scan: (dto: ScanRequest) =>
    request<ScanResponse>("/scan", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
};

/**
 * AWS Model Constants Metadata API calls
 */
export const metadataApi = {
  getAWSMetadata: () => request<unknown>("/metadata/aws"),
};

/**
 * Topology and Configuration Validation API calls
 */
export const validationApi = {
  validateConnection: (dto: ValidateConnectionRequest) =>
    request<ValidateConnectionResponse>("/validation/connection", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  validateConfig: (dto: ValidateConfigRequest) =>
    request<ValidateConfigResponse>("/validation/config", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
};
