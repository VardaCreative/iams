
import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Sales = () => {
  return (
    <PageContainer
      title="Sales"
      description="Manage sales channels and inventory"
    >
      <div className="flex justify-between items-center">
        <Tabs defaultValue="channels" className="w-full">
          <TabsList>
            <TabsTrigger value="channels">Sales Channels</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="channels" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button size="sm">
                <Plus size={16} className="mr-2" />
                Add Sales Channel
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium text-muted-foreground">Coming Soon</h3>
                  <p className="text-sm text-muted-foreground mt-1">Sales channel management functionality will be available soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button size="sm">
                <Plus size={16} className="mr-2" />
                Add Inventory Item
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium text-muted-foreground">Coming Soon</h3>
                  <p className="text-sm text-muted-foreground mt-1">Inventory management functionality will be available soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Sales;
