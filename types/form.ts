import { OnEditType } from "@/src/components/forms/formsFunction/onEdit";
import { OnSubmitType } from "@/src/components/forms/formsFunction/onSubmit";
import { InsertMethodFunctionType, UpdateMethodFunctionType } from "@/types";

export type AutoFormTemplateProps<T> = {
  /**
   * Initial data to pre-fill the form. If data exists, the form will be in edit mode.
   */
  datas?: T;

  /**
   * Optional function to close a custom sheet or modal. Used instead of `closeModal`.
   */
  closeSheet?: () => void;

  /**
   * Function called after a successful update to update the DOM or global state with the new data.
   */
  handleUpdateClient: (datasToUpdateInDOM: T) => void;

  /**
   * Function to be called on form submission. Can be for creating or editing data.
   */
  onSubmit: OnSubmitType | OnEditType;

  /**
   * Method to use for inserting or updating data in the backend.
   */
  fetchMethod: InsertMethodFunctionType<T> | UpdateMethodFunctionType<T>;

  /**
   * Field configuration for the form.
   */
  fieldConfig: any;

  /**
   * Validation schema for the form.
   */
  formSchema: any;

  /**
   * Message to display upon successful form submission.
   */
  successMessage: string;

  /**
   * Message to display in case of an error during form submission.
   */
  errorMessage: string;
}
