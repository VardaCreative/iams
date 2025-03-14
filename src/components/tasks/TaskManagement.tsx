
import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload, Edit, Trash2 } from 'lucide-react';
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
import { fetchTasks, saveTask, deleteTask, fetchRawMaterials } from '@/lib/database';

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
          taskId: item.task_id,
          description: item.description,
          dateAssigned: new Date(item.date_assigned),
          rmAssigned: item.rm_assigned,
          processAssigned: item.process_assigned,
          qtyAssigned: item.qty_assigned,
          staffName: item.staff_name,
          dateCompleted: item.date_completed ? new Date(item.date_completed) : undefined,
          completedQty: item.completed_qty,
          wastageQty: item.wastage_qty,
          remarks: item.remarks,
          status: item.status as 'pending' | 'in-progress' | 'completed'
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

  const columns = [
    { header: "Task ID", accessorKey: "taskId" },
    { header: "Date Assigned", 
      accessorKey: "dateAssigned",
      cell: (value: Date) => value.toLocaleDateString() 
    },
    { header: "RM Assigned", accessorKey: "rmAssigned" },
    { header: "Process", accessorKey: "processAssigned" },
    { header: "Assigned Qty", accessorKey: "qtyAssigned" },
    { header: "Staff Name", accessorKey: "staffName" },
    { 
      header: "Date Completed", 
      accessorKey: "dateCompleted",
      cell: (value: Date | undefined) => value ? value.toLocaleDateString() : '-'
    },
    { 
      header: "Completed Qty", 
      accessorKey: "completedQty",
      cell: (value: number | undefined) => value !== undefined ? value : '-'
    },
    { 
      header: "Wastage Qty", 
      accessorKey: "wastageQty",
      cell: (value: number | undefined) => value !== undefined ? value : '-'
    },
    { header: "Remarks", accessorKey: "remarks" },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: (value: string) => {
        if (value === 'completed') {
          return <div className="px-2 py-1 rounded-full text-xs font-medium w-fit bg-green-100 text-green-800">Completed</div>;
        }
        if (value === 'in-progress') {
          return <div className="px-2 py-1 rounded-full text-xs font-medium w-fit bg-blue-100 text-blue-800">In Progress</div>;
        }
        return <div className="px-2 py-1 rounded-full text-xs font-medium w-fit bg-amber-100 text-amber-800">Pending</div>;
      }
    },
    { 
      header: "Actions", 
      accessorKey: "id",
      cell: (value: string, row: Task) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
          >
            <Trash2 size={16} className="text-destructive" />
          </Button>
        </div>
      )
    }
  ];

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
         oldTask.status === 'pending');
      
      // Map frontend structure to database structure
      const dbTask = {
        id: data.id,
        task_id: data.taskId,
        description: data.description,
        date_assigned: data.dateAssigned instanceof Date 
          ? data.dateAssigned.toISOString().split('T')[0]
          : data.dateAssigned,
        rm_assigned: data.rmAssigned,
        process_assigned: data.processAssigned,
        qty_assigned: data.qtyAssigned,
        staff_name: data.staffName,
        date_completed: data.dateCompleted instanceof Date 
          ? data.dateCompleted.toISOString().split('T')[0]
          : data.dateCompleted,
        completed_qty: data.completedQty,
        wastage_qty: data.wastageQty,
        remarks: data.remarks,
        status: data.status
      };
      
      console.log('Task data to save:', dbTask);
      const savedTask = await saveTask(dbTask);
      
      if (savedTask) {
        // If this is a new in-progress/completed task or status changed from pending,
        // update the stock utilisation
        if (shouldUpdateUtilisation && materialData && window.stockManager?.updateUtilisation) {
          await window.stockManager.updateUtilisation(
            materialData.id,
            data.qtyAssigned
          );
          console.log(`Updated utilisation for ${data.rmAssigned}: ${data.qtyAssigned}`);
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
