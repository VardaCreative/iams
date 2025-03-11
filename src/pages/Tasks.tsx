
import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Tasks = () => {
  return (
    <PageContainer
      title="Tasks"
      description="Manage staff and assign production tasks"
    >
      <div className="flex justify-between items-center">
        <Tabs defaultValue="staff" className="w-full">
          <TabsList>
            <TabsTrigger value="staff">Staff Management</TabsTrigger>
            <TabsTrigger value="tasks">Task Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="staff" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button size="sm">
                <Plus size={16} className="mr-2" />
                Add Staff Member
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium text-muted-foreground">Coming Soon</h3>
                  <p className="text-sm text-muted-foreground mt-1">Staff management functionality will be available soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button size="sm">
                <Plus size={16} className="mr-2" />
                Create Task
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium text-muted-foreground">Coming Soon</h3>
                  <p className="text-sm text-muted-foreground mt-1">Task management functionality will be available soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Tasks;
