import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface AdminColumn<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

export function AdminTable<T extends { id: string }>({
  rows,
  columns,
}: {
  rows: T[];
  columns: AdminColumn<T>[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            {columns.map((col) => (
              <th key={col.header} className={cn("px-4 py-3 font-medium", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                No records yet.
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border last:border-none hover:bg-surface-raised">
              {columns.map((col) => (
                <td key={col.header} className={cn("px-4 py-3", col.className)}>
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
