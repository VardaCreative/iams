
import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, FileText } from 'lucide-react';
import StockPurchaseForm, { StockPurchase } from './StockPurchaseForm';
import { toast } from "@/hooks/use-toast";
import { format } from 'date-fns';
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

const StockPurchasesManagement = () => {
  const [purchases, setPurchases] = useState<StockPurchase[]>([
    {
      id: '1',
      purchaseDate: new Date('2023-05-10'),
      vendorId: '1',
      vendorName: 'Spice Traders Ltd.',
      purchaseOrder: 'PO-2023-001',
      invoice: 'INV-ST-456',
      materialId: '1',
      materialName: 'Red Chilli',
      quantity: 500,
      unit: 'kg',
      unitPrice: 120,
      totalAmount: 60000,
      status: 'received'
    },
    {
      id: '2',
      purchaseDate: new Date('2023-05-15'),
      vendorId: '2',
      vendorName: 'Global Herbs & Spices',
      purchaseOrder: 'PO-2023-002',
      invoice: 'INV-GH-789',
      materialId: '2',
      materialName: 'Turmeric',
      quantity: 300,
      unit: 'kg',
      unitPrice: 180,
      totalAmount: 54000,
      status: 'ordered'
    }
  ]);
  
  const [vendors] = useState([
    { id: '1', name: 'Spice Traders Ltd.' },
    { id: '2', name: 'Global Herbs & Spices' }
  ]);
  
  const [materials] = useState([
    { id: '1', name: 'Red Chilli', unit: 'kg', unitPrice: 120 },
    { id: '2', name: 'Turmeric', unit: 'kg', unitPrice: 180 }
  ]);
  
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<StockPurchase | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Effect to handle initial stock updates for already received items
  useEffect(() => {
    const stockManager = window.stockManager;
    if (stockManager) {
      // Initialize any 'received' purchases that should already be affecting stock
      purchases.forEach(purchase => {
        // Only update if the purchase is already marked as received
        if (purchase.status === 'received') {
          stockManager.updateStock(
            purchase.materialId,
            purchase.quantity,
            true,
            purchase.purchaseDate
          );
        }
      });
    }
  }, []);

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  const columns = [
    { 
      header: "Date", 
      accessorKey: "purchaseDate",
      cell: (value: Date) => formatDate(value)
    },
    { header: "Vendor", accessorKey: "vendorName" },
    { 
      header: "PO / Invoice", 
      accessorKey: "id",
      cell: (value: string, row: StockPurchase) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <FileText size={14} className="mr-1 text-muted-foreground" />
            {row.purchaseOrder}
          </div>
          {row.invoice && (
            <div className="text-xs text-muted-foreground">{row.invoice}</div>
          )}
        </div>
      )
    },
    { header: "Material", accessorKey: "materialName" },
    { 
      header: "Quantity", 
      accessorKey: "quantity",
      cell: (value: number, row: StockPurchase) => `${value} ${row.unit.toUpperCase()}`
    },
    { 
      header: "Unit Price", 
      accessorKey: "unitPrice",
      cell: (value: number) => `₹${value.toFixed(2)}`
    },
    { 
      header: "Total Amount", 
      accessorKey: "totalAmount",
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

  const handleAddNew = () => {
    setSelectedPurchase(null);
    setOpenForm(true);
  };

  const handleEdit = (purchase: StockPurchase) => {
    setSelectedPurchase(purchase);
    setOpenForm(true);
  };

  const handleDelete = (purchase: StockPurchase) => {
    setSelectedPurchase(purchase);
    setOpenDeleteDialog(true);
  };

  const handleSubmit = (data: StockPurchase) => {
    setIsLoading(true);
    
    // Get vendor name
    const vendor = vendors.find(v => v.id === data.vendorId);
    const vendorName = vendor ? vendor.name : 'Unknown Vendor';
    
    // Get material details
    const material = materials.find(m => m.id === data.materialId);
    const materialName = material ? material.name : 'Unknown Material';
    const unit = material ? material.unit : 'unit';
    
    // Calculate total amount
    const totalAmount = data.quantity * data.unitPrice;
    
    // Create complete purchase object
    const purchaseData = {
      ...data,
      vendorName,
      materialName,
      unit,
      totalAmount
    };
    
    // Simulate API call
    setTimeout(() => {
      if (selectedPurchase) {
        // Update existing purchase
        setPurchases(prev => {
          const updatedPurchases = prev.map(purchase => {
            if (purchase.id === selectedPurchase.id) {
              // Check if status is changing from non-received to received
              const stockManager = window.stockManager;
              
              if (stockManager) {
                // If status changed from something else to 'received', increase stock
                if (purchase.status !== 'received' && purchaseData.status === 'received') {
                  stockManager.updateStock(
                    purchaseData.materialId, 
                    purchaseData.quantity, 
                    true, 
                    purchaseData.purchaseDate
                  );
                } 
                // If status changed from 'received' to something else, decrease stock
                else if (purchase.status === 'received' && purchaseData.status !== 'received') {
                  stockManager.updateStock(
                    purchase.materialId, 
                    purchase.quantity, 
                    false
                  );
                } 
                // If status remains 'received' but quantity changed
                else if (purchase.status === 'received' && purchaseData.status === 'received' && 
                  purchase.quantity !== purchaseData.quantity) {
                  // First remove old quantity
                  stockManager.updateStock(
                    purchase.materialId, 
                    purchase.quantity, 
                    false
                  );
                  // Then add new quantity
                  stockManager.updateStock(
                    purchaseData.materialId, 
                    purchaseData.quantity, 
                    true, 
                    purchaseData.purchaseDate
                  );
                }
              }
              
              return { ...purchaseData, id: selectedPurchase.id };
            }
            return purchase;
          });
          
          return updatedPurchases;
        });
        
        toast({
          title: "Purchase updated",
          description: `Purchase order ${purchaseData.purchaseOrder} has been updated.`,
        });
      } else {
        // Add new purchase
        const newPurchase = {
          ...purchaseData,
          id: Date.now().toString(), // Generate temporary ID
        };
        
        // Update stock if purchase is received
        if (newPurchase.status === 'received' && window.stockManager) {
          window.stockManager.updateStock(
            newPurchase.materialId,
            newPurchase.quantity,
            true,
            newPurchase.purchaseDate
          );
        }
        
        setPurchases(prev => [...prev, newPurchase]);
        
        toast({
          title: "Purchase added",
          description: `Purchase order ${purchaseData.purchaseOrder} has been added.`,
        });
      }
      
      setIsLoading(false);
      setOpenForm(false);
    }, 600);
  };

  const confirmDelete = () => {
    if (!selectedPurchase) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setPurchases(prev => 
        prev.filter(purchase => purchase.id !== selectedPurchase.id)
      );
      
      toast({
        title: "Purchase deleted",
        description: `Purchase order ${selectedPurchase.purchaseOrder} has been deleted.`,
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
        data={purchases}
        onAddNew={handleAddNew}
        addButtonText="Add Stock Purchase"
        searchPlaceholder="Search purchases..."
        enableImportExport={true}
      />

      <StockPurchaseForm
        open={openForm}
        onOpenChange={setOpenForm}
        onSubmit={handleSubmit}
        initialData={selectedPurchase || undefined}
        isLoading={isLoading}
        vendors={vendors}
        materials={materials}
      />

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete purchase order "{selectedPurchase?.purchaseOrder}".
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

export default StockPurchasesManagement;
