
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StockStatusItem } from './types';

interface StockStatusTableProps {
  items: StockStatusItem[];
  isLoading: boolean;
  isEditing: boolean;
  onOpeningBalChange: (id: string, value: number) => void;
  onAdjustmentChange: (id: string, value: number) => void;
  onMinLevelChange: (id: string, value: number) => void;
}

const StockStatusTable: React.FC<StockStatusTableProps> = ({
  items,
  isLoading,
  isEditing,
  onOpeningBalChange,
  onAdjustmentChange,
  onMinLevelChange
}) => {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stock Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Opening Bal</TableHead>
              <TableHead className="text-right">Purchases</TableHead>
              <TableHead className="text-right">Utilised</TableHead>
              <TableHead className="text-right">Adj+/-</TableHead>
              <TableHead className="text-right">Closing Bal</TableHead>
              <TableHead className="text-right">Min Level</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, i) => (
              <TableRow key={i}>
                {Array(9).fill(0).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">No stock data found for the selected date.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Stock Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Opening Bal</TableHead>
            <TableHead className="text-right">Purchases</TableHead>
            <TableHead className="text-right">Utilised</TableHead>
            <TableHead className="text-right">Adj+/-</TableHead>
            <TableHead className="text-right">Closing Bal</TableHead>
            <TableHead className="text-right">Min Level</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            // Calculate closing balance on-the-fly for display
            const closingBal = item.opening_bal + item.purchases - item.utilised + item.adj_plus;
            
            // Determine row color based on status
            const rowColor = item.status === 'Out of Stock' 
              ? 'bg-red-50'
              : item.status === 'Low Stock' 
                ? 'bg-amber-50'
                : '';
            
            return (
              <TableRow key={item.id || item.name} className={rowColor}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className="text-right">
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={item.opening_bal}
                      onChange={(e) => onOpeningBalChange(item.id || item.name, parseFloat(e.target.value) || 0)}
                      className="w-20 text-right"
                    />
                  ) : (
                    item.opening_bal.toFixed(2)
                  )}
                </TableCell>
                <TableCell className="text-right">{item.purchases.toFixed(2)}</TableCell>
                <TableCell className="text-right">{item.utilised.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={item.adj_plus}
                      onChange={(e) => onAdjustmentChange(item.id || item.name, parseFloat(e.target.value) || 0)}
                      className="w-20 text-right"
                    />
                  ) : (
                    item.adj_plus.toFixed(2)
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {closingBal.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={item.min_level}
                      onChange={(e) => onMinLevelChange(item.id || item.name, parseFloat(e.target.value) || 0)}
                      className="w-20 text-right"
                    />
                  ) : (
                    item.min_level.toFixed(2)
                  )}
                </TableCell>
                <TableCell>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
                    item.status === 'Normal' 
                      ? 'bg-green-100 text-green-800' 
                      : item.status === 'Low Stock' 
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default StockStatusTable;
