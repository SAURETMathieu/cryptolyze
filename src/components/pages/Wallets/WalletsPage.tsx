import { CardsSection } from "./section/CardsSection";
import { WalletNav } from "./section/WalletNav";
import { WalletCryptoSpread } from "./section/WalletsCryptoSpread";
import { WalletSpread } from "./section/WalletSpread";
import { WalletTableSection } from "./section/WalletTableSection";

export function WalletsPage() {
  return (
    <main className="flex min-h-screen flex-1 max-lg:flex-col sm:py-4 sm:pl-14">
      <section className="flex w-full flex-col gap-2 lg:w-8/12 xl:w-9/12 2xl:w-10/12">
        <WalletNav />
        <CardsSection />
        <WalletTableSection />
      </section>
      <section className="w-full lg:min-h-screen lg:w-4/12 xl:w-3/12 2xl:w-2/12">
        <WalletSpread />
        <WalletCryptoSpread />
      </section>
    </main>
  );
}
