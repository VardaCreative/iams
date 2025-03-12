
export interface StockItem {
  id: string;
  code: string;
  name: string;
  category: string;
  currentStock: number;
  minStockLevel: number;
  unit: string;
  lastPurchaseDate: Date | null;
  status: 'normal' | 'low' | 'critical';
}

// Add type declaration for the global window.stockManager
declare global {
  interface Window {
    stockManager?: {
      items: StockItem[];
      updateStock: (materialId: string, quantity: number, isAddition: boolean, purchaseDate?: Date) => void;
      getStockItems: () => StockItem[];
    };
  }
}
