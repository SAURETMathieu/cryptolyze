import { translateErrorMessage } from "@/src/utils/string/translateErrorMessage";
import { toast } from "sonner";

import { UpdateMethodFunctionType } from "@/types/actionsFunction";

/**
 * Type for the `onEdit` function, which handles updating existing data.
 *
 * @template T - The type of the data being updated.
 */
export type OnEditType = typeof onEdit;

/**
 * Function to handle editing (updating) existing data.
 *
 * @template T - The type of the data being updated.
 *
 * @param values - The new values to update the existing data with.
 * @param updateMethod - Function to update the data in the backend. It should accept the new values and the ID of the item to update.
 * @param updateClient - Function to update the client-side state or DOM with the updated data. It should accept the updated data.
 * @param closeModal - Function to close the modal or sheet used for editing.
 * @param idToUpdate - The ID of the item to be updated.
 * @param successMessage - Message to display upon successful update. Default is "Updated successfully!".
 * @param errorMessage - Message to display if an error occurs during update. Default is "An error occurred while updating.".
 *
 * @returns The updated data if the update was successful; otherwise, returns null.
 *
 * @example
 * ```typescript
 * const updatedData = await onEdit(
 *   { name: "New Name" },
 *   updateMethod,
 *   (data) => console.log("Data updated:", data),
 *   () => console.log("Modal closed"),
 *   1
 * );
 * ```
 */
export const onEdit = async <T>(
  values: T,
  updateMethod: UpdateMethodFunctionType<T>,
  updateClient: (updatedData: any) => void,
  closeModal: () => void,
  idToUpdate: string | number,
  successMessage: string = "Updated successfully!",
  errorMessage: string = "An error occurred while updating."
) => {
  try {
    const {
      success,
      message,
      data: updatedElement,
    } = await updateMethod(values, idToUpdate);

    if (!success) {
      throw new Error(message);
    }

    updateClient(updatedElement);
    toast.success(successMessage);
    closeModal();
    return updatedElement;
  } catch (error) {
    console.error("Update failed:", error);
    const errorMessageCustom = translateErrorMessage(error, errorMessage);
    toast.error(errorMessageCustom);
    return null;
  }
};
