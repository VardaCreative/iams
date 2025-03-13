
import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductionPlanner from '@/components/production/ProductionPlanner';
import ProductionProcesses from '@/components/production/ProductionProcesses';
import ProductionStatus from '@/components/production/ProductionStatus';

const Production = () => {
  const [activeTab, setActiveTab] = useState('planner');

  return (
    <PageContainer
      title="Production"
      description="Manage production planning and processes"
    >
      <div className="flex justify-between items-center">
        <Tabs defaultValue="planner" className="w-full" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="planner">Production Planner</TabsTrigger>
            <TabsTrigger value="processes">Production Processes</TabsTrigger>
            <TabsTrigger value="status">Production Status</TabsTrigger>
          </TabsList>
          
          <TabsContent value="planner" className="mt-6">
            <ProductionPlanner />
          </TabsContent>
          
          <TabsContent value="processes" className="mt-6">
            <ProductionProcesses />
          </TabsContent>
          
          <TabsContent value="status" className="mt-6">
            <ProductionStatus />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Production;
