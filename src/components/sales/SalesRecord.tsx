import React, { useState } from 'react';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import SaleForm, { Sale } from './SaleForm';
import { InventoryItem } from './InventoryItemForm';
import { SalesChannel } from './SalesChannelForm';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { format } from 'date-fns';

interface SalesRecordProps {
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  salesChannels: SalesChannel[];
  inventoryItems: InventoryItem[];
}

const SalesRecord = ({ sales, setSales, salesChannels, inventoryItems }: SalesRecordProps) => {
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  const getSalesChannelName = (id: string) => {
    const channel = salesChannels.find(c => c.id === id);
    return channel ? channel.name : 'Unknown';
  };

  const getProductName = (id: string) => {
    const product = inventoryItems.find(p => p.id === id);
    return product ? `${product.sku} - ${product.name}` : 'Unknown';
  };

  const columns = [
    { 
      header: "Date", 
      accessorKey: "date",
      cell: (value: Date) => formatDate(value)
    },
    { 
      header: "Sales Channel", 
      accessorKey: "salesChannel",
      cell: (value: string) => getSalesChannelName(value)
    },
    { 
      header: "Order No.", 
      accessorKey: "orderNo",
      cell: (value: string) => value || "-"
    },
    { 
      header: "Invoice No.", 
      accessorKey: "invoiceNo",
      cell: (value: string) => value || "-"
    },
    { 
      header: "Product", 
      accessorKey: "product",
      cell: (value: string) => getProductName(value)
    },
    { header: "Quantity", accessorKey: "quantity" },
    { 
      header: "Unit Price", 
      accessorKey: "unitPrice",
      cell: (value: number) => value ? `₹${value.toFixed(2)}` : "-"
    },
    { 
      header: "Total Amount", 
      accessorKey: "totalAmount",
      cell: (value: number) => `₹${value.toFixed(2)}`
    },
    { 
      header: "Actions", 
      accessorKey: "id",
      cell: (value: string, row: Sale) => (
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
          >
            <Trash2 size={16} className="text-destructive" />
          </Button>
        </div>
      )
    }
  ];

  const handleAddNew = () => {
    setSelectedSale(null);
    setOpenForm(true);
  };

  const handleEdit = (sale: Sale) => {
    setSelectedSale(sale);
    setOpenForm(true);
  };

  const handleDelete = (sale: Sale) => {
    setSelectedSale(sale);
    setOpenDeleteDialog(true);
  };

  const handleSubmit = (data: Sale) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (selectedSale) {
        // Update existing sale
        setSales(prev => 
          prev.map(sale => 
            sale.id === selectedSale.id ? { ...data, id: selectedSale.id } : sale
          )
        );
        toast({
          title: "Sale record updated",
          description: `Sale record has been updated successfully.`,
        });
      } else {
        // Add new sale - ensure it has an ID
        const newSale: Sale = {
          ...data,
          id: Date.now().toString(), // Generate temporary ID
        };
        setSales(prev => [...prev, newSale]);
        toast({
          title: "Sale record added",
          description: `New sale record has been added successfully.`,
        });
      }
      
      setIsLoading(false);
      setOpenForm(false);
    }, 600);
  };

  const confirmDelete = () => {
    if (!selectedSale) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSales(prev => 
        prev.filter(sale => sale.id !== selectedSale.id)
      );
      
      toast({
        title: "Sale record deleted",
        description: `Sale record has been deleted.`,
        variant: "destructive",
      });
      
      setIsLoading(false);
      setOpenDeleteDialog(false);
    }, 600);
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={sales}
        onAddNew={handleAddNew}
        addButtonText="Record New Sale"
        searchPlaceholder="Search sales..."
        enableImportExport={true}
      />

      <SaleForm
        open={openForm}
        onOpenChange={setOpenForm}
        onSubmit={handleSubmit}
        initialData={selectedSale || undefined}
        isLoading={isLoading}
        salesChannels={salesChannels}
        products={inventoryItems}
      />

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this sale record.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SalesRecord;
