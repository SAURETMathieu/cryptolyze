import {
  createArraySchema,
  createBooleanSchema,
  createStringSchema,
} from "@/src/schemas/utils";
import { EmailType } from "@/src/store/admin/email.store";
import { z } from "zod";

export const generateEmailConfigSchema = (
  tForm: MessagesIntl,
  datas?: EmailType
) =>
  z.object({
    status: createBooleanSchema({
      dictionnary: tForm,
      defaultValue: datas?.status,
      required: false,
    }),
    key: createStringSchema({ dictionnary: tForm, defaultValue: datas?.key }),
    description: createStringSchema({
      dictionnary: tForm,
      defaultValue: datas?.description ?? "",
      required: false,
    }),
    details: createStringSchema({
      dictionnary: tForm,
      defaultValue: datas?.details ?? "",
      required: false,
    }),
    triggers: createArraySchema(
      z.string(),
      1,
      undefined,
      "Un trigger doit être séléctionné au minimum",
      datas?.triggers ?? []
    ),
    n8n_name: createStringSchema({
      dictionnary: tForm,
      defaultValue: datas?.n8n_name ?? "",
    }),
    n8n_link: createStringSchema({
      dictionnary: tForm,
      defaultValue: datas?.n8n_link ?? "",
    }),
    n8n_endpoint: createStringSchema({
      dictionnary: tForm,
      defaultValue: datas?.n8n_endpoint ?? "",
    }),
    n8n_event: createStringSchema({
      dictionnary: tForm,
      defaultValue: datas?.n8n_event ?? "",
    }),
  });

export type EmailConfigSchemaType = z.infer<
  ReturnType<typeof generateEmailConfigSchema>
>;
