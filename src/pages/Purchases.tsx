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
        /* For real implementation:
        const { data, error } = await supabase.from('system_health').select('ping');
        if (error) throw error;
        
        console.log('Database connection verified');
        */

        // Since we don't have an actual table, just simulate connection
        console.log('Database connection simulated');
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
          
          {/* Fix the forceMount property to use conditional rendering */}
          <div className={activeTab === 'vendors' ? '' : 'hidden'}>
            <TabsContent value="vendors" forceMount className="mt-6">
              <VendorManagement />
            </TabsContent>
          </div>
          
          <div className={activeTab === 'raw-materials' ? '' : 'hidden'}>
            <TabsContent value="raw-materials" forceMount className="mt-6">
              <RawMaterialsManagement />
            </TabsContent>
          </div>
          
          <div className={activeTab === 'stock-purchases' ? '' : 'hidden'}>
            <TabsContent value="stock-purchases" forceMount className="mt-6">
              <StockPurchasesManagement />
            </TabsContent>
          </div>
          
          <div className={activeTab === 'stock-status' ? '' : 'hidden'}>
            <TabsContent value="stock-status" forceMount className="mt-6">
              <StockStatusView />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Purchases;
