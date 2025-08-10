import NavigationLink from "@/src/components/link/NavigationLink";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

import { AdminNavSubItem } from "./navbarConfig";

export default function MenuCardItem({
  subItem,
}: {
  subItem: AdminNavSubItem;
}) {
  return (
    <NavigationLink href={subItem.href}>
      <Card className="hover:bg-muted col-span-1 p-0 py-8">
        <CardHeader className="flex items-center justify-center text-3xl">
          <CardTitle>{subItem.label}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <span className="scale-150">{subItem.icon}</span>
        </CardContent>
      </Card>
    </NavigationLink>
  );
}
