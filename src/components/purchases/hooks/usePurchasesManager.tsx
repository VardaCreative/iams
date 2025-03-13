
import { useState, useEffect } from 'react';
import { StockPurchase } from '../StockPurchaseForm';
import { toast } from "@/hooks/use-toast";

// Sample initial data - in a real app this would come from an API
const initialPurchases: StockPurchase[] = [
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
];

// Sample vendors and materials data - in a real app this would come from an API
export const vendors = [
  { id: '1', name: 'Spice Traders Ltd.' },
  { id: '2', name: 'Global Herbs & Spices' }
];

export const materials = [
  { id: '1', name: 'Red Chilli', unit: 'kg', unitPrice: 120 },
  { id: '2', name: 'Turmeric', unit: 'kg', unitPrice: 180 }
];

export const usePurchasesManager = () => {
  const [purchases, setPurchases] = useState<StockPurchase[]>(initialPurchases);
  const [selectedPurchase, setSelectedPurchase] = useState<StockPurchase | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
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
    
    console.log("Stock purchases initialized");
  }, []);
  
  // Effect to refresh data when needed
  useEffect(() => {
    // In a real app, would fetch from API
    console.log("Stock purchases refreshed");
  }, [refreshTrigger]);

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
      setRefreshTrigger(prev => prev + 1);
    }, 600);
  };

  const confirmDelete = () => {
    if (!selectedPurchase) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // If deleting a received purchase, remove it from stock
      if (selectedPurchase.status === 'received' && window.stockManager) {
        window.stockManager.updateStock(
          selectedPurchase.materialId,
          selectedPurchase.quantity,
          false
        );
      }
      
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
      setRefreshTrigger(prev => prev + 1);
    }, 600);
  };

  return {
    purchases,
    openForm,
    setOpenForm,
    openDeleteDialog,
    setOpenDeleteDialog,
    selectedPurchase,
    isLoading,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSubmit,
    confirmDelete
  };
};
