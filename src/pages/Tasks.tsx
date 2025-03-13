
import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload } from 'lucide-react';
import DataTable from '@/components/ui/data-table';
import StaffManagement from '@/components/tasks/StaffManagement';
import TaskManagement from '@/components/tasks/TaskManagement';

const Tasks = () => {
  const [activeTab, setActiveTab] = useState('staff');

  return (
    <PageContainer
      title="Tasks"
      description="Manage staff and assign production tasks"
    >
      <div className="flex justify-between items-center">
        <Tabs defaultValue="staff" className="w-full" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="staff">Staff Management</TabsTrigger>
            <TabsTrigger value="tasks">Task Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="staff" className="mt-6">
            <StaffManagement />
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-6">
            <TaskManagement />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Tasks;
