import { Table } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ColumnVisibilityToggleProps<TData> {
  table: Table<TData>;
}

export function ColumnVisibilityToggle<TData>({ table }: ColumnVisibilityToggleProps<TData>) {
  const columnDisplayNames: { [key: string]: string } = {
    time: "Laiks",
    brand: "Marka",
    car: "Modelis",
    lic_plate: "Numurs",
    type: "Tips",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Filtri</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            const displayName = columnDisplayNames[column.id] || column.id;
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(checked) => {
                  column.toggleVisibility(checked);
                }}
              >
                {displayName}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}