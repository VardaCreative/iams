
import React from 'react';
import StockStatusStats from './StockStatusStats';
import StockStatusTable from './StockStatusTable';
import { useStockManager } from './useStockManager';
import { StockItem } from './types';

const StockStatusView = () => {
  // Initial sample data
  const initialStockItems: StockItem[] = [
    {
      id: '1',
      code: 'RM001',
      name: 'Red Chilli',
      category: 'Spices',
      currentStock: 250,
      minStockLevel: 50,
      unit: 'kg',
      lastPurchaseDate: new Date('2023-05-10'),
      status: 'normal'
    },
    {
      id: '2',
      code: 'RM002',
      name: 'Turmeric',
      category: 'Spices',
      currentStock: 20,
      minStockLevel: 30,
      unit: 'kg',
      lastPurchaseDate: new Date('2023-05-15'),
      status: 'low'
    },
    {
      id: '3',
      code: 'RM003',
      name: 'Black Pepper',
      category: 'Spices',
      currentStock: 5,
      minStockLevel: 20,
      unit: 'kg',
      lastPurchaseDate: new Date('2023-04-20'),
      status: 'critical'
    }
  ];
  
  const { filteredItems, searchTerm, stats, handleSearch } = useStockManager(initialStockItems);

  return (
    <div className="space-y-6">
      <StockStatusStats stats={stats} />
      <StockStatusTable 
        items={filteredItems}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
      />
    </div>
  );
};

export default StockStatusView;
