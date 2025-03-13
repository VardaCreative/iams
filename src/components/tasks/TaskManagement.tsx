
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
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      taskId: 'TASK001',
      description: 'Process Red Chilli',
      dateAssigned: new Date('2023-06-15'),
      rmAssigned: 'Red Chilli',
      processAssigned: 'Grinding',
      qtyAssigned: 50,
      staffName: 'John Doe',
      dateCompleted: new Date('2023-06-18'),
      completedQty: 48,
      wastageQty: 2,
      remarks: 'Completed on time',
      status: 'completed'
    },
    {
      id: '2',
      taskId: 'TASK002',
      description: 'Process Turmeric',
      dateAssigned: new Date('2023-06-20'),
      rmAssigned: 'Turmeric',
      processAssigned: 'Cleaning',
      qtyAssigned: 30,
      staffName: 'Jane Smith',
      status: 'in-progress'
    }
  ]);
  
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Effect to ensure data is loaded/refreshed
  useEffect(() => {
    // In a real app, this would fetch data from an API
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

  const handleSubmit = (data: Task) => {
    setIsLoading(true);
    
    // Persist changes with simulated API call
    setTimeout(() => {
      if (selectedTask) {
        // Update existing task
        setTasks(prev => 
          prev.map(task => 
            task.id === selectedTask.id ? { ...data, id: selectedTask.id } : task
          )
        );
        toast({
          title: "Task updated",
          description: `Task ${data.taskId} has been updated successfully.`,
        });
      } else {
        // Add new task - ensure it has an ID
        const newTask: Task = {
          ...data,
          id: Date.now().toString(), // Generate temporary ID
          taskId: `TASK${(tasks.length + 1).toString().padStart(3, '0')}`
        };
        setTasks(prev => [...prev, newTask]);
        toast({
          title: "Task added",
          description: `Task ${newTask.taskId} has been added successfully.`,
        });
      }
      
      setIsLoading(false);
      setOpenForm(false);
      // Trigger refresh
      setRefreshTrigger(prev => prev + 1);
    }, 600);
  };

  const confirmDelete = () => {
    if (!selectedTask) return;
    
    setIsLoading(true);
    
    // Delete task
    setTimeout(() => {
      setTasks(prev => 
        prev.filter(task => task.id !== selectedTask.id)
      );
      
      toast({
        title: "Task deleted",
        description: `Task ${selectedTask.taskId} has been deleted.`,
        variant: "destructive",
      });
      
      setIsLoading(false);
      setOpenDeleteDialog(false);
      // Trigger refresh
      setRefreshTrigger(prev => prev + 1);
    }, 600);
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
