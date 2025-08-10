"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type WalletFormTabsProps = {
  closeSheet?: () => void;
};

export const WalletFormTabs = ({ closeSheet }: WalletFormTabsProps) => {
  return (
    <Tabs defaultValue="centralize" className="">
      <TabsList className="grid w-full grid-cols-2 gap-1">
        <TabsTrigger value="centralize">Centralized</TabsTrigger>
        <TabsTrigger value="decentralize">Decentralized</TabsTrigger>
      </TabsList>
      <TabsContent value="centralize" className="py-4">
        {/* <AutoForm
          formSchema={centralizeFormSchema}
          fieldConfig={centralizeConfig}
          closeSheet={closeSheet}
          onSubmit={(values) =>
            onSubmitCentralize(values, addWallet, closeSheet)
          }
        ></AutoForm> */}
      </TabsContent>
      <TabsContent value="decentralize" className="py-8">
        {/* <AutoForm
          formSchema={decentralizeFormSchema}
          fieldConfig={decentralizeConfig}
          closeSheet={closeSheet}
          onSubmit={(values) =>
            onSubmitDecentralize(values, addWallet, closeSheet)
          }
        ></AutoForm> */}
      </TabsContent>
    </Tabs>
  );
};
