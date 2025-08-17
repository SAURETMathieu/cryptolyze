import { DataTableColumnHeader } from "@/src/components/ui/tools/dataTableColumnHeader";
import { cn } from "@/src/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

import { ImageHandler, ImageWithMagnifier } from "../components/ImageHandler";
import { getNestedValueFunction } from "../utils/getNestedValue";

interface CustomColumnProps {
  id: string;
  title: string;
  accessorKey: string;
  altAccessorKey: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  renderCell?: (data: any) => React.ReactNode;
  size?: number;
  headerClassName?: string;
  enableMagnifier?: boolean;
  enableModal?: boolean;
  modalSize?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

/**
 * Creates an image column for a table.
 *
 * @param {Object} params - The parameters to configure the image column.
 * @param {string} params.id - Unique identifier for the column.
 * @param {string} params.title - Title to display in the column header.
 * @param {string} params.accessorKey - Accessor key to retrieve the image URL.
 * @param {string} params.altAccessorKey - Accessor key to retrieve the alt text for the image.
 * @param {boolean} [params.enableSorting=false] - Indicates if the column can be sorted.
 * @param {boolean} [params.enableHiding=false] - Indicates if the column can be hidden.
 * @param {function} [params.renderCell] - Custom render function for the cell. If not provided, defaults to rendering an image.
 * @param {number} [params.size=50] - Size of the image in pixels.
 * @param {string} [params.headerClassName] - Additional CSS classes for the header.
 * @param {boolean} [params.enableMagnifier=false] - Enables zoom effect on hover.
 * @param {boolean} [params.enableModal=true] - Enables modal view on click.
 * @param {string} [params.modalSize="lg"] - Size of the modal (sm, md, lg, xl).
 * @param {string} [params.className] - Additional CSS classes for the image.
 *
 * @returns {ColumnDef<any>} Column definition object for Tanstack Table.
 *
 * @example
 * const imageColumn = createImageColumn({
 *   id: "Image",
 *   title: "Image",
 *   accessorKey: "imageUrl",
 *   altAccessorKey: "imageAlt",
 *   enableMagnifier: true,
 *   enableModal: true,
 *   modalSize: "lg",
 * });
 */
export function createImageColumn({
  id,
  title,
  accessorKey,
  altAccessorKey,
  enableSorting = false,
  enableHiding = false,
  renderCell,
  size = 50,
  headerClassName,
  enableMagnifier = false,
  enableModal = true,
  modalSize = "lg",
  className,
}: CustomColumnProps): ColumnDef<any> {
  return {
    id,
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={title}
        className={cn("max-w-[50px]", headerClassName)}
      />
    ),
    cell: ({ row }) => {
      const datas = row.original;

      const imageUrl = getNestedValueFunction(datas, accessorKey);
      const altText = getNestedValueFunction(datas, altAccessorKey);

      return renderCell ? (
        renderCell(datas)
      ) : enableMagnifier || enableModal ? (
        <ImageWithMagnifier
          src={imageUrl}
          alt={altText}
          width={size}
          height={size}
          className={cn(`border-foreground rounded-lg border`, className)}
          enableMagnifier={enableMagnifier}
          enableModal={enableModal}
          modalSize={modalSize}
        />
      ) : (
        <ImageHandler
          src={imageUrl}
          alt={altText}
          width={size}
          height={size}
          className={cn(`border-foreground rounded-lg border`, className)}
        />
      );
    },
    enableSorting,
    enableHiding,
  };
}
