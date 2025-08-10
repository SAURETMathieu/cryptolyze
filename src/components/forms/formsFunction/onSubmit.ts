import { translateErrorMessage } from "@/src/utils/string/translateErrorMessage";
import { toast } from "sonner";

import { InsertMethodFunctionType } from "@/types/actionsFunction";

/**
 * Type definition for the `onSubmit` function.
 */
export type OnSubmitType = typeof onSubmit;

/**
 * Handles the form submission by calling the appropriate insert method and updating the client state.
 *
 * @param values - The form values to be submitted. This should match the type expected by `insertMethod`.
 * @param insertMethod - The method to be called to insert data. It should return an object containing `success`, `message`, and `data`.
 * @param updateClient - A function to update the DOM or global state with the newly created data. It receives the data returned by `insertMethod`.
 * @param closeModal - A function to close the modal or sheet after a successful submission.
 * @param successMessage - (Optional) The message to be displayed in case of successful submission. Defaults to "Created successfully!".
 * @param errorMessage - (Optional) The message to be displayed in case of an error. Defaults to "An error occurred while creating.".
 * @returns The data returned by the `insertMethod` if successful, or `null` if an error occurs.
 */

export const onSubmit = async <T>(
  values: T,
  insertMethod: InsertMethodFunctionType<T>,
  updateClient: (datasToUpdateInDOM: any) => void,
  closeModal: () => void,
  successMessage: string = "Created successfully!",
  errorMessage: string = "An error occurred while creating."
) => {
  try {
    const { success, message, data } = await insertMethod(values);

    if (!success) {
      throw new Error(message);
    }

    updateClient(data);
    toast.success(successMessage);
    closeModal();
    return data;
  } catch (error: any) {
    console.error("Creation failed:", error.message);
    const errorMessageCustom = translateErrorMessage(error, errorMessage);
    toast.error(errorMessageCustom);
    return null;
  }
};
