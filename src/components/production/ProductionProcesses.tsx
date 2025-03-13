
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const preProcesses = [
  { id: 'cleaning', name: 'Cleaning' },
  { id: 'cbd', name: 'CBD' },
  { id: 'seeds-cbd', name: 'Seeds CBD' },
  { id: 'rfr', name: 'RFR' },
  { id: 'roasting', name: 'Roasting' },
  { id: 'rtp', name: 'RTP' },
  { id: 'sample', name: 'Sample' },
];

const postProcesses = [
  { id: 'grinding', name: 'Grinding' },
  { id: 'packing', name: 'Packing' },
];

const ProductionProcesses = () => {
  const [activeTab, setActiveTab] = useState('pre-process');
  
  const handleAddProcess = () => {
    toast({
      title: "Feature in development",
      description: "Adding new processes will be available in the next update.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleAddProcess}>
          <Plus size={16} className="mr-2" />
          Add Process
        </Button>
      </div>
      
      <Tabs defaultValue="pre-process" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="pre-process">Pre-Process</TabsTrigger>
          <TabsTrigger value="post-process">Post-Process</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pre-process">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Pre-Process Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {preProcesses.map(process => (
                  <Card key={process.id} className="hover:bg-accent cursor-pointer transition-colors">
                    <CardContent className="p-4 flex items-center justify-center text-center h-20">
                      <span className="font-medium">{process.name}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="post-process">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Post-Process Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {postProcesses.map(process => (
                  <Card key={process.id} className="hover:bg-accent cursor-pointer transition-colors">
                    <CardContent className="p-4 flex items-center justify-center text-center h-20">
                      <span className="font-medium">{process.name}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductionProcesses;
