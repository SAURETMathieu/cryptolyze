import { resetPassword } from "@/src/app/actions/profile";
import { onSubmit } from "@/src/components/forms/formsFunction/onSubmit";
import { useRouter } from "@/src/i18n/navigation";

import AutoFormTemplate from "@/components/forms/AutoFormTemplate";
import {
  fieldConfig,
  resetPasswordFormSchema,
} from "@/components/forms/Hub/AuthForms/resetPasswordFormConfig ";

const redirectAfterResetPassword = (isSuccess: boolean, router: any) => {
  if (isSuccess) {
    router.replace("/profile");
  }
};

export const ResetPasswordFormContent = (
  successMessage: string,
  errorMessage: string
) => {
  const router = useRouter();

  return (
    <AutoFormTemplate<any>
      handleUpdateClient={(isSuccess: boolean) =>
        redirectAfterResetPassword(isSuccess, router)
      }
      formSchema={resetPasswordFormSchema}
      fieldConfig={fieldConfig}
      onSubmit={onSubmit}
      fetchMethod={resetPassword as any}
      successMessage={successMessage}
      errorMessage={errorMessage}
    />
  );
};
