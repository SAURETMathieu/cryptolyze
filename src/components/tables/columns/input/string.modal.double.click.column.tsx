"use client";

import { useRef } from "react";
import CopyButton from "@/src/components/buttons/CopyButton";
import { DataTableColumnHeader } from "@/src/components/ui/tools/dataTableColumnHeader";
import { useModal } from "@/src/context/modalProvider";
import { cn } from "@/src/lib/utils";
import { formatSize } from "@/src/utils";
import truncateTextWithEllipsisMiddle from "@/src/utils/string/truncateTextWithEllipsisMiddle";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { getNestedValueFunction } from "../utils/getNestedValue";

interface StringColumnProps {
  id: string;
  title: string;
  accessorKey: string;
  accessorKey2?: string;
  className?: string;
  headerClassName?: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  filterFn?: FilterFn<any>;
  textClassName?: string;
  numberEllipsis?: number;
  withCopy?: boolean;
  extraText?: string;
  labelFn?: (datas: any) => string;
  modalTitle: string | ((data: any) => string);
  modalContent: React.ComponentType<any>;
  customIndicator?: (datas: any) => React.ReactNode;
}

export function CreateStringWithModalColumn({
  id,
  title,
  accessorKey,
  accessorKey2,
  className,
  headerClassName,
  enableSorting = false,
  enableHiding = false,
  filterFn,
  textClassName,
  numberEllipsis,
  withCopy,
  extraText,
  labelFn,
  modalTitle,
  modalContent: ModalContent,
  customIndicator,
}: StringColumnProps): ColumnDef<any> {
  const { openModal, setTitle } = useModal();
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  return {
    id,
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={title}
        className={cn("mx-auto max-w-[120px]", headerClassName)}
      />
    ),
    cell: ({ row }) => {
      const datas = row.original;
      let stringText = getNestedValueFunction(datas, accessorKey);
      if (accessorKey2) {
        stringText += " " + getNestedValueFunction(datas, accessorKey2);
      }
      if (id === "size") {
        stringText = formatSize(stringText);
      }
      stringText = labelFn ? labelFn(row.original) : stringText;

      const handleDoubleClick = () => {
        const title =
          typeof modalTitle === "function" ? modalTitle(datas) : modalTitle;
        setTitle(title ?? "");
        openModal(<ModalContent datas={datas} />);
      };

      const handleClickWithDoubleClickDetection = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (clickTimeout.current) {
          clearTimeout(clickTimeout.current);
          clickTimeout.current = null;
          handleDoubleClick();
        } else {
          clickTimeout.current = setTimeout(() => {
            clickTimeout.current = null;
          }, 300);
        }
      };

      return (
        <div
          className={cn(
            "text-md flex items-center justify-center gap-2 text-center",
            className
          )}
          onClick={handleClickWithDoubleClickDetection}
        >
          {customIndicator && customIndicator(datas)}
          {stringText ? (
            <span className={cn("", textClassName)} title={stringText}>
              {numberEllipsis
                ? truncateTextWithEllipsisMiddle(stringText, numberEllipsis)
                : stringText}
              {extraText ? ` ${extraText}` : ""}
            </span>
          ) : (
            <span className={cn("text-muted-foreground", textClassName)}>
              ---
            </span>
          )}
          {withCopy && <CopyButton toCopy={stringText ?? ""} />}
        </div>
      );
    },
    enableSorting,
    enableHiding,
    filterFn,
  };
}
