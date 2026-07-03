"use client";

import React from "react";
import type { PropertySchema } from "../../types/schema";
import TextField from "./TextField";
import NumberField from "./NumberField";
import BooleanField from "./BooleanField";
import SelectField from "./SelectField";
import TextAreaField from "./TextAreaField";
import CodeField from "./CodeField";
import ArrayField from "./ArrayField";
import ReferenceField from "./ReferenceField";
import KeyValueField from "./KeyValueField";
import IpField from "./IpField";

interface PropertyFieldProps {
  propertyKey: string;
  schema: PropertySchema;
  value: unknown;
  onChange: (val: unknown) => void;
  error?: string;
}

export default function PropertyField({
  propertyKey,
  schema,
  value,
  onChange,
  error,
}: PropertyFieldProps) {
  const { type, label, description, required, placeholder, options, referenceType } = schema;

  // Dispatch rendering to specialized sub-components
  const renderFieldInput = () => {
    switch (type) {
      case "text":
        return (
          <TextField
            value={(value as string) || ""}
            onChange={onChange}
            placeholder={placeholder}
          />
        );
      case "number":
        return (
          <NumberField
            value={value !== undefined && value !== null ? Number(value) : undefined}
            onChange={onChange}
            placeholder={placeholder}
          />
        );
      case "boolean":
        return (
          <BooleanField
            value={!!value}
            onChange={onChange}
          />
        );
      case "select":
        return (
          <SelectField
            value={(value as string) || ""}
            onChange={onChange}
            options={options || []}
            placeholder={placeholder}
          />
        );
      case "textarea":
        return (
          <TextAreaField
            value={(value as string) || ""}
            onChange={onChange}
            placeholder={placeholder}
          />
        );
      case "code":
        return (
          <CodeField
            value={(value as string) || ""}
            onChange={onChange}
            placeholder={placeholder}
          />
        );
      case "array":
        return (
          <ArrayField
            value={(value as string[]) || []}
            onChange={onChange}
            placeholder={placeholder}
          />
        );
      case "reference":
        return (
          <ReferenceField
            value={(value as string) || ""}
            onChange={onChange}
            referenceType={referenceType}
            placeholder={placeholder}
          />
        );
      case "key-value":
        return (
          <KeyValueField
            value={(value as Record<string, string>) || {}}
            onChange={onChange}
          />
        );
      case "ip":
        return (
          <IpField
            value={(value as string) || ""}
            onChange={onChange}
            placeholder={placeholder}
          />
        );
      default:
        return (
          <div style={{ fontSize: "0.75rem", color: "var(--color-error)" }}>
            Unsupported field type: {type}
          </div>
        );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        marginBottom: "16px",
        width: "100%",
      }}
      className={`property-field-group field-${propertyKey}`}
    >
      {/* Label and Required Asterisk */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <label
          style={{
            fontSize: "0.76rem",
            fontWeight: 700,
            color: "var(--text-secondary)",
          }}
        >
          {label}
          {required && (
            <span
              style={{
                color: "var(--color-error)",
                marginLeft: "3px",
                fontSize: "0.8rem",
              }}
            >
              *
            </span>
          )}
        </label>
      </div>

      {/* Renders dynamic input element */}
      {renderFieldInput()}

      {/* Description Helper Subtext */}
      {description && !error && (
        <span
          style={{
            fontSize: "0.68rem",
            color: "var(--text-muted)",
            lineHeight: "1.3",
          }}
        >
          {description}
        </span>
      )}

      {/* Field Level Error Message */}
      {error && (
        <span
          style={{
            fontSize: "0.68rem",
            color: "var(--color-error)",
            lineHeight: "1.3",
            fontWeight: 600,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
