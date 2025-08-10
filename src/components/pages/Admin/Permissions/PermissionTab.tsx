import { TabsList, TabsTrigger } from "@/src/components/ui/tabs";

export default function PermissionTab({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  return (
    <TabsList className="border-input gap-2 rounded-lg border">
      <TabsTrigger
        className="hover:bg-muted rounded-lg"
        value="tables"
        onClick={() => onTabChange("tables")}
      >
        Tables
      </TabsTrigger>
      <TabsTrigger
        className="hover:bg-muted rounded-lg"
        value="functions"
        onClick={() => onTabChange("functions")}
      >
        Functions
      </TabsTrigger>
      <TabsTrigger
        className="hover:bg-muted rounded-lg"
        value="schemas"
        onClick={() => onTabChange("schemas")}
      >
        Schemas
      </TabsTrigger>
    </TabsList>
  );
}
