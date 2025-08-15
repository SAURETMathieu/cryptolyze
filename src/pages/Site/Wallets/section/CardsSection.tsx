import { AddBotCard } from "@/components/cards/AddBotCard";
import { AddWalletCard } from "@/components/cards/AddWalletCard";
import { BalanceCard } from "@/components/cards/BalanceCard";
import { ProfitsCard } from "@/components/cards/ProfitsCard";

interface CardsSectionProps {
  wallet?: any;
}

export function CardsSection({ wallet }: CardsSectionProps) {
  return (
    <section className="grid gap-4 p-4 py-0 sm:grid-cols-2 md:gap-2 xl:grid-cols-4">
      <AddWalletCard wallet={wallet} />
      <AddBotCard />
      <BalanceCard wallet={wallet} />
      <ProfitsCard wallet={wallet} />
    </section>
  );
}
