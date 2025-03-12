
import { useState, useEffect } from 'react';
import { StockItem } from './types';

export const useStockManager = (initialStockItems: StockItem[]) => {
  const [stockItems, setStockItems] = useState<StockItem[]>(initialStockItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<StockItem[]>(stockItems);
  
  // Stats
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    criticalStock: 0
  });
  
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

  return { stockItems, filteredItems, searchTerm, stats, handleSearch };
};
