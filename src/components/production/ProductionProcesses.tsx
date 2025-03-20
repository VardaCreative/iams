
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Plus, Edit, Trash2, ArrowUp, ArrowDown, Save, X 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

interface Process {
  id?: string;
  name: string;
  sort_order: number;
}

const ProductionProcesses = () => {
  const [activeTab, setActiveTab] = useState('pre-process');
  const [preProcesses, setPreProcesses] = useState<Process[]>([]);
  const [prodProcesses, setProdProcesses] = useState<Process[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newProcess, setNewProcess] = useState('');
  const [editProcessIndex, setEditProcessIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch processes from database
  useEffect(() => {
    const fetchProcesses = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('processes')
          .select('*')
          .order('sort_order');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Filter pre-processes and production processes
          const preProcs = data.filter(p => p.name === 'Cleaning' || 
            p.name === 'C & D' || p.name === 'Roasting' || 
            p.name === 'RFP' || p.name === 'Sample');
            
          const prodProcs = data.filter(p => p.name === 'Grinding' || 
            p.name === 'Packing');
            
          setPreProcesses(preProcs);
          setProdProcesses(prodProcs);
        } else {
          // Set defaults if no data
          setPreProcesses([
            { id: 'cleaning', name: 'Cleaning', sort_order: 1 },
            { id: 'c-and-d', name: 'C & D', sort_order: 2 },
            { id: 'roasting', name: 'Roasting', sort_order: 3 },
            { id: 'rfp', name: 'RFP', sort_order: 4 },
            { id: 'sample', name: 'Sample', sort_order: 5 },
          ]);
          
          setProdProcesses([
            { id: 'grinding', name: 'Grinding', sort_order: 1 },
            { id: 'packing', name: 'Packing', sort_order: 2 },
          ]);
        }
      } catch (error) {
        console.error('Error fetching processes:', error);
        toast({
          title: "Failed to load processes",
          description: "There was an error loading the processes. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProcesses();
  }, []);
  
  const handleAddProcess = () => {
    setIsEditing(true);
    setEditProcessIndex(null);
    setNewProcess('');
  };
  
  const addProcess = () => {
    if (!newProcess.trim()) {
      toast({
        title: "Process name required",
        description: "Please enter a process name.",
        variant: "destructive",
      });
      return;
    }
    
    const currentProcesses = activeTab === 'pre-process' ? preProcesses : prodProcesses;
    if (currentProcesses.some(p => p.name === newProcess.trim())) {
      toast({
        title: "Process already exists",
        description: "A process with this name already exists.",
        variant: "destructive",
      });
      return;
    }
    
    const newItem: Process = {
      name: newProcess.trim(),
      sort_order: currentProcesses.length + 1
    };
    
    if (activeTab === 'pre-process') {
      setPreProcesses([...preProcesses, newItem]);
    } else {
      setProdProcesses([...prodProcesses, newItem]);
    }
    
    setNewProcess('');
    setEditProcessIndex(null);
  };
  
  const startEditProcess = (index: number) => {
    const process = activeTab === 'pre-process' 
      ? preProcesses[index] 
      : prodProcesses[index];
      
    setEditProcessIndex(index);
    setNewProcess(process.name);
  };
  
  const saveEditProcess = () => {
    if (!newProcess.trim()) return;
    
    if (editProcessIndex === null) return;
    
    if (activeTab === 'pre-process') {
      const updatedProcesses = [...preProcesses];
      updatedProcesses[editProcessIndex] = {
        ...updatedProcesses[editProcessIndex],
        name: newProcess.trim()
      };
      setPreProcesses(updatedProcesses);
    } else {
      const updatedProcesses = [...prodProcesses];
      updatedProcesses[editProcessIndex] = {
        ...updatedProcesses[editProcessIndex],
        name: newProcess.trim()
      };
      setProdProcesses(updatedProcesses);
    }
    
    setNewProcess('');
    setEditProcessIndex(null);
  };
  
  const deleteProcess = (index: number) => {
    if (activeTab === 'pre-process') {
      const filtered = preProcesses.filter((_, i) => i !== index);
      const reordered = filtered.map((p, i) => ({ ...p, sort_order: i + 1 }));
      setPreProcesses(reordered);
    } else {
      const filtered = prodProcesses.filter((_, i) => i !== index);
      const reordered = filtered.map((p, i) => ({ ...p, sort_order: i + 1 }));
      setProdProcesses(reordered);
    }
  };
  
  const moveProcess = (index: number, direction: 'up' | 'down') => {
    if (activeTab === 'pre-process') {
      const processes = [...preProcesses];
      if ((direction === 'up' && index === 0) || 
          (direction === 'down' && index === processes.length - 1)) {
        return;
      }
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [processes[index], processes[newIndex]] = [processes[newIndex], processes[index]];
      
      // Update sort_order
      const reordered = processes.map((p, i) => ({ ...p, sort_order: i + 1 }));
      setPreProcesses(reordered);
    } else {
      const processes = [...prodProcesses];
      if ((direction === 'up' && index === 0) || 
          (direction === 'down' && index === processes.length - 1)) {
        return;
      }
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [processes[index], processes[newIndex]] = [processes[newIndex], processes[index]];
      
      // Update sort_order
      const reordered = processes.map((p, i) => ({ ...p, sort_order: i + 1 }));
      setProdProcesses(reordered);
    }
  };
  
  const saveProcesses = async () => {
    setIsLoading(true);
    
    try {
      // Combine all processes with their respective types
      const allProcesses = [
        ...preProcesses.map(p => ({ ...p, type: 'pre-process' })),
        ...prodProcesses.map(p => ({ ...p, type: 'prod-process' }))
      ];
      
      // Save to database
      const { data, error } = await supabase
        .from('processes')
        .upsert(
          allProcesses.map(process => ({
            id: process.id,
            name: process.name,
            sort_order: process.sort_order
          }))
        );
        
      if (error) throw error;
      
      toast({
        title: "Processes saved",
        description: "Process list has been updated successfully"
      });
      
      setIsEditing(false);
      return true;
    } catch (error) {
      console.error('Error saving processes:', error);
      toast({
        title: "Failed to save processes",
        description: "There was an error saving the process list",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const cancelEdit = () => {
    setIsEditing(false);
    setEditProcessIndex(null);
    setNewProcess('');
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
          <TabsTrigger value="prod-process">Prod Process</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pre-process">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Pre-Process Steps</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing && (
                <div className="mb-4 space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newProcess}
                      onChange={(e) => setNewProcess(e.target.value)}
                      placeholder="New process name"
                      className="flex-1"
                    />
                    {editProcessIndex !== null ? (
                      <>
                        <Button type="button" onClick={saveEditProcess} size="sm" variant="outline">
                          <Save size={16} />
                        </Button>
                        <Button type="button" onClick={() => setEditProcessIndex(null)} size="sm" variant="outline">
                          <X size={16} />
                        </Button>
                      </>
                    ) : (
                      <Button type="button" onClick={addProcess} size="sm" variant="outline">
                        <Plus size={16} />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {preProcesses.map((process, index) => (
                      <div key={process.id || index} className="flex items-center gap-1">
                        <div className="flex-1 p-2 bg-secondary rounded text-sm">
                          {process.name}
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => moveProcess(index, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp size={14} />
                        </Button>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => moveProcess(index, 'down')}
                          disabled={index === preProcesses.length - 1}
                        >
                          <ArrowDown size={14} />
                        </Button>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => startEditProcess(index)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteProcess(index)}
                        >
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-2">
                    <Button 
                      type="button" 
                      onClick={cancelEdit} 
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="button" 
                      onClick={saveProcesses} 
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save Process List"}
                    </Button>
                  </div>
                </div>
              )}
              
              {!isEditing && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {preProcesses.map((process, index) => (
                    <Card key={process.id || index} className="hover:bg-accent cursor-pointer transition-colors">
                      <CardContent className="p-4 flex items-center justify-center text-center h-20">
                        <span className="font-medium">{process.name}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="prod-process">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Production Process Steps</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing && (
                <div className="mb-4 space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newProcess}
                      onChange={(e) => setNewProcess(e.target.value)}
                      placeholder="New process name"
                      className="flex-1"
                    />
                    {editProcessIndex !== null ? (
                      <>
                        <Button type="button" onClick={saveEditProcess} size="sm" variant="outline">
                          <Save size={16} />
                        </Button>
                        <Button type="button" onClick={() => setEditProcessIndex(null)} size="sm" variant="outline">
                          <X size={16} />
                        </Button>
                      </>
                    ) : (
                      <Button type="button" onClick={addProcess} size="sm" variant="outline">
                        <Plus size={16} />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {prodProcesses.map((process, index) => (
                      <div key={process.id || index} className="flex items-center gap-1">
                        <div className="flex-1 p-2 bg-secondary rounded text-sm">
                          {process.name}
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => moveProcess(index, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp size={14} />
                        </Button>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => moveProcess(index, 'down')}
                          disabled={index === prodProcesses.length - 1}
                        >
                          <ArrowDown size={14} />
                        </Button>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => startEditProcess(index)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteProcess(index)}
                        >
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-2">
                    <Button 
                      type="button" 
                      onClick={cancelEdit} 
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="button" 
                      onClick={saveProcesses} 
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save Process List"}
                    </Button>
                  </div>
                </div>
              )}
              
              {!isEditing && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {prodProcesses.map((process, index) => (
                    <Card key={process.id || index} className="hover:bg-accent cursor-pointer transition-colors">
                      <CardContent className="p-4 flex items-center justify-center text-center h-20">
                        <span className="font-medium">{process.name}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductionProcesses;
