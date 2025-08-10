import { newRoleFormSchema } from "@/src/components/forms/admin/RoleForms/newRoleFormConfig";
import { generateLoginFormSchema } from "@/src/components/forms/Hub/AuthForms/loginFormConfig";
import { resetPasswordFormSchema } from "@/src/components/forms/Hub/AuthForms/resetPasswordFormConfig ";
import { signUpFormSchema } from "@/src/components/forms/Hub/AuthForms/signUpFormConfig";
import { updatePasswordFormSchema } from "@/src/components/forms/Hub/AuthForms/updatePasswordFormConfig";
import { z } from "zod";

export type LoginFormType = z.infer<ReturnType<typeof generateLoginFormSchema>>;

export type SignUpFormType = z.infer<ReturnType<typeof signUpFormSchema>>;

export type ResetPasswordFormType = z.infer<
  ReturnType<typeof resetPasswordFormSchema>
>;

export type CreateNewRoleFormType = z.infer<
  ReturnType<typeof newRoleFormSchema>
>;

export type UpdatePasswordFormType = z.infer<
  ReturnType<typeof updatePasswordFormSchema>
>;
