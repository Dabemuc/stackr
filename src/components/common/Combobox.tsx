"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type ComboboxProps = {
  selectableName?: string;
  selectables: {
    value: string;
    label: string;
  }[];
  callback: (selected_val: string) => void;
  initialValue?: string;
};

export function Combobox(props: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (props.initialValue) setValue(props.initialValue);
  }, [props.initialValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[200px] justify-between dark:bg-input/30 bg-secondary",
            value === "" ? "text-muted-foreground" : null,
          )}
        >
          {value
            ? props.selectables.find((prop) => prop.value === value)?.label
            : "Select " + (props.selectableName || "")}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder={"Search " + (props.selectableName || "")}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {props.selectables.map((prop) => (
                <CommandItem
                  key={prop.value}
                  value={prop.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    props.callback(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {prop.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === prop.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
