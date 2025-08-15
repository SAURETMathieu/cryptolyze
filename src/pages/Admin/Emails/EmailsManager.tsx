import { EmailsTable } from "@/src/components/tables/Admin/Administration/Emails/EmailsTable";

import { NewEmailButton } from "./NewEmailButton";

export function EmailsPage() {
  return (
    <>
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold leading-none tracking-tight">
            Emails Manager
          </h1>
          <h2 className="text-muted-foreground my-2">Gestion des emails</h2>
        </div>
        <NewEmailButton />
      </div>

      <section className="">
        <EmailsTable />
      </section>
    </>
  );
}
