import { findComponentsGroupedByTag } from "@/db/db";
import { useEffect, useState } from "react";
import TagCard from "./TagCard";
import { FindComponentsGroupedByTagThenTypeResult } from "@/db/handlers/findComponentsGroupedByTagThenTypeHandler";
import ComponentsFilter from "./ComponentsFilter";
import ComponentsVisualizerSkeleton from "./skeletons/ComponentsVisualizerSkeleton";

export default function ComponentsVisualizer() {
  const [initialData, setInitialData] =
    useState<FindComponentsGroupedByTagThenTypeResult>([]);
  const [filteredData, setFilteredData] =
    useState<FindComponentsGroupedByTagThenTypeResult>([]);
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetch() {
      const fetchedData = await findComponentsGroupedByTag();
      fetchedData.sort((a, b) => a.tagPath.localeCompare(b.tagPath));
      setInitialData(fetchedData);
      setLoaded(true);
    }
    fetch();
  }, []);

  return (
    <>
      <ComponentsFilter
        initialData={initialData}
        setFiltered={setFilteredData}
      />
      {isLoaded ? (
        <div className="p-6 columns-1 sm:columns-2 lg:columns-3 gap-6 mx-auto max-w-[100rem]">
          {filteredData.map((t, index) => (
            <div key={"tag" + index} className="mb-6 break-inside-avoid">
              <TagCard tag={t} />
            </div>
          ))}
        </div>
      ) : (
        <ComponentsVisualizerSkeleton />
      )}
    </>
  );
}
