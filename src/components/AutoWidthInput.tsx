import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

export default function AutoWidthInput({
  handleEnter,
  placeholder,
}: {
  handleEnter: (input: string) => void;
  placeholder: string;
}) {
  const [inputText, setInputText] = useState("");
  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      // Add a little extra padding so the caret doesn’t get cut off
      inputRef.current.style.width = `${spanRef.current.offsetWidth + 16}px`;
    }
  }, [inputText]);

  return (
    <div className="relative inline-flex items-center">
      {/* The hidden span to measure text width */}
      <span
        ref={spanRef}
        className="absolute invisible whitespace-pre px-2 text-sm font-normal"
      >
        {inputText || placeholder}
      </span>

      <Input
        ref={inputRef}
        className="min-w-18 max-w-40"
        placeholder={placeholder}
        formNoValidate
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (inputText !== "") {
              handleEnter(inputText);
              setInputText("");
            }
          }
        }}
      />
    </div>
  );
}
