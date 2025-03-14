
import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/data-table';
import StockPurchaseForm from './StockPurchaseForm';
import PurchaseDeleteDialog from './PurchaseDeleteDialog';
import { getPurchaseColumns } from './PurchaseTableColumns';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { fetchVendors, fetchRawMaterials, fetchStockPurchases, saveStockPurchase, deleteStockPurchase } from '@/lib/database';

export interface StockPurchase {
  id: string;
  purchaseDate: Date;
  vendorId: string;
  vendorName: string;
  purchaseOrder: string;
  invoice?: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  status: 'ordered' | 'received' | 'cancelled';
}

const StockPurchasesManagement = () => {
  const [purchases, setPurchases] = useState<StockPurchase[]>([]);
  const [vendors, setVendors] = useState<{id: string; name: string}[]>([]);
  const [materials, setMaterials] = useState<{id: string; name: string; unit: string; unitPrice: number}[]>([]);
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
        setVendors(vendorsData.map(v => ({ id: v.id, name: v.name })));
        
        // Fetch raw materials for dropdown
        const materialsData = await fetchRawMaterials();
        setMaterials(materialsData.map(m => ({ 
          id: m.id, 
          name: m.name, 
          unit: m.unit, 
          unitPrice: m.unitPrice 
        })));
        
        // Fetch stock purchases
        const purchasesData = await fetchStockPurchases();
        setPurchases(purchasesData.map(p => ({
          ...p,
          purchaseDate: new Date(p.purchase_date),
          vendorId: p.vendor_id || '',
          vendorName: p.vendor_name,
          purchaseOrder: p.purchase_order,
          invoice: p.invoice,
          materialId: p.material_id || '',
          materialName: p.material_name,
          quantity: p.quantity,
          unit: p.unit,
          unitPrice: p.unit_price,
          totalAmount: p.total_amount,
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
    setIsLoading(true);
    
    try {
      // Map frontend data structure to database structure
      const dbPurchase = {
        id: data.id,
        purchase_date: data.purchaseDate.toISOString().split('T')[0],
        vendor_id: data.vendorId,
        vendor_name: data.vendorName,
        purchase_order: data.purchaseOrder,
        invoice: data.invoice,
        material_id: data.materialId,
        material_name: data.materialName,
        quantity: data.quantity,
        unit: data.unit,
        unit_price: data.unitPrice,
        total_amount: data.totalAmount,
        status: data.status
      };
      
      const savedPurchase = await saveStockPurchase(dbPurchase);
      
      if (savedPurchase) {
        // Update stock if purchase is received or status changed
        const stockManager = window.stockManager;
        if (stockManager) {
          if (data.id && selectedPurchase) {
            // If status changed from something else to 'received', increase stock
            if (selectedPurchase.status !== 'received' && data.status === 'received') {
              stockManager.updateStock(
                data.materialId, 
                data.quantity, 
                true, 
                data.purchaseDate
              );
            } 
            // If status changed from 'received' to something else, decrease stock
            else if (selectedPurchase.status === 'received' && data.status !== 'received') {
              stockManager.updateStock(
                selectedPurchase.materialId, 
                selectedPurchase.quantity, 
                false
              );
            } 
            // If status remains 'received' but quantity changed
            else if (selectedPurchase.status === 'received' && data.status === 'received' && 
              selectedPurchase.quantity !== data.quantity) {
              // First remove old quantity
              stockManager.updateStock(
                selectedPurchase.materialId, 
                selectedPurchase.quantity, 
                false
              );
              // Then add new quantity
              stockManager.updateStock(
                data.materialId, 
                data.quantity, 
                true, 
                data.purchaseDate
              );
            }
          } else if (data.status === 'received') {
            // New purchase marked as received
            stockManager.updateStock(
              data.materialId,
              data.quantity,
              true,
              data.purchaseDate
            );
          }
        }
        
        setRefreshTrigger(prev => prev + 1);
        setOpenForm(false);
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
      const success = await deleteStockPurchase(selectedPurchase.id);
      
      if (success) {
        // If deleting a received purchase, remove it from stock
        if (selectedPurchase.status === 'received' && window.stockManager) {
          window.stockManager.updateStock(
            selectedPurchase.materialId,
            selectedPurchase.quantity,
            false
          );
        }
        
        setRefreshTrigger(prev => prev + 1);
        setOpenDeleteDialog(false);
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
