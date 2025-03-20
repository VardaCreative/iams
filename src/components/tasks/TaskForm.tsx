
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FormDialog from "@/components/common/FormDialog";
import { Task } from './TaskManagement';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Save, X } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { fetchProcesses, saveProcesses } from '@/lib/database';

// Define interfaces for dropdown data
interface RawMaterial {
  id: string;
  name: string;
}

interface StaffMember {
  id: string;
  name: string;
}

interface Process {
  id?: string;
  name: string;
  sort_order: number;
}

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Task) => void;
  initialData?: Task;
  isLoading?: boolean;
}

const TaskForm = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData,
  isLoading = false
}: TaskFormProps) => {
  const [formData, setFormData] = useState<Task>({
    id: '',
    taskId: '',
    description: '',
    dateAssigned: new Date(),
    rmAssigned: '',
    processAssigned: '',
    qtyAssigned: 0,
    staffName: '',
    status: 'pending',
    ...initialData
  });

  // State for dropdown options
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for managing processes
  const [processes, setProcesses] = useState<Process[]>([]);
  const [isEditingProcesses, setIsEditingProcesses] = useState(false);
  const [newProcess, setNewProcess] = useState('');
  const [editProcessIndex, setEditProcessIndex] = useState<number | null>(null);

  // Fetch data for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch raw materials from the database
        const { data: materialsData, error: materialsError } = await supabase
          .from('raw_materials')
          .select('id, name')
          .eq('status', 'active')
          .order('name');
          
        if (materialsError) throw materialsError;
        setRawMaterials(materialsData || []);
        
        // Fetch staff members from the database
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('id, name')
          .eq('status', 'active')
          .order('name');
          
        if (staffError) throw staffError;
        setStaffMembers(staffData || []);
        
        // Fetch processes from the database
        const processData = await fetchProcesses();
        if (processData && processData.length > 0) {
          setProcesses(processData);
        }
        
      } catch (error) {
        console.error('Error fetching form data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'dateAssigned' || name === 'dateCompleted') {
      setFormData(prev => ({ ...prev, [name]: value ? new Date(value) : undefined }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? undefined : Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Process management functions
  const toggleProcessEditing = () => {
    setIsEditingProcesses(!isEditingProcesses);
    setEditProcessIndex(null);
    setNewProcess('');
  };

  const addProcess = () => {
    if (newProcess.trim() && !processes.some(p => p.name === newProcess.trim())) {
      const newProcessItem: Process = {
        name: newProcess.trim(),
        sort_order: processes.length + 1
      };
      setProcesses([...processes, newProcessItem]);
      setNewProcess('');
    } else {
      toast({
        title: "Process already exists",
        description: "A process with this name already exists.",
        variant: "destructive"
      });
    }
  };

  const startEditProcess = (index: number) => {
    setEditProcessIndex(index);
    setNewProcess(processes[index].name);
  };

  const saveEditProcess = () => {
    if (editProcessIndex !== null && newProcess.trim() && !processes.some((p, i) => p.name === newProcess.trim() && i !== editProcessIndex)) {
      const updatedProcesses = [...processes];
      updatedProcesses[editProcessIndex] = {
        ...updatedProcesses[editProcessIndex],
        name: newProcess.trim()
      };
      setProcesses(updatedProcesses);
      setEditProcessIndex(null);
      setNewProcess('');
    } else {
      toast({
        title: "Invalid process name",
        description: "Process name must be unique and not empty.",
        variant: "destructive"
      });
    }
  };

  const deleteProcess = (index: number) => {
    const updatedProcesses = processes.filter((_, i) => i !== index);
    // Update sort_order after deletion
    const reorderedProcesses = updatedProcesses.map((process, i) => ({
      ...process,
      sort_order: i + 1
    }));
    setProcesses(reorderedProcesses);
  };

  const moveProcess = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === processes.length - 1)) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedProcesses = [...processes];
    [updatedProcesses[index], updatedProcesses[newIndex]] = 
    [updatedProcesses[newIndex], updatedProcesses[index]];
    
    // Update sort_order after reordering
    const reorderedProcesses = updatedProcesses.map((process, i) => ({
      ...process,
      sort_order: i + 1
    }));
    
    setProcesses(reorderedProcesses);
  };

  const saveProcesses = async () => {
    try {
      // Save processes to database
      const result = await saveProcesses(processes);
      
      if (result) {
        toast({
          title: "Processes saved",
          description: "Process list has been updated successfully"
        });
        
        setIsEditingProcesses(false);
      }
    } catch (error) {
      console.error('Error saving processes:', error);
      toast({
        title: "Failed to save processes",
        description: "There was an error saving the process list",
        variant: "destructive"
      });
    }
  };

  // Format date to YYYY-MM-DD for input
  const formatDateForInput = (date?: Date) => {
    return date ? date.toISOString().split('T')[0] : '';
  };

  const cancelEditProcess = () => {
    setEditProcessIndex(null);
    setNewProcess('');
  };

  return (
    <FormDialog
      title={initialData ? "Edit Task" : "Create New Task"}
      description="Assign or update a production task."
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      isLoading={isLoading || loading}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="dateAssigned">Date Assigned *</Label>
            <Input
              id="dateAssigned"
              name="dateAssigned"
              type="date"
              value={formatDateForInput(formData.dateAssigned)}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="rmAssigned">Raw Material *</Label>
            <select
              id="rmAssigned"
              name="rmAssigned"
              value={formData.rmAssigned}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Select Raw Material</option>
              {rawMaterials.map(material => (
                <option key={material.id} value={material.name}>{material.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="processAssigned">Process *</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={toggleProcessEditing}
                className="h-6 px-2"
              >
                {isEditingProcesses ? "Cancel" : "Manage"}
              </Button>
            </div>
            
            {isEditingProcesses ? (
              <div className="border rounded-md p-3 space-y-3">
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
                      <Button type="button" onClick={cancelEditProcess} size="sm" variant="outline">
                        <X size={16} />
                      </Button>
                    </>
                  ) : (
                    <Button type="button" onClick={addProcess} size="sm" variant="outline">
                      <Plus size={16} />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {processes.map((process, index) => (
                    <div key={index} className="flex items-center gap-1">
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
                        disabled={index === processes.length - 1}
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
                
                <Button 
                  type="button" 
                  onClick={saveProcesses} 
                  className="w-full"
                  variant="outline"
                >
                  Save Process List
                </Button>
              </div>
            ) : (
              <select
                id="processAssigned"
                name="processAssigned"
                value={formData.processAssigned}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select Process</option>
                {processes.map(process => (
                  <option key={process.id || process.name} value={process.name}>
                    {process.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="qtyAssigned">Assigned Quantity *</Label>
            <Input
              id="qtyAssigned"
              name="qtyAssigned"
              type="number"
              step="0.01"
              value={formData.qtyAssigned}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="staffName">Assign Staff *</Label>
          <select
            id="staffName"
            name="staffName"
            value={formData.staffName}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="">Select Staff Member</option>
            {staffMembers.map(staff => (
              <option key={staff.id} value={staff.name}>{staff.name}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Task Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the task..."
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="dateCompleted">Date Completed</Label>
            <Input
              id="dateCompleted"
              name="dateCompleted"
              type="date"
              value={formatDateForInput(formData.dateCompleted)}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Status *</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="completedQty">Completed Quantity</Label>
            <Input
              id="completedQty"
              name="completedQty"
              type="number"
              step="0.01"
              value={formData.completedQty !== undefined ? formData.completedQty : ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="wastageQty">Wastage Quantity</Label>
            <Input
              id="wastageQty"
              name="wastageQty"
              type="number"
              step="0.01"
              value={formData.wastageQty !== undefined ? formData.wastageQty : ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            name="remarks"
            value={formData.remarks || ''}
            onChange={handleChange}
            placeholder="Any additional notes..."
            rows={2}
          />
        </div>
      </div>
    </FormDialog>
  );
};

export default TaskForm;
