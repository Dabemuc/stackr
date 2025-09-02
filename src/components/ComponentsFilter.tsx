import { useEffect } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/index";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, ChevronDown } from "lucide-react";
import { FindComponentsGroupedByTagThenTypeResult } from "@/db/handlers/findComponentsGroupedByTagThenTypeHandler";

export type Filter = {
  search?: string;
  status?: string[];
  type?: string[];
  tag?: number[];
};

export default function ComponentsFilter({
  initialData,
  setFiltered,
}: {
  initialData: FindComponentsGroupedByTagThenTypeResult;
  setFiltered: React.Dispatch<
    React.SetStateAction<FindComponentsGroupedByTagThenTypeResult>
  >;
}) {
  // URL search params are source of truth
  const filter = useSearch({ from: Route.id });
  const navigate = useNavigate();

  // Apply filtering logic when search/filter changes
  useEffect(() => {
    setFiltered(applyFilter(initialData, filter));
  }, [initialData, filter]);

  const allStatuses = Array.from(
    new Set(
      initialData.flatMap((t) =>
        t.types.flatMap((ty) => ty.components.map((c) => c.status)),
      ),
    ),
  );

  const allTypes = Array.from(
    new Set(initialData.flatMap((t) => t.types.map((ty) => ty.type))),
  );

  const allTags = initialData.map((t) => ({ id: t.tagId!, name: t.tagPath }));

  // Helper to update URL search
  const updateFilter = (newValues: Partial<Filter>) => {
    const cleanSearch = (values: Filter): Filter => {
      const cleaned: Filter = {};

      if (values.search && values.search.trim() !== "") {
        cleaned.search = values.search;
      }
      if (values.status && values.status.length > 0) {
        cleaned.status = values.status;
      }
      if (values.type && values.type.length > 0) {
        cleaned.type = values.type;
      }
      if (values.tag && values.tag.length > 0) {
        cleaned.tag = values.tag;
      }

      return cleaned;
    };

    navigate({
      from: Route.id,
      search: (prev) => cleanSearch({ ...prev, ...newValues }),
      replace: true,
    });
  };

  return (
    <div className="flex flex-wrap gap-4 items-center p-4 border rounded-b-2xl shadow-sm">
      {/* Search */}
      <Input
        placeholder="Search components..."
        value={filter.search ?? ""}
        onChange={(e) => updateFilter({ search: e.target.value })}
        className="w-60 bg-bg dark:bg-bg-light dark:hover:bg-bg-light-hover"
      />
      {/* Status filter */}
      <MultiSelectPopover
        items={allStatuses.map((s) => ({ value: s, label: s }))}
        selected={filter.status ?? []}
        placeholder="Filter by status"
        onChange={(vals) => updateFilter({ status: vals })}
      />
      {/* Type filter */}
      <MultiSelectPopover
        items={allTypes.map((t) => ({ value: t, label: t }))}
        selected={filter.type ?? []}
        placeholder="Filter by type"
        onChange={(vals) => updateFilter({ type: vals })}
      />
      {/* Tag filter */}
      <MultiSelectPopover
        items={allTags.map((t) => {
          const parts = t.name.split("/");
          const depth = parts.length - 1;
          return {
            value: t.id.toString(),
            label: parts[parts.length - 1],
            depth,
          };
        })}
        selected={(filter.tag ?? []).map(String)}
        placeholder="Filter by tag"
        onChange={(vals) => updateFilter({ tag: vals.map(Number) })}
      />
      {/* Clear button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          updateFilter({ search: "", status: [], type: [], tag: [] })
        }
        className="flex items-center gap-1 bg-bg dark:bg-bg-light dark:hover:bg-bg-light-hover"
      >
        <X className="w-4 h-4" /> Clear
      </Button>
    </div>
  );
}

// Reusable MultiSelectPopover
function MultiSelectPopover({
  items,
  selected,
  placeholder,
  onChange,
}: {
  items: { value: string; label: string; depth?: number }[];
  selected: string[];
  placeholder: string;
  onChange: (vals: string[]) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 w-40 justify-between bg-bg dark:bg-bg-light dark:hover:bg-bg-light-hover"
        >
          <span>
            {selected.length ? `${selected.length} selected` : placeholder}
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-60 overflow-y-auto w-max min-w-[160px] dark:bg-bg-dark">
        <div className="flex flex-col gap-1">
          {items.map((item) => (
            <label
              key={item.value}
              className="flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ paddingLeft: `${(item.depth ?? 0) * 12}px` }}
            >
              <Checkbox
                checked={selected.includes(item.value)}
                onCheckedChange={() => {
                  if (selected.includes(item.value)) {
                    onChange(selected.filter((v) => v !== item.value));
                  } else {
                    onChange([...selected, item.value]);
                  }
                }}
                className="bg-bg dark:bg-bg-light"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function applyFilter(
  data: FindComponentsGroupedByTagThenTypeResult,
  filter: Filter,
): FindComponentsGroupedByTagThenTypeResult {
  const search = filter.search ?? "";
  const status = filter.status ?? [];
  const types = filter.type ?? [];
  const tags = filter.tag ?? [];

  return data
    .filter((tg) => {
      if (!tags.length) return true;
      return tags.some((selectedTagId) => {
        const selectedTag = data.find((t) => t.tagId === selectedTagId);
        if (!selectedTag) return false;
        return tg.tagPath.startsWith(selectedTag.tagPath);
      });
    })
    .map((tagGroup) => ({
      ...tagGroup,
      types: tagGroup.types
        .map((typeGroup) => ({
          ...typeGroup,
          components: typeGroup.components.filter((c) => {
            const matchesSearch = search
              ? c.name.toLowerCase().includes(search.toLowerCase()) ||
                (c.description?.toLowerCase().includes(search.toLowerCase()) ??
                  false)
              : true;

            const matchesStatus = status.length
              ? status.includes(c.status)
              : true;

            const matchesType = types.length
              ? types.includes(typeGroup.type)
              : true;

            return matchesSearch && matchesStatus && matchesType;
          }),
        }))
        .filter((ty) => ty.components.length > 0),
    }))
    .filter((tg) => tg.types.length > 0);
}
