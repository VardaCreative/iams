
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
        <Tabs 
          defaultValue="stock-status" 
          className="w-full" 
          onValueChange={handleTabChange} 
          value={activeTab}
        >
          <TabsList className="grid grid-cols-4 w-full max-w-3xl">
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="raw-materials">Raw Materials</TabsTrigger>
            <TabsTrigger value="stock-purchases">Stock Purchases</TabsTrigger>
            <TabsTrigger value="stock-status">Stock Status</TabsTrigger>
          </TabsList>
          
          {/* Make sure StockStatusView is mounted first */}
          <div className={activeTab !== 'stock-status' ? 'hidden' : ''}>
            <TabsContent value="stock-status" forceMount={true} className="mt-6">
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
