import { useEffect, useMemo, useState } from "react";
import { Popover, PopoverAnchor, PopoverContent } from "./ui/popover";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

type Option = { value: string; label: string };
function AutocompleteSearchbox({
  items,
  placeholder = "Search...",
  onSelect,
  onCreate,
}: {
  items: Option[];
  placeholder?: string;
  onSelect: (value: string) => void;
  onCreate?: (label: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const updated = q
      ? items.filter((i) => i.label.toLowerCase().includes(q))
      : items;
    return updated;
  }, [items, query]);

  const handleSelect = (val: string) => {
    onSelect(val);
    setQuery("");
    // setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <Input
          className="w-[200px]"
          placeholder={placeholder}
          formNoValidate
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (filtered.length > 0) {
                // select first matching item
                handleSelect(filtered[0].value);
              } else if (query.trim()) {
                // create new
                onCreate?.(query.trim());
                handleSelect(query.trim());
              }
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
        />
      </PopoverAnchor>
      <PopoverContent
        align="start"
        className="w-[200px] p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <ul className="max-h-48 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <li
                key={item.value}
                className={cn(
                  "cursor-pointer px-3 py-2 hover:bg-accent hover:text-accent-foreground",
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(item.value)}
              >
                {item.label}
              </li>
            ))
          ) : query.trim() ? (
            <li
              className="cursor-pointer px-3 py-2 text-sm text-muted-foreground"
              onClick={() => {
                onCreate?.(query.trim());
                handleSelect(query.trim());
              }}
            >
              Create “{query}”
            </li>
          ) : (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              Start typing ...
            </li>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export function MultiTagSelect({
  items: initialItems,
  selected,
  onChange,
}: {
  items: Option[];
  selected: string[];
  onChange: (newSelected: string[]) => void;
}) {
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const available = useMemo(
    () => items.filter((i) => !selected.includes(i.value)),
    [items, selected],
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selected.map((val) => {
          const tag = items.find((i) => i.value === val);
          return (
            <Badge key={val}>
              {tag?.label ?? val}
              <button
                onClick={() => onChange(selected.filter((s) => s !== val))}
              >
                ✕
              </button>
            </Badge>
          );
        })}
      </div>

      <AutocompleteSearchbox
        items={available}
        placeholder="Search or add tag..."
        onSelect={(val) => {
          if (!selected.includes(val)) {
            onChange([...selected, val]);
          }
        }}
        onCreate={(label) => {
          const newTag = { value: label, label };
          setItems((prev) => [...prev, newTag]);
        }}
      />
    </div>
  );
}
