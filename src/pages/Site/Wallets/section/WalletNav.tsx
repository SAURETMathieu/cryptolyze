import { DevisesTabs } from "@/src/components/tabs/DevisesTabs";
import { Button } from "@/src/components/ui/button";

export function WalletNav() {
  return (
    <section className="flex w-full gap-4 p-4 py-2 max-lg:flex-col sm:pt-0 lg:justify-between">
      <DevisesTabs />

      <div className="mx-auto flex w-full max-w-[450px] items-center justify-center gap-2 self-end lg:mx-0">
        <Button variant="outline" className="w-1/2 bg-card text-xs">
          All Cryptos
        </Button>
        <Button variant="outline" className="w-1/2 bg-card text-xs">
          All Transactions
        </Button>
      </div>
    </section>
  );
}
