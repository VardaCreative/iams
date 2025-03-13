
import { useState, useEffect } from 'react';
import { StockItem } from './types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

export const useStockManager = (initialStockItems: StockItem[]) => {
  const [stockItems, setStockItems] = useState<StockItem[]>(initialStockItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<StockItem[]>(stockItems);
  const [isLoading, setIsLoading] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    criticalStock: 0
  });
  
  // Load stock items from database
  useEffect(() => {
    // In a real implementation, you would fetch from Supabase:
    /*
    const fetchStockItems = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('raw_materials')
          .select('*');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Convert data to StockItem format and update stock status
          const stockItems = data.map(item => ({
            id: item.id,
            code: item.code,
            name: item.name,
            category: item.category,
            currentStock: item.current_stock,
            minStockLevel: item.min_stock_level,
            unit: item.unit,
            lastPurchaseDate: new Date(item.last_purchase_date),
            status: 'normal' // Will be updated by updateStockStatus
          }));
          
          const updatedItems = updateStockStatus(stockItems);
          setStockItems(updatedItems);
        }
      } catch (error) {
        console.error('Error fetching stock items:', error);
        toast({
          title: "Failed to load stock items",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStockItems();
    */

    // For now, just use the initial data and update status
    const updatedItems = updateStockStatus(initialStockItems);
    setStockItems(updatedItems);
  }, []);
  
  useEffect(() => {
    // Filter items based on search term
    const filtered = stockItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredItems(filtered);
    
    // Update stats
    setStats({
      totalItems: stockItems.length,
      lowStock: stockItems.filter(item => item.status === 'low').length,
      criticalStock: stockItems.filter(item => item.status === 'critical').length
    });
  }, [stockItems, searchTerm]);
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Update stock status based on current stock vs min stock level
  const updateStockStatus = (stockItems: StockItem[]): StockItem[] => {
    return stockItems.map(item => {
      let status: 'normal' | 'low' | 'critical' = 'normal';
      
      if (item.currentStock <= item.minStockLevel * 0.3) {
        status = 'critical';
      } else if (item.currentStock <= item.minStockLevel) {
        status = 'low';
      }
      
      return { ...item, status };
    });
  };

  // Function to manually update the stock
  const updateStockItem = async (
    itemId: string, 
    updates: Partial<Omit<StockItem, 'id' | 'code'>>
  ) => {
    setIsLoading(true);
    
    // Update local state first
    setStockItems(prev => {
      const updatedItems = prev.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, ...updates };
          
          // Automatically update status based on stock level
          if (updates.currentStock !== undefined || updates.minStockLevel !== undefined) {
            const currentStock = updates.currentStock ?? item.currentStock;
            const minLevel = updates.minStockLevel ?? item.minStockLevel;
            
            if (currentStock <= minLevel * 0.3) {
              updatedItem.status = 'critical';
            } else if (currentStock <= minLevel) {
              updatedItem.status = 'low';
            } else {
              updatedItem.status = 'normal';
            }
          }
          
          return updatedItem;
        }
        return item;
      });
      
      return updatedItems;
    });
    
    // In a real implementation, you would save to Supabase:
    /*
    try {
      const item = stockItems.find(item => item.id === itemId);
      if (!item) throw new Error('Item not found');
      
      const { error } = await supabase
        .from('raw_materials')
        .update({
          name: updates.name ?? item.name,
          category: updates.category ?? item.category,
          current_stock: updates.currentStock ?? item.currentStock,
          min_stock_level: updates.minStockLevel ?? item.minStockLevel,
          unit: updates.unit ?? item.unit,
          last_purchase_date: updates.lastPurchaseDate ?? item.lastPurchaseDate,
          status: updates.status ?? item.status
        })
        .eq('id', itemId);
        
      if (error) throw error;
      
      toast({
        title: "Stock updated",
        description: "Stock item has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating stock item:', error);
      toast({
        title: "Failed to update stock item",
        description: "Please try again later",
        variant: "destructive"
      });
      
      // Revert to previous state on error
      // ... code to revert state ...
    }
    */
    
    setTimeout(() => {
      toast({
        title: "Stock updated",
        description: "Stock item has been updated successfully",
      });
      setIsLoading(false);
    }, 500);
  };

  // Register stock manager globally for other components to use
  useEffect(() => {
    // Make the stock items and methods available globally
    window.stockManager = {
      items: stockItems,
      updateStock: (materialId: string, quantity: number, isAddition: boolean, purchaseDate?: Date) => {
        setStockItems(prevItems => {
          const updatedItems = prevItems.map(item => {
            if (item.id === materialId) {
              const newStock = isAddition 
                ? item.currentStock + quantity 
                : Math.max(0, item.currentStock - quantity);
                
              let newStatus: 'normal' | 'low' | 'critical' = 'normal';
              
              if (newStock <= item.minStockLevel * 0.3) {
                newStatus = 'critical';
              } else if (newStock <= item.minStockLevel) {
                newStatus = 'low';
              }
              
              return {
                ...item,
                currentStock: newStock,
                lastPurchaseDate: isAddition && purchaseDate ? purchaseDate : item.lastPurchaseDate,
                status: newStatus
              };
            }
            return item;
          });
          
          // In a real implementation, you would save to Supabase:
          /*
          const item = updatedItems.find(item => item.id === materialId);
          if (item) {
            supabase
              .from('raw_materials')
              .update({
                current_stock: item.currentStock,
                last_purchase_date: item.lastPurchaseDate,
                status: item.status
              })
              .eq('id', materialId)
              .then(({ error }) => {
                if (error) {
                  console.error('Error updating stock:', error);
                  toast({
                    title: "Error updating stock",
                    description: "Stock update failed to save to database",
                    variant: "destructive"
                  });
                }
              });
          }
          */
          
          return updatedItems;
        });
      },
      getStockItems: () => stockItems
    };
    
    // Clean up when component unmounts
    return () => {
      delete window.stockManager;
    };
  }, [stockItems]);

  return { 
    stockItems, 
    setStockItems,
    filteredItems, 
    searchTerm, 
    stats, 
    handleSearch,
    updateStockItem,
    updateStockStatus,
    isLoading
  };
};
