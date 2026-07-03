"use client";

import React, { useState, useMemo } from "react";
import type { AWSResourceType } from "@canvascloud/shared";

export interface PaletteItem {
  type: AWSResourceType;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export interface PaletteCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  colorClass: string;
  items: PaletteItem[];
}

interface UseResourcePaletteProps {
  categories: PaletteCategory[];
}

export function useResourcePalette({ categories }: UseResourcePaletteProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    compute: true,
    networking: true,
    securityGroups: true,
    loadBalancing: true,
    databases: true,
    storage: true,
    accessControl: false,
    serverless: false,
    dnsCdn: false,
  });

  // Toggle category expand/collapse state
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Drag start callback setting visual metadata transfer payload
  const handleDragStart = (event: React.DragEvent, type: AWSResourceType) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
  };

  // Filter items in categories based on search query
  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return categories;

    return categories
      .map((cat) => {
        const matchingItems = cat.items.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.type.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        );
        return { ...cat, items: matchingItems };
      })
      .filter((cat) => cat.items.length > 0);
  }, [categories, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    expandedCategories,
    toggleCategory,
    handleDragStart,
    filteredCategories,
  };
}
