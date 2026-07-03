import type { AWSResourceType } from "@canvascloud/shared";

export type FieldType =
  | "text"
  | "number"
  | "boolean"
  | "select"
  | "textarea"
  | "code"
  | "array"
  | "reference"
  | "key-value"
  | "ip";

export interface SelectOption {
  label: string;
  value: string;
}

export interface PropertySchema {
  type: FieldType;
  label: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: unknown;
  options?: SelectOption[]; // Used for type: "select"
  referenceType?: AWSResourceType; // Used for type: "reference" to load matching canvas nodes
}

export type ResourceSchema = Record<string, PropertySchema>;
