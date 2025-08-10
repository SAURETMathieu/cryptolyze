"use client";

import CopyButton from "@/src/components/buttons/CopyButton";
import ExternalLink from "@/src/components/link/ExternalLink";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useModal } from "@/src/context/modalProvider";
import { EmailType } from "@/src/store/admin/email.store";
import { useAdminTriggerStore } from "@/src/store/admin/trigger.store";
import { formatLocaleShortDateAndTime, getTriggerColors } from "@/src/utils";
import { ExternalLinkIcon } from "lucide-react";
import { useLocale } from "next-intl";

interface EmailConfigDetailsProps {
  email: EmailType;
}
export function EmailConfigDetails({ email }: EmailConfigDetailsProps) {
  const { closeModal } = useModal();
  const triggers = useAdminTriggerStore((state) => state.triggers);
  const triggerFetched = useAdminTriggerStore((state) => state.triggerFetched);
  const locale = useLocale();
  const { date, time } = formatLocaleShortDateAndTime(
    email.last_send_at,
    locale
  );
  return (
    <div className="flex flex-col gap-2">
      <Separator />
      <div className="text-muted-foreground flex items-center justify-between gap-2 text-sm">
        <span className="font-medium">
          Dernier envoi: {date} {time}
        </span>
        <span>{email.nb_send} envoi(s)</span>
      </div>
      <h3 className="text-lg font-bold">Description</h3>
      <p className="text-sm font-light">
        {email.description ?? "Aucune description"}
      </p>
      <h3 className="mt-4 text-lg font-bold">Triggers</h3>
      {triggerFetched &&
        email?.triggers?.map((trigger) => {
          const triggerData = triggers.find((t) => t.trigger_name === trigger);
          if (!triggerData) return null;
          return (
            <div
              className="flex w-full items-center justify-between gap-2 text-sm"
              key={trigger}
            >
              <span
                className="block max-w-[350px] truncate font-light"
                title={triggerData?.trigger_name as string}
              >
                {triggerData?.trigger_name as string}
              </span>
              <div className="flex items-center gap-2">
                {getTriggerColors(triggerData)}
              </div>
            </div>
          );
        })}
      {!triggerFetched && (
        <div className="flex w-full items-center justify-between gap-2">
          <Skeleton className="h-[20px] w-full" />
          <Skeleton className="ml-4 size-[1.2rem] rounded-full" />
          <Skeleton className="size-[1.2rem] rounded-full" />
        </div>
      )}
      <h3 className="mt-4 text-lg font-bold">Détails</h3>
      <p className="whitespace-pre-line text-left text-sm font-light">
        {email.details ?? "Aucun détails"}
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <h3 className="text-lg font-bold">N8N</h3>
        <p className="text-sm">{email.n8n_name ?? "---"}</p>
        <div className="flex justify-between gap-1">
          <p className="max-w-[80%] text-sm" title={email.n8n_endpoint ?? ""}>
            {email.n8n_endpoint
              ? email.n8n_endpoint.replace(
                  /^https:\/\/n8n\.limitedresell\.com\/webhook\//,
                  ".../"
                )
              : "---"}
          </p>
          <CopyButton toCopy={email.n8n_endpoint ?? ""} />
        </div>
        <div className="flex max-w-full items-center justify-between gap-2">
          <p className="text-sm">
            <span className="font-semibold underline underline-offset-2">
              Event:
            </span>{" "}
            <span className="text-muted-foreground ml-4">
              {email.n8n_event ?? "---"}
            </span>
          </p>

          <ExternalLink
            href={email.n8n_link ?? ""}
            title={email.n8n_name ?? ""}
            description={email.n8n_event ?? ""}
          >
            <Button variant="outline" size="icon" className="size-8 rounded-lg">
              <ExternalLinkIcon className="size-4" />
            </Button>
          </ExternalLink>
        </div>
      </div>
      <Button variant="primary" className="w-full" onClick={() => closeModal()}>
        Fermer
      </Button>
    </div>
  );
}
