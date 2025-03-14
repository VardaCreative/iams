
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, FileText } from 'lucide-react';
import { StockPurchase } from './StockPurchasesManagement';

export const formatDate = (date: Date) => {
  return format(new Date(date), 'dd/MM/yyyy');
};

interface ColumnProps {
  handleEdit: (purchase: StockPurchase) => void;
  handleDelete: (purchase: StockPurchase) => void;
}

export const getPurchaseColumns = ({ handleEdit, handleDelete }: ColumnProps) => [
  { 
    header: "Date", 
    accessorKey: "purchase_date",
    cell: (value: Date) => formatDate(value)
  },
  { header: "Vendor", accessorKey: "vendor_name" },
  { 
    header: "PO / Invoice", 
    accessorKey: "id",
    cell: (value: string, row: StockPurchase) => (
      <div className="space-y-1">
        <div className="flex items-center text-sm">
          <FileText size={14} className="mr-1 text-muted-foreground" />
          {row.purchase_order}
        </div>
        {row.invoice && (
          <div className="text-xs text-muted-foreground">{row.invoice}</div>
        )}
      </div>
    )
  },
  { header: "Material", accessorKey: "material_name" },
  { 
    header: "Quantity", 
    accessorKey: "quantity",
    cell: (value: number, row: StockPurchase) => `${value} ${row.unit.toUpperCase()}`
  },
  { 
    header: "Unit Price", 
    accessorKey: "unit_price",
    cell: (value: number) => `₹${value.toFixed(2)}`
  },
  { 
    header: "Total Amount", 
    accessorKey: "total_amount",
    cell: (value: number) => `₹${value.toLocaleString('en-IN')}`
  },
  { 
    header: "Status", 
    accessorKey: "status",
    cell: (value: string) => {
      let bgColor = 'bg-blue-100 text-blue-800';
      if (value === 'received') bgColor = 'bg-green-100 text-green-800';
      else if (value === 'cancelled') bgColor = 'bg-red-100 text-red-800';
      
      return (
        <div className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${bgColor}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </div>
      );
    }
  },
  { 
    header: "Actions", 
    accessorKey: "id",
    cell: (value: string, row: StockPurchase) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(row);
          }}
        >
          <Edit size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(row);
          }}
          disabled={row.status === 'received'}
        >
          <Trash2 size={16} className="text-destructive" />
        </Button>
      </div>
    )
  }
];
