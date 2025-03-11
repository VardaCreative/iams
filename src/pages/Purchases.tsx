
import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
            <div className="flex justify-end mb-4">
              <Button size="sm">
                <Plus size={16} className="mr-2" />
                Add Vendor
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium text-muted-foreground">Coming Soon</h3>
                  <p className="text-sm text-muted-foreground mt-1">Vendor management functionality will be available soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="raw-materials" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button size="sm">
                <Plus size={16} className="mr-2" />
                Add Raw Material
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium text-muted-foreground">Coming Soon</h3>
                  <p className="text-sm text-muted-foreground mt-1">Raw material management functionality will be available soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stock-purchases" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button size="sm">
                <Plus size={16} className="mr-2" />
                Add Stock Purchase
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium text-muted-foreground">Coming Soon</h3>
                  <p className="text-sm text-muted-foreground mt-1">Stock purchase functionality will be available soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stock-status" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium text-muted-foreground">Coming Soon</h3>
                  <p className="text-sm text-muted-foreground mt-1">Stock status monitoring will be available soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Purchases;
