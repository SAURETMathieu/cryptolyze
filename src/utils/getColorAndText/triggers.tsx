import { Badge } from "@/components/ui/badge";

export const getTriggerTypeBadges = (trigger: any) => {
  const badges = [];
  if (trigger.on_insert)
    badges.push(
      <Badge
        key="insert"
        variant="secondary"
        className="text-md bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
      >
        INSERT
      </Badge>
    );
  if (trigger.on_update)
    badges.push(
      <Badge
        key="update"
        variant="secondary"
        className="text-md bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700"
      >
        UPDATE
      </Badge>
    );
  if (trigger.on_delete)
    badges.push(
      <Badge
        key="delete"
        variant="secondary"
        className="text-md bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700"
      >
        DELETE
      </Badge>
    );
  if (trigger.on_truncate)
    badges.push(
      <Badge
        key="truncate"
        variant="secondary"
        className="text-md bg-yellow-50 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-700"
      >
        TRUNCATE
      </Badge>
    );
  return badges;
};

export const getTriggerColors = (trigger: any) => {
  const colors = [];
  if (trigger.on_insert)
    colors.push(
      <span key="insert" className="size-4 rounded-full bg-green-700"></span>
    );
  if (trigger.on_update)
    colors.push(
      <span key="update" className="size-4 rounded-full bg-blue-700"></span>
    );
  if (trigger.on_delete)
    colors.push(
      <span key="delete" className="size-4 rounded-full bg-red-700"></span>
    );
  if (trigger.on_truncate)
    colors.push(
      <span key="truncate" className="size-4 rounded-full bg-yellow-700"></span>
    );
  return colors;
};
