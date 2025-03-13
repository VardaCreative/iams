
import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SalesChannels from '@/components/sales/SalesChannels';
import InventoryManagement from '@/components/sales/InventoryManagement';
import SalesRecord from '@/components/sales/SalesRecord';
import InventoryStatus from '@/components/sales/InventoryStatus';

// Sample data
import { 
  sampleSalesChannels, 
  sampleInventoryItems,
  sampleSales
} from '@/data/salesData';

const Sales = () => {
  // State for data
  const [salesChannels, setSalesChannels] = useState(sampleSalesChannels);
  const [inventoryItems, setInventoryItems] = useState(sampleInventoryItems);
  const [sales, setSales] = useState(sampleSales);

  return (
    <PageContainer
      title="Sales"
      description="Manage sales channels, inventory, and track sales records"
    >
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="channels">Sales Channels</TabsTrigger>
          <TabsTrigger value="salesRecord">Sales Record</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="inventoryStatus">Inventory Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="channels" className="mt-6">
          <SalesChannels 
            salesChannels={salesChannels}
            setSalesChannels={setSalesChannels}
          />
        </TabsContent>
        
        <TabsContent value="salesRecord" className="mt-6">
          <SalesRecord 
            sales={sales}
            setSales={setSales}
            salesChannels={salesChannels}
            inventoryItems={inventoryItems}
          />
        </TabsContent>
        
        <TabsContent value="inventory" className="mt-6">
          <InventoryManagement 
            inventoryItems={inventoryItems}
            setInventoryItems={setInventoryItems}
          />
        </TabsContent>

        <TabsContent value="inventoryStatus" className="mt-6">
          <InventoryStatus 
            inventoryItems={inventoryItems}
            sales={sales}
          />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default Sales;
