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
      console.log(fetchedData);
    }

    fetch();
  }, []);
  return (
    <div className="grid grid-cols-3 gap-3 p-3">
      {tags.map((t, index) => (
        <TagCard tag={t} key={"tag" + index} />
      ))}
    </div>
  );
}
