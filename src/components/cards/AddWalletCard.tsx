"use client";

import { useModal } from "@/src/context/modalProvider";
import truncateTextWithEllipsisMiddle from "@/src/utils/string/truncateTextWithEllipsisMiddle";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CopyButton from "@/components/buttons/CopyButton";
import { WalletFormTabs } from "@/components/tabs/WalletFormTabs";

interface AddWalletCardProps {
  wallet?: any;
}

export function AddWalletCard({ wallet }: AddWalletCardProps) {
  const { openModal, setTitle, setDescription } = useModal();
  return (
    <Card className="items-between flex flex-col">
      <CardHeader className="">
        <CardTitle className="text-2xl font-medium">
          {wallet ? wallet.name : "Your wallets"}
        </CardTitle>
        <CardDescription className="flex max-w-lg gap-2 text-balance text-sm leading-relaxed">
          <span className="max-w-[80%]">
            {wallet
              ? truncateTextWithEllipsisMiddle(wallet.address, 7)
              : "Your wallets"}
          </span>
          {wallet && <CopyButton toCopy={wallet.address} />}
        </CardDescription>
      </CardHeader>
      <CardFooter className="">
        <Button
          onClick={() => {
            setTitle("Create your wallet");
            setDescription("Create your wallet for tracking your cryptos");
            openModal(<WalletFormTabs />);
          }}
        >
          Add a wallet
        </Button>
      </CardFooter>
    </Card>
  );
}
