import InfosPersoForm from "@/src/components/forms/Hub/AuthForms/InfosPersoForm";
import { User } from "lucide-react";

import { Separator } from "@/components/ui/separator";

export default async function AccountPage({ t }: any) {
  return (
    <div className="mx-auto flex w-full flex-col">
      <div className="flex justify-center gap-4">
        <User />
        <h2 className="pb-4 text-xl font-bold">{t("title")}</h2>
      </div>
      <div className="mx-auto w-full max-w-[450px]">
        <Separator className="mx-auto mb-4 max-w-[450px]" />
        <InfosPersoForm />
      </div>
    </div>
  );
}
