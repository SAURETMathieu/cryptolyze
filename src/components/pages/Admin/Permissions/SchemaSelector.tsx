import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/selectWithoutForm";

import { SchemaType } from "@/types/admin/role";

export default function SchemaSelector({
  schemas,
  selectedSchema,
  onSchemaChange,
}: {
  schemas: SchemaType[];
  selectedSchema: string;
  onSchemaChange: (value: string) => void;
}) {
  return (
    <div className="w-[250px]">
      <Label htmlFor="schema">Schéma</Label>
      <Select value={selectedSchema} onValueChange={onSchemaChange}>
        <SelectTrigger id="schema">
          <SelectValue placeholder="Sélectionner un schéma" />
        </SelectTrigger>
        <SelectContent>
          {schemas.map((schema: any) => (
            <SelectItem key={schema.name} value={schema.name}>
              {schema.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
