"use client";

import TriggersTable from "@/src/components/tables/Admin/Administration/Triggers/TriggersTable";

export function TriggersPage() {
  return (
    <>
      <div>
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold leading-none tracking-tight">
            Triggers Manager
          </h1>
        </div>
        <h2 className="text-muted-foreground my-2">Gestion des triggers</h2>
      </div>

      <section className="">
        <TriggersTable />
      </section>
    </>
  );
}
