
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InventoryItem } from './InventoryItemForm';
import { Sale } from './SaleForm';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowRightLeft, AlertTriangle } from "lucide-react";
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InventoryStatusProps {
  inventoryItems: InventoryItem[];
  sales: Sale[];
}

const InventoryStatus = ({ inventoryItems, sales }: InventoryStatusProps) => {
  const [statusDate, setStatusDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState<string>('all');
  
  // Calculate inventory status based on sales data
  const inventoryStatus = inventoryItems.map(item => {
    // Calculate total sales for this item
    const totalSold = sales.filter(sale => sale.product === item.id)
      .reduce((acc, sale) => acc + sale.quantity, 0);
    
    // Calculate remaining inventory
    const remaining = (item.quantity || 0) - totalSold;
    
    // Determine status
    let status = 'In Stock';
    if (remaining <= 0) {
      status = 'Out of Stock';
    } else if (remaining < (item.minimumStock || 0)) {
      status = 'Low Stock';
    }
    
    return {
      ...item,
      sold: totalSold,
      remaining,
      status
    };
  });
  
  // Filter inventory based on selection
  const filteredInventory = inventoryStatus.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'low' && item.status === 'Low Stock') return true;
    if (filter === 'out' && item.status === 'Out of Stock') return true;
    if (filter === 'in' && item.status === 'In Stock') return true;
    return false;
  });
  
  // Count items by status
  const outOfStockCount = inventoryStatus.filter(item => item.status === 'Out of Stock').length;
  const lowStockCount = inventoryStatus.filter(item => item.status === 'Low Stock').length;
  
  const columns = [
    { header: "SKU", accessorKey: "sku" },
    { header: "Product Name", accessorKey: "name" },
    { header: "Category", accessorKey: "category" },
    { header: "Initial Quantity", accessorKey: "quantity" },
    { header: "Sold", accessorKey: "sold" },
    { header: "Remaining", accessorKey: "remaining" },
    { header: "Min. Stock", accessorKey: "minimumStock" },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: (value: string) => {
        if (value === 'Out of Stock') {
          return <Badge variant="destructive">Out of Stock</Badge>;
        }
        if (value === 'Low Stock') {
          return <Badge variant="warning" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Low Stock</Badge>;
        }
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">In Stock</Badge>;
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Alerts Section */}
      {(outOfStockCount > 0 || lowStockCount > 0) && (
        <div className="space-y-3">
          {outOfStockCount > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Out of Stock Items</AlertTitle>
              <AlertDescription>
                {outOfStockCount} {outOfStockCount === 1 ? 'item is' : 'items are'} currently out of stock.
              </AlertDescription>
            </Alert>
          )}
          
          {lowStockCount > 0 && (
            <Alert variant="warning" className="border-amber-300 bg-amber-50 text-amber-800">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Low Stock Warning</AlertTitle>
              <AlertDescription>
                {lowStockCount} {lowStockCount === 1 ? 'item is' : 'items are'} below minimum stock levels.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
      
      {/* Status date and filter controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Inventory Status as of {new Date(statusDate).toLocaleDateString()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="grid w-full sm:w-auto gap-2">
              <Label htmlFor="statusDate">Status Date</Label>
              <Input
                id="statusDate"
                type="date"
                value={statusDate}
                onChange={(e) => setStatusDate(e.target.value)}
                className="w-full sm:w-auto"
              />
            </div>
            
            <div className="grid w-full sm:w-auto gap-2">
              <Label htmlFor="filter">Filter</Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Items" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="in">In Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowRightLeft size={16} className="mr-2" />
              Update Status
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Inventory Status Table */}
      <DataTable
        columns={columns}
        data={filteredInventory}
        searchPlaceholder="Search inventory..."
        enableImportExport={true}
      />
    </div>
  );
};

export default InventoryStatus;
