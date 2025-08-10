import { translateErrorMessage } from "@/src/utils/string/translateErrorMessage";
import { toast } from "sonner";

/**
 * Type for the `onDelete` function, which handles the deletion of an item.
 *
 * @template T - The type of the item being deleted (not used in the function directly, but for consistency with other types).
 */
export type OnDeleteType = typeof onDelete;

/**
 * Type for a delete method function.
 */
type DeleteMethodFunctionType = (
  ids: string[] | number[]
) => Promise<{ success: boolean; message: string }>;

/**
 * Function to handle the deletion of an item.
 *
 * @param elementIds - The ID(s) of the item(s) to be deleted. This is an array of number or string IDs.
 * @param deleteMethod - Function to perform the deletion in backend. It should accept an array of number or string IDs.
 * @param updateClientAfterDelete - Function to update the client-side state or DOM after successful deletion. It should accept an array of number or string IDs.
 * @param successMessage - Message to display upon successful deletion. Defaults to "Deleted successfully!".
 * @param errorMessage - Message to display if an error occurs during deletion. Defaults to "An error occurred while deleting.".
 *
 * @returns A boolean indicating whether the deletion was successful (`true`) or not (`false`).
 *
 * @example
 * ```typescript
 * const wasDeleted = await onDelete(
 *   [123, 456],
 *   async (ids) => {
 *     // Function to delete items by IDs
 *     return { success: true, message: "Deleted successfully!" };
 *   },
 *   (ids) => console.log("Items deleted with IDs:", ids)
 * );
 * ```
 */

export const onDelete = async (
  elementIds: string[] | number[],
  deleteMethod: DeleteMethodFunctionType,
  updateClientAfterDelete: (ids: string[] | number[], data?: any) => void,
  successMessage: string = "Deleted successfully!",
  errorMessage: string = "An error occurred while deleting."
): Promise<boolean> => {
  try {
    let result: { success: boolean; message: string; data?: any };

    if (typeof deleteMethod === "function") {
      result = await (deleteMethod as DeleteMethodFunctionType)(elementIds);
    } else {
      throw new Error("Invalid delete method provided.");
    }

    if (!result.success) {
      throw new Error(result.message);
    }

    updateClientAfterDelete(elementIds, result.data);
    toast.success(successMessage);
    return true;
  } catch (error) {
    console.error("Deletion failed:", error);
    const errorMessageCustom = translateErrorMessage(error, errorMessage);
    toast.error(errorMessageCustom);
    return false;
  }
};
