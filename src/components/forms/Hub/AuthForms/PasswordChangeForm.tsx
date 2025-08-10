import { updatePassword } from "@/src/app/actions/profile";
import { onSubmit } from "@/src/components/forms/formsFunction/onSubmit";

import AutoFormTemplate from "@/components/forms/AutoFormTemplate";
import {
  fieldConfig,
  updatePasswordFormSchema,
} from "@/components/forms/Hub/AuthForms/updatePasswordFormConfig";

export const modalContentForUpdatePassword = (
  successMessage: string,
  errorMessage: string,
) => (
  <AutoFormTemplate<any>
    handleUpdateClient={() => {}}
    formSchema={updatePasswordFormSchema}
    fieldConfig={fieldConfig}
    onSubmit={onSubmit}
    fetchMethod={updatePassword as any}
    successMessage={successMessage}
    errorMessage={errorMessage}
  />
);
