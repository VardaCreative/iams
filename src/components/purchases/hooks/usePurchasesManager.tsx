
import { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { StockPurchase } from '../StockPurchasesManagement';

export function usePurchasesManager() {
  const [purchases, setPurchases] = useState<StockPurchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const initialPurchases: StockPurchase[] = [
    {
      id: '1',
      purchase_date: new Date('2025-03-01'),
      vendor_id: 'v1',
      vendor_name: 'Spice World',
      purchase_order: 'PO-001',
      invoice: 'INV-2025-001',
      material_id: 'm1',
      material_name: 'Turmeric Powder',
      quantity: 50,
      unit: 'kg',
      unit_price: 120,
      total_amount: 6000,
      status: 'received'
    },
    {
      id: '2',
      purchase_date: new Date('2025-03-05'),
      vendor_id: 'v2',
      vendor_name: 'Organic Farms Inc.',
      purchase_order: 'PO-002',
      material_id: 'm2',
      material_name: 'Red Chilli',
      quantity: 30,
      unit: 'kg',
      unit_price: 200,
      total_amount: 6000,
      status: 'ordered'
    }
  ];
  
  // Load purchases on mount
  useEffect(() => {
    const fetchPurchases = async () => {
      setIsLoading(true);
      try {
        // Fetch from database
        const { data, error } = await supabase
          .from('stock_purchases')
          .select('*')
          .order('purchase_date', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        // Transform data
        const transformedData = data.map(item => ({
          id: item.id,
          purchase_date: new Date(item.purchase_date),
          vendor_id: item.vendor_id || '',
          vendor_name: item.vendor_name,
          purchase_order: item.purchase_order,
          invoice: item.invoice,
          material_id: item.material_id || '',
          material_name: item.material_name,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          total_amount: item.total_amount,
          status: item.status as 'ordered' | 'received' | 'cancelled'
        }));
        
        setPurchases(transformedData);
        console.log('Loaded purchases:', transformedData);
      } catch (error) {
        console.error('Error fetching purchases:', error);
        // Fall back to demo data
        setPurchases(initialPurchases);
        
        toast({
          title: "Error loading purchases",
          description: "Could not load purchase data from the database. Using demo data instead.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPurchases();
  }, []);
  
  // Function to add a new purchase
  const addPurchase = async (purchase: Omit<StockPurchase, 'id'>) => {
    try {
      setIsLoading(true);
      
      // Prepare purchase for database
      const purchaseToSave = {
        purchase_date: purchase.purchase_date.toISOString().split('T')[0],
        vendor_id: purchase.vendor_id,
        vendor_name: purchase.vendor_name,
        purchase_order: purchase.purchase_order,
        invoice: purchase.invoice,
        material_id: purchase.material_id,
        material_name: purchase.material_name,
        quantity: purchase.quantity,
        unit: purchase.unit,
        unit_price: purchase.unit_price,
        total_amount: purchase.total_amount,
        status: purchase.status
      };
      
      // Insert into database
      const { data, error } = await supabase
        .from('stock_purchases')
        .insert(purchaseToSave)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Transform response for state
      const newPurchase: StockPurchase = {
        id: data.id,
        purchase_date: new Date(data.purchase_date),
        vendor_id: data.vendor_id || '',
        vendor_name: data.vendor_name,
        purchase_order: data.purchase_order,
        invoice: data.invoice,
        material_id: data.material_id || '',
        material_name: data.material_name,
        quantity: data.quantity,
        unit: data.unit,
        unit_price: data.unit_price,
        total_amount: data.total_amount,
        status: data.status as 'ordered' | 'received' | 'cancelled'
      };
      
      // Update the stock if purchase is received
      if (purchase.status === 'received' && window.stockManager) {
        window.stockManager.updateStock(
          purchase.material_id,
          purchase.quantity,
          true,
          purchase.purchase_date
        );
      }
      
      // Update state
      setPurchases(prev => [newPurchase, ...prev]);
      
      toast({
        title: "Purchase added",
        description: `Purchase order ${purchase.purchase_order} has been added successfully`,
      });
      
      return newPurchase;
    } catch (error) {
      console.error('Error adding purchase:', error);
      
      toast({
        title: "Failed to add purchase",
        description: "There was an error adding the purchase. Please try again.",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to update an existing purchase
  const updatePurchase = async (id: string, purchase: Omit<StockPurchase, 'id'>) => {
    try {
      setIsLoading(true);
      
      // First, get the old purchase data to handle stock adjustments
      const oldPurchase = purchases.find(p => p.id === id);
      if (!oldPurchase) {
        throw new Error('Purchase not found');
      }
      
      // Prepare purchase for database
      const purchaseToSave = {
        purchase_date: purchase.purchase_date.toISOString().split('T')[0],
        vendor_id: purchase.vendor_id,
        vendor_name: purchase.vendor_name,
        purchase_order: purchase.purchase_order,
        invoice: purchase.invoice,
        material_id: purchase.material_id,
        material_name: purchase.material_name,
        quantity: purchase.quantity,
        unit: purchase.unit,
        unit_price: purchase.unit_price,
        total_amount: purchase.total_amount,
        status: purchase.status
      };
      
      // Update in database
      const { data, error } = await supabase
        .from('stock_purchases')
        .update(purchaseToSave)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Transform response for state
      const updatedPurchase: StockPurchase = {
        id: data.id,
        purchase_date: new Date(data.purchase_date),
        vendor_id: data.vendor_id || '',
        vendor_name: data.vendor_name,
        purchase_order: data.purchase_order,
        invoice: data.invoice,
        material_id: data.material_id || '',
        material_name: data.material_name,
        quantity: data.quantity,
        unit: data.unit,
        unit_price: data.unit_price,
        total_amount: data.total_amount,
        status: data.status as 'ordered' | 'received' | 'cancelled'
      };
      
      // Handle stock adjustments
      if (window.stockManager) {
        // If status changed from ordered/cancelled to received, add to stock
        if (oldPurchase.status !== 'received' && purchase.status === 'received') {
          window.stockManager.updateStock(
            purchase.material_id, 
            purchase.quantity, 
            true, 
            purchase.purchase_date
          );
        } 
        // If status changed from received to ordered/cancelled, remove from stock
        else if (oldPurchase.status === 'received' && purchase.status !== 'received') {
          window.stockManager.updateStock(
            oldPurchase.material_id, 
            oldPurchase.quantity, 
            false
          );
        } 
        // If status remains 'received' but quantity/material changed
        else if (oldPurchase.status === 'received' && purchase.status === 'received' && 
                (oldPurchase.quantity !== purchase.quantity || 
                 oldPurchase.material_id !== purchase.material_id)) {
          // First remove old quantity
          window.stockManager.updateStock(
            oldPurchase.material_id, 
            oldPurchase.quantity, 
            false
          );
          // Then add new quantity
          window.stockManager.updateStock(
            purchase.material_id, 
            purchase.quantity, 
            true, 
            purchase.purchase_date
          );
        }
      }
      
      // Update state
      setPurchases(prev => prev.map(p => 
        p.id === id ? updatedPurchase : p
      ));
      
      toast({
        title: "Purchase updated",
        description: `Purchase order ${purchase.purchase_order} has been updated`,
      });
      
      return updatedPurchase;
    } catch (error) {
      console.error('Error updating purchase:', error);
      
      toast({
        title: "Failed to update purchase",
        description: "There was an error updating the purchase. Please try again.",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to delete a purchase
  const deletePurchase = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Find the purchase before deletion to handle stock adjustments
      const purchaseToDelete = purchases.find(p => p.id === id);
      if (!purchaseToDelete) {
        throw new Error('Purchase not found');
      }
      
      // Delete from database
      const { error } = await supabase
        .from('stock_purchases')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // If the purchase was 'received', remove it from stock
      if (purchaseToDelete.status === 'received' && window.stockManager) {
        window.stockManager.updateStock(
          purchaseToDelete.material_id,
          purchaseToDelete.quantity,
          false
        );
      }
      
      // Update state
      setPurchases(prev => prev.filter(p => p.id !== id));
      
      toast({
        title: "Purchase deleted",
        description: `Purchase order ${purchaseToDelete.purchase_order} has been deleted`,
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting purchase:', error);
      
      toast({
        title: "Failed to delete purchase",
        description: "There was an error deleting the purchase. Please try again.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    purchases,
    isLoading,
    addPurchase,
    updatePurchase,
    deletePurchase
  };
}
