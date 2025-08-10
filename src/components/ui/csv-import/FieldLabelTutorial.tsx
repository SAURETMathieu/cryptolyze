import { useModal } from "@/src/context/modalProvider";
import { InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type FieldLabelTutorialProps = {
  field: {
    label: string;
    value: string;
    required?: boolean;
    default?: string;
    infos?: React.ReactNode;
    description?: string;
  };
};

export function FieldLabelTutorial({ field }: FieldLabelTutorialProps) {
  const { openModal, setTitle } = useModal();
  const tTable = useTranslations("Tables");
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        <span className="font-medium">{field.value}</span>
        {field.required ? (
          <>
            <span className="text-destructive mr-1 text-sm">*</span>
            <Badge variant="green">{tTable("required")}</Badge>
          </>
        ) : (
          <Badge variant="default" className="hover:bg-default">
            {tTable("optional")}
          </Badge>
        )}
        {field.default && (
          <span className="text-sm font-medium">
            {" "}
            ({tTable("default")}: {field.default})
          </span>
        )}
        {field.infos && (
          <Button
            variant="ghost"
            className="size-5 p-0 hover:bg-transparent hover:text-yellow-500"
          >
            <InfoIcon
              className="size-4"
              onClick={() => {
                setTitle(
                  tTable("csv_import_informations", { label: field.value })
                );
                openModal(field.infos);
              }}
            />
          </Button>
        )}
      </div>
      {field.description && (
        <p className="text-muted-foreground text-sm">{field.description}</p>
      )}
    </div>
  );
}
