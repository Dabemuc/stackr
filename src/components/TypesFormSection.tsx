import { findTypes } from "@/db/db";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import AutoWidthInput from "./common/AutoWidthInput";

export default function TypesFormSection({
  selected,
  onChange,
}: {
  selected: { id: number | null; name: string }[];
  onChange: (newSelected: { id: number | null; name: string }[]) => void;
}) {
  const [types, setTypes] = useState<{ id: number | null; name: string }[]>([]);

  // Fetch Data on initial load
  useEffect(() => {
    async function fetchTypes() {
      const typesRes = await findTypes();
      setTypes(typesRes);
    }

    fetchTypes();
  }, []);

  function handleAdd(input: string) {
    console.log("Adding", input);
    const newType = { id: null, name: input };
    setTypes([...types, newType]);
    handleSelect(newType);
  }

  function handleSelect(t: { id: number | null; name: string }) {
    const newSelected = selected.find((s) => s.id === t.id && s.name === t.name)
      ? selected.filter((v) => v.id !== t.id && v.name !== t.name)
      : [...selected, t];
    onChange(newSelected);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {types.map((t, index) => (
        <Button
          key={"type-" + index}
          type="button"
          variant={
            selected.find((s) => s.id === t.id && s.name === t.name)
              ? "default"
              : "secondary"
          }
          onClick={() => handleSelect(t)}
        >
          {t.name}
        </Button>
      ))}
      <AutoWidthInput handleEnter={handleAdd} placeholder="+ Add" />
    </div>
  );
}
