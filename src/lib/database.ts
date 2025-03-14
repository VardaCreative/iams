
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

// Generic error handler
export const handleError = (error: any, customMessage = "Operation failed") => {
  console.error(error);
  toast({
    title: customMessage,
    description: error.message || "Please try again later",
    variant: "destructive",
  });
};

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

export const saveVendor = async (vendor: any) => {
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
export const fetchTasks = async () => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('date_assigned', { ascending: false });
      
    if (error) throw error;
    console.log("Fetched tasks:", data);
    return data || [];
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
