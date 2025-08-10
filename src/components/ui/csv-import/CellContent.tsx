"use client";

import { memo, useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { EditableInput } from "./EditableInput";

export const CellContent = memo(function CellContent({
  row,
  field,
  rowIndex,
  onCellEdit,
  getCellError,
  setCurrentErrorIndex,
  errorRows,
}: {
  row: Record<string, unknown>;
  field: { value: string };
  rowIndex: number;
  onCellEdit: (
    rowIndex: number,
    fieldValue: string,
    currentValue: string
  ) => void;
  getCellError: (rowIndex: number, fieldValue: string) => string | undefined;
  setCurrentErrorIndex: (index: number) => void;
  errorRows?: number[];
}) {
  const [value, setValue] = useState(String(row[field.value] ?? ""));
  const [isEditing, setIsEditing] = useState(false);
  const error = getCellError(rowIndex, field.value);

  useEffect(() => {
    if (!isEditing) {
      setValue(String(row[field.value] ?? ""));
    }
  }, [isEditing, row, field.value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        onCellEdit(rowIndex, field.value, value);
        setIsEditing(false);
      } else if (e.key === "Escape") {
        setValue(String(row[field.value] ?? ""));
        setIsEditing(false);
      }
    },
    [rowIndex, field.value, onCellEdit, row, value]
  );

  const handleBlur = useCallback(() => {
    if (value !== String(row[field.value] ?? "")) {
      onCellEdit(rowIndex, field.value, value);
    }
    setIsEditing(false);
  }, [rowIndex, field.value, row, onCellEdit, value]);

  const handleClick = useCallback(() => {
    setIsEditing(true);
    if (errorRows) {
      const errorIndex = errorRows.indexOf(rowIndex);
      if (errorIndex !== -1) {
        setCurrentErrorIndex(errorIndex);
      }
    }
  }, [errorRows, setCurrentErrorIndex, rowIndex]);

  return (
    <div className="flex flex-col gap-1">
      {isEditing ? (
        <EditableInput
          value={value}
          onChange={setValue}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span
          className={cn(
            "line-clamp-1 min-h-5 cursor-pointer hover:underline",
            (error || !row[field.value]) && "text-red-900"
          )}
          onClick={handleClick}
        >
          {value}
        </span>
      )}
      {error && <span className="text-xs font-bold text-red-900">{error}</span>}
    </div>
  );
});
