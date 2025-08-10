import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

export function CryptoTabs() {
  return (
    <Tabs defaultValue="All" className="w-full max-w-[450px] gap-2 p-4 py-0">
      <TabsList className="w-full">
        <TabsTrigger value="All" className="w-1/4">
          All
        </TabsTrigger>
        <TabsTrigger value="1w" className="hidden w-1/4 md:block">
          1 semaine
        </TabsTrigger>
        <TabsTrigger value="1m" className="w-1/4">
          1 mois
        </TabsTrigger>
        <TabsTrigger value="3m" className="hidden w-1/4 md:block">
          3 mois
        </TabsTrigger>
        <TabsTrigger value="6m" className="w-1/4">
          6 mois
        </TabsTrigger>
        <TabsTrigger value="1y" className="w-1/4">
          1 an
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
