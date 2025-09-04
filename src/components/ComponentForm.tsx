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
import { findComponents, findHierarchicalTags } from "@/db/db";
import TypesFormSection from "./TypesFormSection";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

// Helper to show validation state
function FieldInfo({ field }: { field: AnyFieldApi }) {
  const showError =
    (field.state.meta.isTouched || field.form.state.isSubmitted) &&
    !field.state.meta.isValid;

  return (
    <>
      {showError ? (
        <em className="text-accent-gradiant-to/80 text-sm">
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

export type ComponentFormData = {
  name: string;
  type: { id: number | null; name: string }[];
  description: string;
  article: string;
  links: string[];
  status: ComponentStatus;
  tags: string[];
  relations: { targetId: string; relationType: ComponentRelation }[];
};

export default function ComponentForm({
  defaultVals,
  handleSubmit,
}: {
  defaultVals: ComponentFormData;
  handleSubmit: (
    submittedData: ComponentFormData,
  ) => Promise<{ success: boolean; id?: number; error?: string }>;
}) {
  const [tags, setTags] = useState<{ value: string; label: string }[]>([]);
  const [components, setComponents] = useState<
    { value: string; label: string }[]
  >([]);

  const navigate = useNavigate();

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
    defaultValues: defaultVals,
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value);

      if (value.type === undefined) {
        console.error(
          "Trying to insert component with undefined status. This should never happen!",
        );
      }

      // Show appropriate toast
      const res = await handleSubmit(value);
      if (res.success)
        toast.success("🎉Form submitted successfully🎉", {
          description: "Yey",
          duration: 4000,
          className: "bg-bg bg-accent-gradiant-from/50! scale-120!",
        });
      else
        toast.error("💥Error submitting form💥", {
          description: res.error,
          duration: 10000,
          className: "bg-destructive! scale-120!",
        });

      // Navigate to component on success
      if (res.id) navigate({ to: "/view", search: { id: res.id } });
    },
  });

  return (
    <div>
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
                initialValue={field.state.value}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>

        {/* Links (array of strings) */}
        <form.Field
          name="links"
          validators={{
            onSubmit: ({ value }) => {
              const issue = value.find((link) => link.trim() === "");
              return issue !== undefined ? "No empty links allowed" : undefined;
            },
          }}
        >
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
              <div className="flex flex-col gap-2">
                <FieldInfo field={field} />
                <Button
                  type="button"
                  className="w-fit"
                  variant="secondary"
                  onClick={() => field.handleChange([...field.state.value, ""])}
                >
                  + Add Link
                </Button>
              </div>
            </div>
          )}
        </form.Field>

        {/* Tags (multi-select with AutocompleteSearchbox) */}
        <form.Field
          name="tags"
          validators={{
            onChange: ({ value }) =>
              value.length === 0 ? "At least one tag is required" : undefined,
          }}
        >
          {(field) => (
            <div>
              <label className="block font-medium mb-1">Tags</label>
              <MultiTagSelect
                items={tags}
                selected={field.state.value}
                onChange={field.handleChange}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>

        {/* Relations */}
        <form.Field
          name="relations"
          validators={{
            onSubmit: ({ value }) => {
              const issue = value.find((rel) => rel.targetId === "");
              return issue !== undefined
                ? "No empty relations allowed"
                : undefined;
            },
          }}
        >
          {(field) => (
            <div>
              <label className="block font-medium mb-1">Relations</label>
              {field.state.value.map((rel, idx) => (
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
                    initialValue={rel.relationType}
                  />
                  <Combobox
                    selectableName="component"
                    selectables={components}
                    callback={(val) => {
                      const newRels = [...field.state.value];
                      newRels[idx] = { ...newRels[idx], targetId: val };
                      field.handleChange(newRels);
                    }}
                    initialValue={rel.targetId}
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
              <div className="flex flex-col gap-2">
                <FieldInfo field={field} />
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() =>
                    field.handleChange([
                      ...field.state.value,
                      { targetId: "", relationType: "Depends on" },
                    ])
                  }
                  className="w-fit"
                >
                  + Add Relation
                </Button>
              </div>
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
              className="bg-accent-gradiant-to/90 hover:bg-accent-gradiant-to/80"
            >
              {isSubmitting ? "..." : "Submit"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
