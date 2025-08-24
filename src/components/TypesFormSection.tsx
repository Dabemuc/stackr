import { findTypes } from "@/db/db";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function TypesFormSection({
  selected,
  onChange,
}: {
  selected: number[];
  onChange: (newSelected: number[]) => void;
}) {
  const [types, setTypes] = useState<{ id: number; name: string }[]>([]);

  // Helper to load types and set state
  async function fetchTypes() {
    const typesRes = await findTypes();
    setTypes(typesRes);
  }

  // Fetch Data on initial load
  useEffect(() => {
    fetchTypes();
  });

  return (
    <div className="flex flex-wrap gap-2">
      {types.map((t) => (
        <Button
          key={t.id}
          type="button"
          variant={selected.includes(t.id) ? "default" : "outline"}
          onClick={() => {
            const newSelected = selected.includes(t.id)
              ? selected.filter((v) => v !== t.id)
              : [...selected, t.id];
            onChange(newSelected);
          }}
        >
          {t.name}
        </Button>
      ))}
      <Button variant={"outline"}>+</Button>
    </div>
  );
}
