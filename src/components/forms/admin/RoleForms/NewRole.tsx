"use client";

import { Dispatch, SetStateAction, useTransition } from "react";
import { createRole } from "@/src/app/actions/admin/roles";
import { newRoleFormSchema } from "@/src/components/forms/admin/RoleForms/newRoleFormConfig";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { useModal } from "@/src/context/modalProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { CreateNewRoleFormType } from "@/types/returnType";
import { Input } from "@/components/ui/input";
import SubmitButtons from "@/components/forms/layout/SubmitButtons";

export function CreateNewRoleForm({
  setRolesState,
}: {
  setRolesState: Dispatch<
    SetStateAction<
      {
        name: string;
      }[]
    >
  >;
}) {
  const [isPending, startTransition] = useTransition();
  const formSchema = newRoleFormSchema();
  const defaultValues = { role: "" };
  const { closeModal, isOpen } = useModal();

  const form = useForm<CreateNewRoleFormType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values: CreateNewRoleFormType) {
    startTransition(async () => {
      const { success, message } = await createRole(values.role);
      if (success) {
        toast.success(message);
        setRolesState((prevRoles) => {
          const updatedRoles = [...prevRoles, { name: values.role }];
          updatedRoles.sort((a, b) => a.name.localeCompare(b.name));
          return updatedRoles;
        });
        if (isOpen) {
          closeModal();
        }
      } else {
        toast.error(message);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du nouveau rôle</FormLabel>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButtons
          form={form}
          isPending={isPending}
          defaultValues={defaultValues}
        />
      </form>
    </Form>
  );
}
