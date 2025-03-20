
import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TaskForm from './TaskForm';
import { supabase } from '@/integrations/supabase/client';
import { fetchTasks, saveTask, deleteTask } from '@/lib/database';
import { getTaskColumns } from './TaskColumns';

export interface Task {
  id: string;
  taskId: string;
  description: string;
  dateAssigned: Date;
  rmAssigned: string;
  processAssigned: string;
  qtyAssigned: number;
  staffName: string;
  dateCompleted?: Date;
  completedQty?: number;
  wastageQty?: number;
  remarks?: string;
  status: 'pending' | 'in-progress' | 'completed';
}

const TaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Effect to ensure data is loaded/refreshed
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTasks();
        console.log('Fetched tasks data:', data);
        
        // Map database structure to frontend structure
        const mappedData = data.map(item => ({
          id: item.id,
          taskId: item.task_id || `TASK${item.id.slice(0, 4)}`,
          description: item.description || '',
          dateAssigned: item.date_assigned ? new Date(item.date_assigned) : new Date(item.created_at || Date.now()),
          rmAssigned: item.rm_assigned || '',
          processAssigned: item.process_assigned || '',
          qtyAssigned: item.qty_assigned !== undefined ? item.qty_assigned : 0,
          staffName: item.staff_name || '',
          dateCompleted: item.date_completed ? new Date(item.date_completed) : undefined,
          completedQty: item.completed_qty,
          wastageQty: item.wastage_qty,
          remarks: item.remarks || '',
          status: (item.status as 'pending' | 'in-progress' | 'completed') || 'pending'
        }));
        
        setTasks(mappedData);
      } catch (error) {
        console.error('Error loading tasks:', error);
        toast({
          title: "Failed to load tasks",
          description: "There was an error loading tasks data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTasks();
    console.log("Task data refreshed");
  }, [refreshTrigger]);

  const handleAddNew = () => {
    setSelectedTask(null);
    setOpenForm(true);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setOpenForm(true);
  };

  const handleDelete = (task: Task) => {
    setSelectedTask(task);
    setOpenDeleteDialog(true);
  };

  const handleSubmit = async (data: Task) => {
    setIsLoading(true);
    
    try {
      console.log('Submitting task data:', data);
      
      // Generate a task ID if this is a new task
      if (!data.taskId) {
        data.taskId = `TASK${(tasks.length + 1).toString().padStart(3, '0')}`;
      }
      
      // Get the raw material ID for the assigned material
      const { data: materialData, error: materialError } = await supabase
        .from('raw_materials')
        .select('id, name')
        .eq('name', data.rmAssigned)
        .single();
        
      if (materialError) {
        console.error('Error finding material:', materialError);
      }
      
      // For new task or status change to in-progress/completed
      const isNewTask = !data.id;
      const oldTask = tasks.find(t => t.id === data.id);
      const statusChanged = oldTask && oldTask.status !== data.status;
      
      // Check if we need to update utilisation
      const shouldUpdateUtilisation = 
        (isNewTask && (data.status === 'in-progress' || data.status === 'completed')) || 
        (statusChanged && (data.status === 'in-progress' || data.status === 'completed') && 
         oldTask?.status === 'pending');
      
      // Format decimal values to ensure proper storage
      const formattedTask = {
        ...data,
        qtyAssigned: parseFloat(data.qtyAssigned.toString()),
        completedQty: data.completedQty !== undefined ? parseFloat(data.completedQty.toString()) : undefined,
        wastageQty: data.wastageQty !== undefined ? parseFloat(data.wastageQty.toString()) : undefined
      };
      
      // Map frontend structure to database structure
      const dbTask = {
        id: formattedTask.id,
        task_id: formattedTask.taskId,
        description: formattedTask.description,
        date_assigned: formattedTask.dateAssigned instanceof Date 
          ? formattedTask.dateAssigned.toISOString().split('T')[0]
          : formattedTask.dateAssigned,
        rm_assigned: formattedTask.rmAssigned,
        process_assigned: formattedTask.processAssigned,
        qty_assigned: formattedTask.qtyAssigned,
        staff_name: formattedTask.staffName,
        date_completed: formattedTask.dateCompleted instanceof Date 
          ? formattedTask.dateCompleted.toISOString().split('T')[0]
          : formattedTask.dateCompleted,
        completed_qty: formattedTask.completedQty,
        wastage_qty: formattedTask.wastageQty,
        remarks: formattedTask.remarks,
        status: formattedTask.status,
        title: `${formattedTask.processAssigned} - ${formattedTask.rmAssigned}` // Required for the tasks table
      };
      
      console.log('Task data to save:', dbTask);
      const savedTask = await saveTask(dbTask);
      
      if (savedTask) {
        // If this is a new in-progress/completed task or status changed from pending,
        // update the stock utilisation
        if (shouldUpdateUtilisation && materialData && window.stockManager?.updateUtilisation) {
          await window.stockManager.updateUtilisation(
            materialData.id,
            formattedTask.qtyAssigned
          );
          console.log(`Updated utilisation for ${formattedTask.rmAssigned}: ${formattedTask.qtyAssigned}`);
        }
        
        setRefreshTrigger(prev => prev + 1);
        setOpenForm(false);
        toast({
          title: "Task saved",
          description: "Task has been saved successfully",
        });
      }
    } catch (error) {
      console.error('Error saving task:', error);
      toast({
        title: "Failed to save task",
        description: "There was an error saving the task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedTask) return;
    
    setIsLoading(true);
    
    try {
      console.log('Deleting task:', selectedTask.id);
      const success = await deleteTask(selectedTask.id);
      
      if (success) {
        setRefreshTrigger(prev => prev + 1);
        setOpenDeleteDialog(false);
        toast({
          title: "Task deleted",
          description: "Task has been deleted successfully",
        });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Failed to delete task",
        description: "There was an error deleting the task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get columns configuration from the separate component
  const columns = getTaskColumns(handleEdit, handleDelete);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload size={16} className="mr-2" />
            Import Tasks
          </Button>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Export Tasks
          </Button>
        </div>
        <Button size="sm" onClick={handleAddNew}>
          <Plus size={16} className="mr-2" />
          Add New Task
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={tasks}
        searchPlaceholder="Search tasks..."
        isLoading={isLoading}
      />

      <TaskForm
        open={openForm}
        onOpenChange={setOpenForm}
        onSubmit={handleSubmit}
        initialData={selectedTask || undefined}
        isLoading={isLoading}
      />

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete task "{selectedTask?.taskId}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskManagement;
