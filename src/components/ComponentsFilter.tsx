import { FindComponentsGroupedByTagThenTypeResult } from "@/db/handlers/findComponentsGroupedByTagThenTypeHandler";
import { useEffect, useState } from "react";

type Filter = {};

export default function ComponentsFilter({
  initialData,
  setFiltered,
}: {
  initialData: FindComponentsGroupedByTagThenTypeResult;
  setFiltered: React.Dispatch<
    React.SetStateAction<FindComponentsGroupedByTagThenTypeResult>
  >;
}) {
  const [filter, setFilter] = useState({});

  useEffect(() => {
    setFiltered(applyFilter(initialData, filter));
  }, [initialData, filter]);

  return <div>Filter</div>;
}

function applyFilter(
  data: FindComponentsGroupedByTagThenTypeResult,
  filter: Filter,
): FindComponentsGroupedByTagThenTypeResult {
  return data;
}
