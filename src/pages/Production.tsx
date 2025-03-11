
import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Production = () => {
  return (
    <PageContainer
      title="Production"
      description="Manage production planning and processes"
    >
      <div className="flex justify-between items-center">
        <Tabs defaultValue="planner" className="w-full">
          <TabsList>
            <TabsTrigger value="planner">Production Planner</TabsTrigger>
            <TabsTrigger value="processes">Production Processes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="planner" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button size="sm">
                <Plus size={16} className="mr-2" />
                New Production Plan
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium text-muted-foreground">Coming Soon</h3>
                  <p className="text-sm text-muted-foreground mt-1">Production planning functionality will be available soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="processes" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button size="sm">
                <Plus size={16} className="mr-2" />
                Add Process
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium text-muted-foreground">Coming Soon</h3>
                  <p className="text-sm text-muted-foreground mt-1">Process management functionality will be available soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Production;
