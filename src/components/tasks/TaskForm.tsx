import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-toastify';

interface Process {
  id?: string;
  name: string;
  sort_order: number;
}

interface RawMaterial {
  id: string;
  name: string;
}

interface StaffMember {
  id: string;
  name: string;
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
      const updatedProcesses = [...processes, { name: newProcess.trim(), sort_order: processes.length + 1 }];
      setProcesses(updatedProcesses);
      setNewProcess('');
    } else {
      toast({
        title: "Invalid process name",
        description: "Process name must be unique and not empty.",
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

  // Function to save processes to the database
  const saveProcesses = async () => {
    try {
      // Save processes to database
      const { data, error } = await supabase
        .from('processes')
        .upsert(
          processes.map(process => ({
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
      
      setIsEditingProcesses(false);
      return true;
    } catch (error) {
      console.error('Error saving processes:', error);
      toast({
        title: "Failed to save processes",
        description: "There was an error saving the process list",
        variant: "destructive"
      });
      return false;
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
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Task Description"
          required
        />
        <input
          type="date"
          name="dateAssigned"
          value={formatDateForInput(formData.dateAssigned)}
          onChange={handleChange}
          required
        />
        <select name="rmAssigned" value={formData.rmAssigned} onChange={handleChange} required>
          <option value="" disabled>Select Raw Material</option>
          {rawMaterials.map(material => (
            <option key={material.id} value={material.name}>{material.name}</option>
          ))}
        </select>
        <select name="processAssigned" value={formData.processAssigned} onChange={handleChange} required>
          <option value="" disabled>Select Process</option>
          {processes.map(process => (
            <option key={process.id} value={process.name}>{process.name}</option>
          ))}
        </select>
        <input
          type="number"
          name="qtyAssigned"
          value={formData.qtyAssigned}
          onChange={handleChange}
          placeholder="Quantity Assigned"
          required
        />
        <select name="staffName" value={formData.staffName} onChange={handleChange} required>
          <option value="" disabled>Select Staff</option>
          {staffMembers.map(staff => (
            <option key={staff.id} value={staff.name}>{staff.name}</option>
          ))}
        </select>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          placeholder="Remarks"
        />
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      {/* Add process management UI here */}
    </FormDialog>
  );
};

export default TaskForm;
