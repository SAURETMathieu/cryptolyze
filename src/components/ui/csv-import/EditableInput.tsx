"use client";

import { memo } from "react";

export const EditableInput = memo(function EditableInput({
  value,
  onChange,
  onBlur,
  onKeyDown,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className="border-input bg-background h-5 w-[140px] rounded border px-2 py-1 text-sm"
      autoFocus
    />
  );
});
