
import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VendorManagement from '@/components/purchases/VendorManagement';
import RawMaterialsManagement from '@/components/purchases/RawMaterialsManagement';
import StockPurchasesManagement from '@/components/purchases/StockPurchasesManagement';
import StockStatusView from '@/components/purchases/StockStatusView';

const Purchases = () => {
  // Keep track of the active tab to handle component mounting order
  const [activeTab, setActiveTab] = useState('stock-status');
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <PageContainer
      title="Purchases"
      description="Manage vendors, raw materials, and stock purchases"
    >
      <div className="flex justify-between items-center">
        <Tabs defaultValue="vendors" className="w-full" onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="raw-materials">Raw Materials</TabsTrigger>
            <TabsTrigger value="stock-purchases">Stock Purchases</TabsTrigger>
            <TabsTrigger value="stock-status">Stock Status</TabsTrigger>
          </TabsList>
          
          {/* We need to make sure StockStatusView is mounted first so stockManager is available */}
          {/* It's loaded regardless of the active tab, but only visible when selected */}
          <div className={activeTab !== 'stock-status' ? 'hidden' : ''}>
            <TabsContent value="stock-status" className="mt-6">
              <StockStatusView />
            </TabsContent>
          </div>
          
          <TabsContent value="vendors" className="mt-6">
            <VendorManagement />
          </TabsContent>
          
          <TabsContent value="raw-materials" className="mt-6">
            <RawMaterialsManagement />
          </TabsContent>
          
          <TabsContent value="stock-purchases" className="mt-6">
            <StockPurchasesManagement />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Purchases;
