
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Upload, Search, Plus } from "lucide-react";
import { cn } from '@/lib/utils';

interface DataTableColumn {
  header: string;
  accessorKey: string;
  className?: string;
  cell?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn[];
  data: T[];
  onRowClick?: (row: T) => void;
  onAddNew?: () => void;
  searchPlaceholder?: string;
  addButtonText?: string;
  className?: string;
  enableImportExport?: boolean;
  isLoading?: boolean; // Add isLoading prop
}

const DataTable = <T extends object>({
  columns,
  data,
  onRowClick,
  onAddNew,
  searchPlaceholder = "Search...",
  addButtonText = "Add New",
  className,
  enableImportExport = false,
  isLoading = false, // Default to false
}: DataTableProps<T>) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredData = React.useMemo(() => {
    return data.filter(row => {
      if (!searchTerm) return true;
      
      return Object.values(row).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [data, searchTerm]);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            onChange={handleSearch}
            className="pl-8"
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center gap-2">
          {enableImportExport && (
            <>
              <Button variant="outline" size="sm" disabled={isLoading}>
                <Download size={16} className="mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" disabled={isLoading}>
                <Upload size={16} className="mr-2" />
                Import
              </Button>
            </>
          )}
          {onAddNew && (
            <Button size="sm" onClick={onAddNew} disabled={isLoading}>
              <Plus size={16} className="mr-2" />
              {addButtonText}
            </Button>
          )}
        </div>
      </div>
      
      <div className="border rounded-md">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={index} className={column.className}>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((row, rowIndex) => (
                  <TableRow 
                    key={rowIndex}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={onRowClick ? "cursor-pointer hover:bg-muted" : ""}
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex} className={column.className}>
                        {column.cell 
                          ? column.cell(row[column.accessorKey as keyof T], row)
                          : String(row[column.accessorKey as keyof T] || '')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default DataTable;
