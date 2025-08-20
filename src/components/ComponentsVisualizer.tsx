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
      setTags(fetchedData);
    }

    fetch();
  }, []);

  return (
    <div className="p-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {tags.map((t, index) => (
        <TagCard tag={t} key={"tag" + index} />
      ))}
    </div>
  );
}
