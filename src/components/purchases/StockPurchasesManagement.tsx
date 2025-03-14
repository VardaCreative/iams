
import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/data-table';
import StockPurchaseForm from './StockPurchaseForm';
import PurchaseDeleteDialog from './PurchaseDeleteDialog';
import { getPurchaseColumns } from './PurchaseTableColumns';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { fetchVendors, fetchRawMaterials, fetchStockPurchases, saveStockPurchase, deleteStockPurchase, updateStockStatusPurchases } from '@/lib/database';

export interface StockPurchase {
  id: string;
  purchase_date: Date;
  vendor_id: string;
  vendor_name: string;
  purchase_order: string;
  invoice?: string;
  material_id: string;
  material_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_amount: number;
  status: 'ordered' | 'received' | 'cancelled';
}

const StockPurchasesManagement = () => {
  const [purchases, setPurchases] = useState<StockPurchase[]>([]);
  const [vendors, setVendors] = useState<{id: string; name: string}[]>([]);
  const [materials, setMaterials] = useState<{id: string; name: string; unit: string; unit_price: number}[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<StockPurchase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Effect to fetch all necessary data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch vendors for dropdown
        const vendorsData = await fetchVendors();
        console.log('Fetched vendors for dropdown:', vendorsData);
        setVendors(vendorsData.map(v => ({ id: v.id, name: v.name })));
        
        // Fetch raw materials for dropdown
        const materialsData = await fetchRawMaterials();
        console.log('Fetched materials for dropdown:', materialsData);
        setMaterials(materialsData.map(m => ({ 
          id: m.id, 
          name: m.name, 
          unit: m.unit, 
          unit_price: m.unit_price || 0
        })));
        
        // Fetch stock purchases
        const purchasesData = await fetchStockPurchases();
        console.log('Fetched stock purchases:', purchasesData);
        setPurchases(purchasesData.map(p => ({
          ...p,
          purchase_date: new Date(p.purchase_date),
          vendor_id: p.vendor_id || '',
          vendor_name: p.vendor_name,
          purchase_order: p.purchase_order,
          invoice: p.invoice,
          material_id: p.material_id || '',
          material_name: p.material_name,
          quantity: p.quantity,
          unit: p.unit,
          unit_price: p.unit_price,
          total_amount: p.total_amount,
          status: p.status as 'ordered' | 'received' | 'cancelled'
        })));
        
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Failed to load data",
          description: "There was an error loading required data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Initialize stock manager for already received items
    const stockManager = window.stockManager;
    if (stockManager) {
      // This will be handled when purchases are loaded
      console.log("Stock manager initialized");
    }
  }, [refreshTrigger]);

  // Get columns for the DataTable
  const columns = getPurchaseColumns({ 
    handleEdit: (purchase) => {
      setSelectedPurchase(purchase);
      setOpenForm(true);
    }, 
    handleDelete: (purchase) => {
      setSelectedPurchase(purchase);
      setOpenDeleteDialog(true);
    }
  });

  const handleAddNew = () => {
    setSelectedPurchase(null);
    setOpenForm(true);
  };

  const handleSubmit = async (data: StockPurchase) => {
    console.log('Submitting purchase data:', data);
    setIsLoading(true);
    
    try {
      // Ensure purchase_date is formatted correctly for database
      const purchaseToSave = {
        ...data,
        purchase_date: data.purchase_date instanceof Date 
          ? data.purchase_date.toISOString().split('T')[0]
          : data.purchase_date
      };
      
      console.log('Purchase data to save:', purchaseToSave);
      const savedPurchase = await saveStockPurchase(purchaseToSave);
      
      if (savedPurchase) {
        // Update stock if purchase is received or status changed
        const stockManager = window.stockManager;
        if (stockManager) {
          if (data.id && selectedPurchase) {
            // If status changed from something else to 'received', increase stock
            if (selectedPurchase.status !== 'received' && data.status === 'received') {
              stockManager.updateStock(
                data.material_id, 
                data.quantity, 
                true, 
                data.purchase_date
              );
              
              // Update stock status purchases for the current month
              const purchaseDate = data.purchase_date instanceof Date ? data.purchase_date : new Date(data.purchase_date);
              await updateStockStatusPurchases(data.material_id, data.quantity, purchaseDate, true);
            } 
            // If status changed from 'received' to something else, decrease stock
            else if (selectedPurchase.status === 'received' && data.status !== 'received') {
              stockManager.updateStock(
                selectedPurchase.material_id, 
                selectedPurchase.quantity, 
                false
              );
              
              // Update stock status purchases for the current month (subtract)
              const purchaseDate = selectedPurchase.purchase_date instanceof Date ? 
                selectedPurchase.purchase_date : new Date(selectedPurchase.purchase_date);
              await updateStockStatusPurchases(selectedPurchase.material_id, selectedPurchase.quantity, purchaseDate, false);
            } 
            // If status remains 'received' but quantity changed
            else if (selectedPurchase.status === 'received' && data.status === 'received' && 
              selectedPurchase.quantity !== data.quantity) {
              // First remove old quantity
              stockManager.updateStock(
                selectedPurchase.material_id, 
                selectedPurchase.quantity, 
                false
              );
              
              // Then add new quantity
              stockManager.updateStock(
                data.material_id, 
                data.quantity, 
                true, 
                data.purchase_date
              );
              
              // Update stock status purchases (remove old, add new)
              const oldPurchaseDate = selectedPurchase.purchase_date instanceof Date ? 
                selectedPurchase.purchase_date : new Date(selectedPurchase.purchase_date);
              await updateStockStatusPurchases(selectedPurchase.material_id, selectedPurchase.quantity, oldPurchaseDate, false);
              
              const newPurchaseDate = data.purchase_date instanceof Date ? 
                data.purchase_date : new Date(data.purchase_date);
              await updateStockStatusPurchases(data.material_id, data.quantity, newPurchaseDate, true);
            }
          } else if (data.status === 'received') {
            // New purchase marked as received
            stockManager.updateStock(
              data.material_id,
              data.quantity,
              true,
              data.purchase_date
            );
            
            // Update stock status purchases for the current month
            const purchaseDate = data.purchase_date instanceof Date ? data.purchase_date : new Date(data.purchase_date);
            await updateStockStatusPurchases(data.material_id, data.quantity, purchaseDate, true);
          }
        }
        
        setRefreshTrigger(prev => prev + 1);
        setOpenForm(false);
        toast({
          title: "Stock purchase saved",
          description: `Purchase order ${data.purchase_order} has been saved successfully`,
        });
      }
    } catch (error) {
      console.error('Error saving purchase:', error);
      toast({
        title: "Failed to save stock purchase",
        description: "There was an error saving the stock purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedPurchase) return;
    
    setIsLoading(true);
    
    try {
      console.log('Deleting purchase:', selectedPurchase.id);
      const success = await deleteStockPurchase(selectedPurchase.id);
      
      if (success) {
        // If deleting a received purchase, remove it from stock
        if (selectedPurchase.status === 'received' && window.stockManager) {
          window.stockManager.updateStock(
            selectedPurchase.material_id,
            selectedPurchase.quantity,
            false
          );
          
          // Update stock status purchases for the current month (subtract)
          const purchaseDate = selectedPurchase.purchase_date instanceof Date ? 
            selectedPurchase.purchase_date : new Date(selectedPurchase.purchase_date);
          await updateStockStatusPurchases(selectedPurchase.material_id, selectedPurchase.quantity, purchaseDate, false);
        }
        
        setRefreshTrigger(prev => prev + 1);
        setOpenDeleteDialog(false);
        toast({
          title: "Stock purchase deleted",
          description: "Stock purchase has been deleted successfully",
        });
      }
    } catch (error) {
      console.error('Error deleting purchase:', error);
      toast({
        title: "Failed to delete stock purchase",
        description: "There was an error deleting the stock purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
        isLoading={isLoading}
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

      <PurchaseDeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        selectedPurchase={selectedPurchase}
        isLoading={isLoading}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default StockPurchasesManagement;
