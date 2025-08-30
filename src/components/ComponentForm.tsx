import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/common/Combobox";

import {
  type ComponentStatus,
  type ComponentRelation,
  componentStatuses,
  relationTypes,
} from "@/db/types";
import { MultiTagSelect } from "./MultiTagSelect";
import { findComponents, findHierarchicalTags, insertComponent } from "@/db/db";
import TypesFormSection from "./TypesFormSection";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

// Helper to show validation state
function FieldInfo({ field }: { field: AnyFieldApi }) {
  const showError =
    (field.state.meta.isTouched || field.form.state.isSubmitted) &&
    !field.state.meta.isValid;

  return (
    <>
      {showError ? (
        <em className="text-red-500 text-sm">
          {field.state.meta.errors.join(", ")}
        </em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

const componentStatusOptions = componentStatuses.map((value) => ({
  value,
  label: value,
}));

const relationTypeOptions = relationTypes.map((value) => ({
  value,
  label: value,
}));

const defFormVals = {
  name: "",
  type: [] as { id: number | null; name: string }[],
  description: "",
  article: "",
  links: [] as string[],
  status: undefined as undefined | ComponentStatus,
  tags: [] as string[],
  relations: [] as { targetId: string; relationType: ComponentRelation }[],
};

export type ComponentFormData = typeof defFormVals;

export default function ComponentForm() {
  const [tags, setTags] = useState<{ value: string; label: string }[]>([]);
  const [components, setComponents] = useState<
    { value: string; label: string }[]
  >([]);

  // Fetch tags and components from API/db
  useEffect(() => {
    async function fetchData() {
      const tagsRes = await findHierarchicalTags();
      setTags(tagsRes.map((t) => ({ value: String(t.path), label: t.path })));

      const compsRes = await findComponents();
      setComponents(
        compsRes.map((c) => ({ value: String(c.id), label: c.name })),
      );
    }
    fetchData();
  }, []);

  const form = useForm({
    defaultValues: defFormVals,
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value);

      if (value.type === undefined) {
        console.error(
          "Trying to insert component with undefined status. This should never happen!",
        );
      }

      insertComponent({ data: value });
    },
  });

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Create Component</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        {/* Name */}
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => (!value ? "Name is required" : undefined),
          }}
        >
          {(field) => (
            <div>
              <label className="block font-medium">Name</label>
              <Input
                className="bg-secondary"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>

        {/* Description */}
        <form.Field name="description">
          {(field) => (
            <div>
              <label className="block font-medium">Description</label>
              <Textarea
                className="bg-secondary"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
            </div>
          )}
        </form.Field>

        {/* Article */}
        <form.Field name="article">
          {(field) => (
            <div>
              <div className="flex items-center gap-3">
                <label className="block font-medium">Article</label>
                <div
                  className="top-1 right-2 text-xs text-muted-foreground"
                  title="MarkDown-enabled!"
                >
                  md
                </div>
              </div>
              <Textarea
                className="bg-secondary"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
            </div>
          )}
        </form.Field>

        {/* Type (multi-select) */}
        <form.Field
          name="type"
          validators={{
            onChange: ({ value }) =>
              value.length === 0 ? "At least one type is required" : undefined,
          }}
        >
          {(field) => (
            <div>
              <label className="block font-medium mb-1">Type(s)</label>
              <TypesFormSection
                selected={field.state.value}
                onChange={field.handleChange}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>

        {/* Status (single select combobox) */}
        <form.Field
          name="status"
          validators={{
            onChange: ({ value }) =>
              !value ? "Status is required" : undefined,
          }}
        >
          {(field) => (
            <div>
              <label className="block font-medium mb-1">Status</label>
              <Combobox
                selectableName="status"
                selectables={componentStatusOptions}
                callback={(val) => field.handleChange(val as ComponentStatus)}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>

        {/* Links (array of strings) */}
        <form.Field name="links">
          {(field) => (
            <div>
              <label className="block font-medium mb-1">Links</label>
              {field.state.value.map((link, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Input
                    className="bg-secondary"
                    value={link}
                    onChange={(e) => {
                      const newLinks = [...field.state.value];
                      newLinks[idx] = e.target.value;
                      field.handleChange(newLinks);
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const newLinks = field.state.value.filter(
                        (_, i) => i !== idx,
                      );
                      field.handleChange(newLinks);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() => field.handleChange([...field.state.value, ""])}
              >
                + Add Link
              </Button>
            </div>
          )}
        </form.Field>

        {/* Tags (multi-select with AutocompleteSearchbox) */}
        <form.Field name="tags">
          {(field) => (
            <div>
              <label className="block font-medium mb-1">Tags</label>
              <MultiTagSelect
                items={tags}
                selected={field.state.value}
                onChange={field.handleChange}
              />
            </div>
          )}
        </form.Field>

        {/* Relations */}
        <form.Field name="relations">
          {(field) => (
            <div>
              <label className="block font-medium mb-1">Relations</label>
              {field.state.value.map((_rel, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <Combobox
                    selectableName="type"
                    selectables={relationTypeOptions}
                    callback={(val) => {
                      const newRels = [...field.state.value];
                      newRels[idx] = {
                        ...newRels[idx],
                        relationType: val as ComponentRelation,
                      };
                      field.handleChange(newRels);
                    }}
                  />
                  <Combobox
                    selectableName="component"
                    selectables={components}
                    callback={(val) => {
                      const newRels = [...field.state.value];
                      newRels[idx] = { ...newRels[idx], targetId: val };
                      field.handleChange(newRels);
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const newRels = field.state.value.filter(
                        (_, i) => i !== idx,
                      );
                      field.handleChange(newRels);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="secondary"
                type="button"
                onClick={() =>
                  field.handleChange([
                    ...field.state.value,
                    { targetId: "", relationType: "Depends on" },
                  ])
                }
              >
                + Add Relation
              </Button>
            </div>
          )}
        </form.Field>

        {/* Submit button */}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit}
              className="bg-gradient-to-tl from-accent-gradiant-from via-accent-gradiant-from to-accent-gradiant-to"
            >
              {isSubmitting ? "..." : "Submit"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
