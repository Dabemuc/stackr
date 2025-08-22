import { findComponentsGroupedByTag } from "@/db/db";
import { useEffect, useState } from "react";
import TagCard from "./TagCard";
import { FindComponentsGroupedByTagThenTypeResult } from "@/db/handlers/findComponentsGroupedByTagThenTypeHandler";

export default function ComponentsVisualizer() {
  const [tags, setTags] = useState<FindComponentsGroupedByTagThenTypeResult>(
    [],
  );

  useEffect(() => {
    async function fetch() {
      const fetchedData = await findComponentsGroupedByTag();
      fetchedData.sort((a, b) => a.tagName.localeCompare(b.tagName));
      setTags(fetchedData);
    }
    fetch();
  }, []);

  return (
    <div className="p-6 columns-1 sm:columns-2 lg:columns-3 gap-6">
      {tags.map((t, index) => (
        <div key={"tag" + index} className="mb-6 break-inside-avoid">
          <TagCard tag={t} />
        </div>
      ))}
    </div>
  );
}
