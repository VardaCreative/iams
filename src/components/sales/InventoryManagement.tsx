import React, { useState } from 'react';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import InventoryItemForm, { InventoryItem } from './InventoryItemForm';
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

interface InventoryManagementProps {
  inventoryItems: InventoryItem[];
  setInventoryItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

const InventoryManagement = ({ inventoryItems, setInventoryItems }: InventoryManagementProps) => {
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    { header: "SKU", accessorKey: "sku" },
    { header: "Product Name", accessorKey: "name" },
    { header: "Category", accessorKey: "category" },
    { 
      header: "Unit Price", 
      accessorKey: "unitPrice",
      cell: (value: number) => `₹${value.toFixed(2)}`
    },
    { 
      header: "Quantity", 
      accessorKey: "quantity" 
    },
    { 
      header: "Minimum Stock", 
      accessorKey: "minimumStock",
      cell: (value: number, row: InventoryItem) => (
        <span className={row.quantity < value ? "text-destructive font-medium" : ""}>
          {value}
        </span>
      )
    },
    { 
      header: "Status", 
      accessorKey: "quantity",
      cell: (value: number, row: InventoryItem) => {
        if (value <= 0) {
          return <Badge variant="destructive">Out of Stock</Badge>;
        }
        if (value < row.minimumStock) {
          return <Badge variant="warning" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Low Stock</Badge>;
        }
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">In Stock</Badge>;
      }
    },
    { 
      header: "Actions", 
      accessorKey: "id",
      cell: (value: string, row: InventoryItem) => (
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
    setSelectedItem(null);
    setOpenForm(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setOpenForm(true);
  };

  const handleDelete = (item: InventoryItem) => {
    setSelectedItem(item);
    setOpenDeleteDialog(true);
  };

  const handleSubmit = (data: InventoryItem) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (selectedItem) {
        // Update existing item
        setInventoryItems(prev => 
          prev.map(item => 
            item.id === selectedItem.id ? { ...data, id: selectedItem.id } : item
          )
        );
        toast({
          title: "Inventory item updated",
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        // Add new item - ensure it has an ID
        const newItem: InventoryItem = {
          ...data,
          id: Date.now().toString(), // Generate temporary ID
        };
        setInventoryItems(prev => [...prev, newItem]);
        toast({
          title: "Inventory item added",
          description: `${data.name} has been added successfully.`,
        });
      }
      
      setIsLoading(false);
      setOpenForm(false);
    }, 600);
  };

  const confirmDelete = () => {
    if (!selectedItem) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setInventoryItems(prev => 
        prev.filter(item => item.id !== selectedItem.id)
      );
      
      toast({
        title: "Inventory item deleted",
        description: `${selectedItem.name} has been deleted.`,
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
        data={inventoryItems}
        onAddNew={handleAddNew}
        addButtonText="Add Inventory Item"
        searchPlaceholder="Search inventory..."
        enableImportExport={true}
      />

      <InventoryItemForm
        open={openForm}
        onOpenChange={setOpenForm}
        onSubmit={handleSubmit}
        initialData={selectedItem || undefined}
        isLoading={isLoading}
      />

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the inventory item
              {selectedItem && <Badge variant="outline" className="ml-1">{selectedItem.name}</Badge>}.
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

export default InventoryManagement;
