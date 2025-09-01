import { FindComponentsGroupedByTagThenTypeResult } from "@/db/handlers/findComponentsGroupedByTagThenTypeHandler";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X, ChevronDown } from "lucide-react";

// Define the Filter type
export type Filter = {
  search: string;
  status: string[];
  type: string[];
  tag: number[];
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
  const [filter, setFilter] = useState<Filter>({
    search: "",
    status: [],
    type: [],
    tag: [],
  });

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

  const allTags = initialData.map((t) => ({ id: t.tagId, name: t.tagName }));

  return (
    <div className="flex flex-wrap gap-4 items-center p-4 border rounded-b-2xl shadow-sm">
      {/* Search */}
      <Input
        placeholder="Search components..."
        value={filter.search}
        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        className="w-60 bg-bg dark:bg-bg-light dark:hover:bg-bg-light-hover"
      />

      {/* Status filter */}
      <MultiSelectPopover
        items={allStatuses.map((s) => ({ value: s, label: s }))}
        selected={filter.status}
        placeholder="Filter by status"
        onChange={(vals) => setFilter({ ...filter, status: vals })}
      />

      {/* Type filter */}
      <MultiSelectPopover
        items={allTypes.map((t) => ({ value: t, label: t }))}
        selected={filter.type}
        placeholder="Filter by type"
        onChange={(vals) => setFilter({ ...filter, type: vals })}
      />

      {/* Tag filter */}
      <MultiSelectPopover
        items={allTags.map((t) => ({ value: t.id.toString(), label: t.name }))}
        selected={filter.tag.map(String)}
        placeholder="Filter by tag"
        onChange={(vals) => setFilter({ ...filter, tag: vals.map(Number) })}
      />

      {/* Clear button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setFilter({ search: "", status: [], type: [], tag: [] })}
        className="flex items-center gap-1 bg-bg dark:bg-bg-light dark:hover:bg-bg-light-hover"
      >
        <X className="w-4 h-4" /> Clear
      </Button>
    </div>
  );
}

// Reusable Popover + Checkbox MultiSelect component
function MultiSelectPopover({
  items,
  selected,
  placeholder,
  onChange,
}: {
  items: { value: string; label: string }[];
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
      <PopoverContent className="w-40">
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {items.map((item) => (
            <label key={item.value} className="flex items-center gap-2">
              <Checkbox
                checked={selected.includes(item.value)}
                onCheckedChange={() => {
                  if (selected.includes(item.value)) {
                    onChange(selected.filter((v) => v !== item.value));
                  } else {
                    onChange([...selected, item.value]);
                  }
                }}
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
  return data
    .filter((tg) => (filter.tag.length ? filter.tag.includes(tg.tagId) : true))
    .map((tagGroup) => ({
      ...tagGroup,
      types: tagGroup.types
        .map((typeGroup) => ({
          ...typeGroup,
          components: typeGroup.components.filter((c) => {
            const matchesSearch = filter.search
              ? c.name.toLowerCase().includes(filter.search.toLowerCase()) ||
                (c.description
                  ?.toLowerCase()
                  .includes(filter.search.toLowerCase()) ??
                  false)
              : true;

            const matchesStatus = filter.status.length
              ? filter.status.includes(c.status)
              : true;

            const matchesType = filter.type.length
              ? filter.type.includes(typeGroup.type)
              : true;

            return matchesSearch && matchesStatus && matchesType;
          }),
        }))
        .filter((ty) => ty.components.length > 0),
    }))
    .filter((tg) => tg.types.length > 0);
}
