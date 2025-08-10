import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

export function DevisesTabs() {
  return (
    <Tabs
      defaultValue="$"
      className="mx-auto w-full max-w-[450px] gap-4 lg:mx-0"
    >
      <TabsList className="w-full">
        <TabsTrigger value="$" className="w-1/3">
          $
        </TabsTrigger>
        <TabsTrigger value="€" className="w-1/3">
          €
        </TabsTrigger>
        <TabsTrigger value="btc" className="w-1/3">
          BTC
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
