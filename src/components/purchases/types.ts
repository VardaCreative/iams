
export interface StockItem {
  id: string;
  code: string;
  name: string;
  category: string;
  current_stock: number;
  min_stock_level: number;
  unit: string;
  last_purchase_date: Date | null;
  status: 'normal' | 'low' | 'critical';
}

export interface StockStatusItem {
  id: string;
  name: string;
  category: string;
  opening_bal: number;
  purchases: number;
  utilised: number;
  adj_plus: number;
  closing_bal: number;
  min_level: number;
  status: 'Normal' | 'Low Stock' | 'Out of Stock';
}

export interface StockPurchase {
  id: string;
  purchase_date: string | Date;
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

export interface Vendor {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
  status: 'active' | 'inactive';
}

// Add type declaration for the global window.stockManager
declare global {
  interface Window {
    stockManager?: {
      items: StockItem[];
      updateStock: (material_id: string, quantity: number, isAddition: boolean, purchase_date?: Date) => void;
      getStockItems: () => StockItem[];
      updateUtilisation?: (material_id: string, quantity: number) => void;
    };
  }
}
