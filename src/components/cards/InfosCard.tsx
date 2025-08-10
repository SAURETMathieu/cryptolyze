import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InfosCard() {
  return (
    <Card className="">
      <CardHeader className="">
        <CardTitle className="text-xl font-medium">Infos</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-sm font-medium">
          Transactions :
          <span className="text-xs text-muted-foreground">250505</span>
        </div>
        <div className="text-sm font-medium">
          Fees :<span className="text-xs text-muted-foreground">25.06 $</span>
        </div>
      </CardContent>
    </Card>
  );
}
