
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { StockPurchase, Vendor } from '@/components/purchases/types';

// Generic error handler
export const handleError = (error: any, customMessage = "Operation failed") => {
  console.error(error);
  toast({
    title: customMessage,
    description: error.message || "Please try again later",
    variant: "destructive",
  });
};

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
  // Additional properties the component expects
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

export const saveVendor = async (vendor: Vendor) => {
  try {
    console.log("Saving vendor:", vendor);
    
    // Create a new UUID if this is a new vendor (empty ID)
    const vendorToSave = { ...vendor };
    if (!vendorToSave.id) {
      delete vendorToSave.id; // Let Supabase generate the UUID
    }
    
    const { data, error } = await supabase
      .from('vendors')
      .upsert(vendorToSave)
      .select()
      .single();
      
    if (error) throw error;
    
    console.log("Vendor saved successfully:", data);
    return data;
  } catch (error) {
    handleError(error, "Failed to save vendor");
    return null;
  }
};

export const deleteVendor = async (id: string) => {
  try {
    console.log("Deleting vendor:", id);
    
    const { error } = await supabase
      .from('vendors')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    console.log("Vendor deleted successfully");
    return true;
  } catch (error) {
    handleError(error, "Failed to delete vendor");
    return false;
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

export const saveRawMaterial = async (material: any) => {
  try {
    console.log("Saving raw material:", material);
    
    // Create a new UUID if this is a new material (empty ID)
    const materialToSave = { ...material };
    if (!materialToSave.id) {
      delete materialToSave.id; // Let Supabase generate the UUID
    }
    
    // Add default unit_price if not provided
    if (materialToSave.unit_price === undefined) {
      materialToSave.unit_price = 0;
    }
    
    // Add default current_stock if not provided
    if (materialToSave.current_stock === undefined) {
      materialToSave.current_stock = 0;
    }
    
    const { data, error } = await supabase
      .from('raw_materials')
      .upsert(materialToSave)
      .select()
      .single();
      
    if (error) throw error;
    
    console.log("Raw material saved successfully:", data);
    return data;
  } catch (error) {
    handleError(error, "Failed to save raw material");
    return null;
  }
};

export const deleteRawMaterial = async (id: string) => {
  try {
    console.log("Deleting raw material:", id);
    
    const { error } = await supabase
      .from('raw_materials')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    console.log("Raw material deleted successfully");
    return true;
  } catch (error) {
    handleError(error, "Failed to delete raw material");
    return false;
  }
};

// Stock Purchases operations
export const fetchStockPurchases = async () => {
  try {
    const { data, error } = await supabase
      .from('stock_purchases')
      .select('*')
      .order('purchase_date', { ascending: false });
      
    if (error) throw error;
    console.log("Fetched stock purchases:", data);
    return data || [];
  } catch (error) {
    handleError(error, "Failed to fetch stock purchases");
    return [];
  }
};

export const saveStockPurchase = async (purchase: any) => {
  try {
    console.log("Saving stock purchase:", purchase);
    
    // Convert Date to ISO string format for storage
    const purchaseToSave = { 
      ...purchase,
      purchase_date: purchase.purchase_date instanceof Date
        ? purchase.purchase_date.toISOString().split('T')[0]
        : purchase.purchase_date
    };
    
    // Create a new UUID if this is a new purchase (empty ID)
    if (!purchaseToSave.id) {
      delete purchaseToSave.id; // Let Supabase generate the UUID
    }
    
    const { data, error } = await supabase
      .from('stock_purchases')
      .upsert(purchaseToSave)
      .select()
      .single();
      
    if (error) throw error;
    
    console.log("Stock purchase saved successfully:", data);
    return data;
  } catch (error) {
    handleError(error, "Failed to save stock purchase");
    return null;
  }
};

export const deleteStockPurchase = async (id: string) => {
  try {
    console.log("Deleting stock purchase:", id);
    
    const { error } = await supabase
      .from('stock_purchases')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    console.log("Stock purchase deleted successfully");
    return true;
  } catch (error) {
    handleError(error, "Failed to delete stock purchase");
    return false;
  }
};

// Stock Status operations
export const fetchStockStatus = async (date: string) => {
  try {
    console.log("Fetching stock status for date:", date);
    
    const { data, error } = await supabase
      .from('stock_status')
      .select('*')
      .eq('date', date)
      .order('name');
      
    if (error) throw error;
    
    console.log("Stock status fetched successfully:", data);
    return data || [];
  } catch (error) {
    handleError(error, "Failed to fetch stock status");
    return [];
  }
};

export const saveStockStatus = async (stockData: any[]) => {
  try {
    console.log("Saving stock status:", stockData);
    
    // Process each item individually to handle new and existing items
    const processedData = stockData.map(item => {
      // If new item (empty ID), let Supabase generate the UUID
      if (!item.id) {
        const { id, ...restItem } = item;
        return restItem;
      }
      return item;
    });
    
    const { data, error } = await supabase
      .from('stock_status')
      .upsert(processedData);
      
    if (error) throw error;
    
    console.log("Stock status saved successfully");
    return true;
  } catch (error) {
    handleError(error, "Failed to save stock status");
    return false;
  }
};

// Function to update stock status purchases field
export const updateStockStatusPurchases = async (material_id: string, quantity: number, purchase_date: Date, isAddition: boolean) => {
  try {
    // Format the date to YYYY-MM-DD
    const formattedDate = format(purchase_date, 'yyyy-MM-dd');
    
    // First, get the material name
    const { data: materialData, error: materialError } = await supabase
      .from('raw_materials')
      .select('name, category, min_stock_level')
      .eq('id', material_id)
      .single();
      
    if (materialError || !materialData) {
      console.error('Error getting material:', materialError);
      return false;
    }
    
    // Check if there's a stock status entry for this date and material
    const { data: stockStatusData, error: stockStatusError } = await supabase
      .from('stock_status')
      .select('*')
      .eq('date', formattedDate)
      .eq('name', materialData.name);
      
    if (stockStatusError) {
      console.error('Error checking stock status:', stockStatusError);
      return false;
    }
    
    if (stockStatusData && stockStatusData.length > 0) {
      // Update existing entry
      const item = stockStatusData[0];
      const newPurchases = isAddition 
        ? item.purchases + quantity 
        : Math.max(0, item.purchases - quantity);
      
      // Calculate new closing balance
      const closing_bal = item.opening_bal + newPurchases - item.utilised + item.adj_plus;
      
      // Determine status based on closing balance and minimum level
      let status: 'Normal' | 'Low Stock' | 'Out of Stock';
      if (closing_bal <= 0) {
        status = 'Out of Stock';
      } else if (closing_bal < item.min_level) {
        status = 'Low Stock';
      } else {
        status = 'Normal';
      }
      
      const { error: updateError } = await supabase
        .from('stock_status')
        .update({ 
          purchases: newPurchases,
          closing_bal,
          status
        })
        .eq('id', item.id);
        
      if (updateError) {
        console.error('Error updating stock status purchases:', updateError);
        return false;
      }
    } else {
      // Get the material's minimum stock level
      const min_level = materialData.min_stock_level || 0;
      
      // Create new entry with default values
      const newEntry = {
        date: formattedDate,
        name: materialData.name,
        category: materialData.category,
        opening_bal: 0,
        purchases: isAddition ? quantity : 0,
        utilised: 0,
        adj_plus: 0,
        closing_bal: isAddition ? quantity : 0,
        min_level,
        status: isAddition && quantity > 0 ? 'Normal' : 'Out of Stock'
      };
      
      const { error: insertError } = await supabase
        .from('stock_status')
        .insert(newEntry);
        
      if (insertError) {
        console.error('Error creating stock status entry:', insertError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating stock status purchases:', error);
    return false;
  }
};

// Function to update stock status utilisation field
export const updateStockStatusUtilisation = async (material_id: string, material_name: string, quantity: number) => {
  try {
    // Format today's date to YYYY-MM-DD
    const today = new Date();
    const formattedDate = format(today, 'yyyy-MM-dd');
    
    // Check if there's a stock status entry for this date and material
    const { data: stockStatusData, error: stockStatusError } = await supabase
      .from('stock_status')
      .select('*')
      .eq('date', formattedDate)
      .eq('name', material_name);
      
    if (stockStatusError) {
      console.error('Error checking stock status:', stockStatusError);
      return false;
    }
    
    if (stockStatusData && stockStatusData.length > 0) {
      // Update existing entry
      const item = stockStatusData[0];
      const newUtilised = item.utilised + quantity;
      
      // Calculate new closing balance
      const closing_bal = item.opening_bal + item.purchases - newUtilised + item.adj_plus;
      
      // Determine status based on closing balance and minimum level
      let status: 'Normal' | 'Low Stock' | 'Out of Stock';
      if (closing_bal <= 0) {
        status = 'Out of Stock';
      } else if (closing_bal < item.min_level) {
        status = 'Low Stock';
      } else {
        status = 'Normal';
      }
      
      const { error: updateError } = await supabase
        .from('stock_status')
        .update({ 
          utilised: newUtilised,
          closing_bal,
          status
        })
        .eq('id', item.id);
        
      if (updateError) {
        console.error('Error updating stock status utilisation:', updateError);
        return false;
      }
    } else {
      // If no entry exists, we need material details
      const { data: materialData, error: materialError } = await supabase
        .from('raw_materials')
        .select('category, min_stock_level')
        .eq('id', material_id)
        .single();
        
      if (materialError || !materialData) {
        console.error('Error getting material:', materialError);
        return false;
      }
      
      // Create new entry with default values
      const newEntry = {
        date: formattedDate,
        name: material_name,
        category: materialData.category,
        opening_bal: 0,
        purchases: 0,
        utilised: quantity,
        adj_plus: 0,
        closing_bal: -quantity, // Negative because we're using without purchase
        min_level: materialData.min_stock_level || 0, // Use the min_stock_level from raw_materials
        status: 'Out of Stock' // If only utilisation exists, it must be out of stock
      };
      
      const { error: insertError } = await supabase
        .from('stock_status')
        .insert(newEntry);
        
      if (insertError) {
        console.error('Error creating stock status entry:', insertError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating stock status utilisation:', error);
    return false;
  }
};

// Staff operations
export const fetchStaff = async () => {
  try {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('name');
      
    if (error) throw error;
    console.log("Fetched staff:", data);
    return data || [];
  } catch (error) {
    handleError(error, "Failed to fetch staff");
    return [];
  }
};

export const saveStaff = async (staff: any) => {
  try {
    console.log("Saving staff member:", staff);
    
    // Create a new UUID if this is a new staff (empty ID)
    const staffToSave = { ...staff };
    if (!staffToSave.id) {
      delete staffToSave.id; // Let Supabase generate the UUID
    }
    
    const { data, error } = await supabase
      .from('staff')
      .upsert(staffToSave)
      .select()
      .single();
      
    if (error) throw error;
    
    console.log("Staff member saved successfully:", data);
    return data;
  } catch (error) {
    handleError(error, "Failed to save staff");
    return null;
  }
};

export const deleteStaff = async (id: string) => {
  try {
    console.log("Deleting staff member:", id);
    
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    console.log("Staff member deleted successfully");
    return true;
  } catch (error) {
    handleError(error, "Failed to delete staff");
    return false;
  }
};

// Tasks operations
export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Transform the data to include the expected properties
    const transformedData = data?.map(task => ({
      ...task,
      task_id: task.id.slice(0, 8),  // Generate a shorter task_id from the UUID
      date_assigned: task.created_at,
      rm_assigned: '',  // Default values for missing fields
      process_assigned: '',
      qty_assigned: 0,
      staff_name: '',
      date_completed: task.status === 'completed' ? task.updated_at : null,
      completed_qty: 0,
      wastage_qty: 0,
      remarks: ''
    })) || [];
    
    console.log("Fetched tasks:", transformedData);
    return transformedData;
  } catch (error) {
    handleError(error, "Failed to fetch tasks");
    return [];
  }
};

export const saveTask = async (task: any) => {
  try {
    console.log("Saving task:", task);
    
    // Create a new UUID if this is a new task (empty ID)
    const taskToSave = { ...task };
    if (!taskToSave.id) {
      delete taskToSave.id; // Let Supabase generate the UUID
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .upsert(taskToSave)
      .select()
      .single();
      
    if (error) throw error;
    
    console.log("Task saved successfully:", data);
    return data;
  } catch (error) {
    handleError(error, "Failed to save task");
    return null;
  }
};

export const deleteTask = async (id: string) => {
  try {
    console.log("Deleting task:", id);
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    console.log("Task deleted successfully");
    return true;
  } catch (error) {
    handleError(error, "Failed to delete task");
    return false;
  }
};

// Production Status operations
export const fetchProductionStatus = async (params: { date: string, stage: string, process: string, month: string }) => {
  try {
    const { data, error } = await supabase
      .from('production_status')
      .select('*')
      .eq('date', params.date)
      .eq('process_stage', params.stage)
      .eq('process', params.process)
      .eq('month', params.month)
      .order('name');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleError(error, "Failed to fetch production status");
    return [];
  }
};

export const saveProductionStatus = async (productionData: any[]) => {
  try {
    // Process each item individually to handle new and existing items
    const processedData = productionData.map(item => {
      // If new item (empty ID), let Supabase generate the UUID
      if (!item.id) {
        const { id, ...restItem } = item;
        return restItem;
      }
      return item;
    });
    
    const { data, error } = await supabase
      .from('production_status')
      .upsert(processedData);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    handleError(error, "Failed to save production status");
    return false;
  }
};
