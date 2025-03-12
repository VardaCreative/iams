
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StockItem } from './types';

interface StockStatusTableProps {
  items: StockItem[];
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StockStatusTable: React.FC<StockStatusTableProps> = ({ 
  items, 
  searchTerm, 
  onSearchChange 
}) => {
  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Current Stock Status</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search raw materials..."
              value={searchTerm}
              onChange={onSearchChange}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min. Level</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      {item.currentStock} {item.unit.toUpperCase()}
                    </TableCell>
                    <TableCell>
                      {item.minStockLevel} {item.unit.toUpperCase()}
                    </TableCell>
                    <TableCell>{formatDate(item.lastPurchaseDate)}</TableCell>
                    <TableCell>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
                        item.status === 'normal' 
                          ? 'bg-green-100 text-green-800' 
                          : item.status === 'low'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800 flex items-center'
                      }`}>
                        {item.status === 'critical' && (
                          <AlertTriangle size={12} className="mr-1" />
                        )}
                        {item.status === 'normal' ? 'Normal' : item.status === 'low' ? 'Low Stock' : 'Critical'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockStatusTable;
