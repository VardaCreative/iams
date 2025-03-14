import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VendorManagement from '@/components/purchases/VendorManagement';
import RawMaterialsManagement from '@/components/purchases/RawMaterialsManagement';
import StockPurchasesManagement from '@/components/purchases/StockPurchasesManagement';
import StockStatusView from '@/components/purchases/StockStatusView';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

const Purchases = () => {
  // Keep track of the active tab to handle component mounting order
  const [activeTab, setActiveTab] = useState('stock-status');
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  useEffect(() => {
    // Check if database connection works - this is a good place to verify connectivity
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('vendors').select('count');
        if (error) throw error;
        
        console.log('Database connection verified');
        
      } catch (error) {
        console.error('Database connection error:', error);
        toast({
          title: "Database connection issue",
          description: "Unable to connect to the database. Some features may not work properly.",
          variant: "destructive",
        });
      } finally {
        setInitialLoadComplete(true);
      }
    };
    
    checkConnection();
  }, []);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Log transition for monitoring & debugging
    console.log(`Tab changed to: ${value}`);
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
          
          {/* Use conditional rendering instead of forceMount */}
          {activeTab === 'vendors' && (
            <TabsContent value="vendors" className="mt-6">
              <VendorManagement />
            </TabsContent>
          )}
          
          {activeTab === 'raw-materials' && (
            <TabsContent value="raw-materials" className="mt-6">
              <RawMaterialsManagement />
            </TabsContent>
          )}
          
          {activeTab === 'stock-purchases' && (
            <TabsContent value="stock-purchases" className="mt-6">
              <StockPurchasesManagement />
            </TabsContent>
          )}
          
          {activeTab === 'stock-status' && (
            <TabsContent value="stock-status" className="mt-6">
              <StockStatusView />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Purchases;
