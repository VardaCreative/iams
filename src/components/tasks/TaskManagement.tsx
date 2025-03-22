import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
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
          qtyAssigned: item.qty_assigned !== undefined ? Number(item.qty_assigned) : 0,
          staffName: item.staff_name || '',
          dateCompleted: item.date_completed ? new Date(item.date_completed) : undefined,
          completedQty: item.completed_qty !== undefined ? Number(item.completed_qty) : undefined,
          wastageQty: item.wastage_qty !== undefined ? Number(item.wastage_qty) : undefined,
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

      // Save the task to the database
      const savedTask = await saveTask(data);
      if (savedTask) {
        setRefreshTrigger(prev => prev + 1);
        setOpenForm(false);
        toast({
          title: "Task saved",
          description: "The task was saved successfully.",
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

  return (
    <div>
      <h1>Task Management</h1>
      <button onClick={handleAddNew}>Add New Task</button>
      {isLoading ? (
        <p>Loading tasks...</p>
      ) : tasks.length > 0 ? (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              {task.description}
              <button onClick={() => handleEdit(task)}>Edit</button>
              <button onClick={() => handleDelete(task)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks available</p>
      )}
      <TaskForm
        open={openForm}
        onOpenChange={setOpenForm}
        onSubmit={handleSubmit}
        initialData={selectedTask || undefined}
        isLoading={isLoading}
      />
      {/* Add delete confirmation dialog here */}
    </div>
  );
};

export default TaskManagement;
