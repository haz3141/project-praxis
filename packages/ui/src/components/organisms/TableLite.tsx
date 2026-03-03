import type { ReactNode } from 'react';

export interface TableLiteColumn<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
}

export interface TableLiteProps<T> {
  rows: T[];
  columns: TableLiteColumn<T>[];
  emptyState?: ReactNode;
}

export function TableLite<T>({ rows, columns, emptyState }: TableLiteProps<T>) {
  if (rows.length === 0) {
    return <div className="ds-empty-state">{emptyState || 'No data'}</div>;
  }

  return (
    <table className="ds-table-lite">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column.key}>{column.render(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
