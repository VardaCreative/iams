
import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VendorManagement from '@/components/purchases/VendorManagement';
import RawMaterialsManagement from '@/components/purchases/RawMaterialsManagement';
import StockPurchasesManagement from '@/components/purchases/StockPurchasesManagement';
import StockStatusView from '@/components/purchases/StockStatusView';

const Purchases = () => {
  return (
    <PageContainer
      title="Purchases"
      description="Manage vendors, raw materials, and stock purchases"
    >
      <div className="flex justify-between items-center">
        <Tabs defaultValue="vendors" className="w-full">
          <TabsList>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="raw-materials">Raw Materials</TabsTrigger>
            <TabsTrigger value="stock-purchases">Stock Purchases</TabsTrigger>
            <TabsTrigger value="stock-status">Stock Status</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vendors" className="mt-6">
            <VendorManagement />
          </TabsContent>
          
          <TabsContent value="raw-materials" className="mt-6">
            <RawMaterialsManagement />
          </TabsContent>
          
          <TabsContent value="stock-purchases" className="mt-6">
            <StockPurchasesManagement />
          </TabsContent>
          
          <TabsContent value="stock-status" className="mt-6">
            <StockStatusView />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Purchases;
