
import { SalesChannel } from '@/components/sales/SalesChannelForm';
import { InventoryItem } from '@/components/sales/InventoryItemForm';
import { Sale } from '@/components/sales/SaleForm';

// Sample Sales Channels
export const sampleSalesChannels: SalesChannel[] = [
  {
    id: '1',
    name: 'Amazon',
    description: 'Online marketplace',
    contactPerson: 'John Doe',
    email: 'john@amazon.com',
    phone: '123-456-7890'
  },
  {
    id: '2',
    name: 'Retail Store',
    description: 'Physical retail locations',
    contactPerson: 'Jane Smith',
    email: 'jane@retailstore.com',
    phone: '987-654-3210'
  },
  {
    id: '3',
    name: 'Wholesale',
    description: 'Bulk sales to distributors',
    contactPerson: 'Mike Johnson',
    email: 'mike@wholesale.com',
    phone: '555-123-4567'
  }
];

// Sample Inventory Items
export const sampleInventoryItems: InventoryItem[] = [
  {
    id: '1',
    sku: 'SAM250',
    name: 'Sambar Powder 250g',
    category: 'Blended Spices',
    unitPrice: 125,
    quantity: 100,
    minimumStock: 20
  },
  {
    id: '2',
    sku: 'SAM500',
    name: 'Sambar Powder 500g',
    category: 'Blended Spices',
    unitPrice: 230,
    quantity: 75,
    minimumStock: 15
  },
  {
    id: '3',
    sku: 'CHL100',
    name: 'Chilli Powder 100g',
    category: 'Pure Spices',
    unitPrice: 60,
    quantity: 150,
    minimumStock: 30
  },
  {
    id: '4',
    sku: 'TUR250',
    name: 'Turmeric Powder 250g',
    category: 'Pure Spices',
    unitPrice: 85,
    quantity: 120,
    minimumStock: 25
  },
  {
    id: '5',
    sku: 'COR100',
    name: 'Coriander Powder 100g',
    category: 'Pure Spices',
    unitPrice: 45,
    quantity: 90,
    minimumStock: 20
  },
  {
    id: '6',
    sku: 'BRY500',
    name: 'Biryani Masala 500g',
    category: 'Blended Spices',
    unitPrice: 250,
    quantity: 10,
    minimumStock: 15
  }
];

// Sample Sales Data
export const sampleSales: Sale[] = [
  {
    id: '1',
    date: new Date('2023-05-15'),
    salesChannel: '1',
    product: '1',
    quantity: 10,
    unitPrice: 125,
    orderNo: 'ORD-001',
    invoiceNo: 'INV-001',
    totalAmount: 1250
  },
  {
    id: '2',
    date: new Date('2023-05-18'),
    salesChannel: '2',
    product: '3',
    quantity: 15,
    unitPrice: 60,
    orderNo: 'ORD-002',
    invoiceNo: 'INV-002',
    totalAmount: 900
  },
  {
    id: '3',
    date: new Date('2023-05-20'),
    salesChannel: '3',
    product: '2',
    quantity: 25,
    unitPrice: 230,
    orderNo: 'ORD-003',
    invoiceNo: 'INV-003',
    totalAmount: 5750
  },
  {
    id: '4',
    date: new Date('2023-05-22'),
    salesChannel: '1',
    product: '4',
    quantity: 8,
    unitPrice: 85,
    orderNo: 'ORD-004',
    invoiceNo: 'INV-004',
    totalAmount: 680
  },
  {
    id: '5',
    date: new Date('2023-05-25'),
    salesChannel: '2',
    product: '6',
    quantity: 5,
    unitPrice: 250,
    orderNo: 'ORD-005',
    invoiceNo: 'INV-005',
    totalAmount: 1250
  }
];
