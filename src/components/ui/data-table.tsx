
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Download, Upload, Search, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export interface DataTableProps<T> {
  columns: {
    header: string;
    accessorKey: string;
    cell?: (value: any, row: T) => React.ReactNode;
  }[];
  data: T[];
  searchPlaceholder?: string;
  addButtonText?: string;
  onAddNew?: () => void;
  enableImportExport?: boolean;
  isLoading?: boolean;
}

const DataTable = <T,>({
  columns,
  data,
  searchPlaceholder = 'Search...',
  addButtonText = 'Add New',
  onAddNew,
  enableImportExport = false,
  isLoading = false
}: DataTableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;

    return data.filter(row => {
      return columns.some(column => {
        const value = (row as any)[column.accessorKey];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      });
    });
  }, [data, searchQuery, columns]);

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valueA = (a as any)[sortColumn];
      const valueB = (b as any)[sortColumn];

      if (valueA === valueB) return 0;
      
      if (valueA === null || valueA === undefined) return sortDirection === 'asc' ? -1 : 1;
      if (valueB === null || valueB === undefined) return sortDirection === 'asc' ? 1 : -1;

      // For numeric values
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }

      // For string values
      const stringA = String(valueA).toLowerCase();
      const stringB = String(valueB).toLowerCase();
      
      if (sortDirection === 'asc') {
        return stringA.localeCompare(stringB);
      } else {
        return stringB.localeCompare(stringA);
      }
    });
  }, [filteredData, sortColumn, sortDirection]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0.5 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex gap-2 self-end sm:self-auto">
          {enableImportExport && (
            <>
              <Button variant="outline" size="sm">
                <Upload size={16} className="mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-2" />
                Export
              </Button>
            </>
          )}
          {onAddNew && (
            <Button size="sm" onClick={onAddNew}>
              <Plus size={16} className="mr-2" />
              {addButtonText}
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.accessorKey}
                  className={column.accessorKey !== 'id' ? 'cursor-pointer' : ''}
                  onClick={() => column.accessorKey !== 'id' && handleSort(column.accessorKey)}
                >
                  {column.header}
                  {sortColumn === column.accessorKey && (
                    <span className="ml-2">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((column, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((column) => {
                    const value = (row as any)[column.accessorKey];
                    return (
                      <TableCell key={column.accessorKey}>
                        {column.cell ? column.cell(value, row) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-sm text-muted-foreground">
        {isLoading ? (
          <Skeleton className="h-5 w-40" />
        ) : (
          `Showing ${sortedData.length} of ${data.length} entries`
        )}
      </div>
    </div>
  );
};

export default DataTable;
