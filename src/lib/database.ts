import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-toastify';

// Add this interface for the Task type from the database
interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_to: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  // Additional properties for custom task fields
  task_id?: string;
  date_assigned?: string;
  rm_assigned?: string;
  process_assigned?: string;
  qty_assigned?: number;
  staff_name?: string;
  date_completed?: string;
  completed_qty?: number;
  wastage_qty?: number;
  remarks?: string;
}

// Vendor operations
export const fetchVendors = async () => {
  try {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('name');
      
    if (error) throw error;
    console.log("Fetched vendors:", data);
    return data || [];
  } catch (error) {
    handleError(error, "Failed to fetch vendors");
    return [];
  }
};

// Raw Materials operations
export const fetchRawMaterials = async () => {
  try {
    const { data, error } = await supabase
      .from('raw_materials')
      .select('*')
      .order('name');
      
    if (error) throw error;
    console.log("Fetched raw materials:", data);
    return data || [];
  } catch (error) {
    handleError(error, "Failed to fetch raw materials");
    return [];
  }
};

// Task operations
export const fetchTasks = async () => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*');
      
    if (error) throw error;
    console.log("Fetched tasks:", data);
    return data || [];
  } catch (error) {
    handleError(error, "Failed to fetch tasks");
    return [];
  }
};

export const saveTask = async (task: Task) => {
  try {
    console.log("Saving task:", task);
    
    // Create a new UUID if this is a new task (empty ID)
    const taskToSave = { ...task };
    if (!taskToSave.id) {
      delete taskToSave.id; // Let Supabase generate the UUID
    }

    // Add default values for missing fields
    taskToSave.completed_qty = taskToSave.completed_qty ?? 0;
    taskToSave.wastage_qty = taskToSave.wastage_qty ?? 0;

    const { data, error } = await supabase
      .from('
