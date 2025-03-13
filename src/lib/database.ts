
import { supabase } from './supabase';
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
    return data || [];
  } catch (error) {
    handleError(error, "Failed to fetch vendors");
    return [];
  }
};

export const saveVendor = async (vendor: any) => {
  try {
    const { data, error } = await supabase
      .from('vendors')
      .upsert(vendor, { onConflict: 'id' })
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Vendor saved",
      description: `${vendor.name} has been saved successfully`,
    });
    
    return data;
  } catch (error) {
    handleError(error, "Failed to save vendor");
    return null;
  }
};

export const deleteVendor = async (id: string) => {
  try {
    const { error } = await supabase
      .from('vendors')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast({
      title: "Vendor deleted",
      description: "Vendor has been deleted successfully",
    });
    
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
    return data || [];
  } catch (error) {
    handleError(error, "Failed to fetch raw materials");
    return [];
  }
};

export const saveRawMaterial = async (material: any) => {
  try {
    const { data, error } = await supabase
      .from('raw_materials')
      .upsert(material, { onConflict: 'id' })
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Raw material saved",
      description: `${material.name} has been saved successfully`,
    });
    
    return data;
  } catch (error) {
    handleError(error, "Failed to save raw material");
    return null;
  }
};

export const deleteRawMaterial = async (id: string) => {
  try {
    const { error } = await supabase
      .from('raw_materials')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast({
      title: "Raw material deleted",
      description: "Raw material has been deleted successfully",
    });
    
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
    return data || [];
  } catch (error) {
    handleError(error, "Failed to fetch stock purchases");
    return [];
  }
};

export const saveStockPurchase = async (purchase: any) => {
  try {
    const { data, error } = await supabase
      .from('stock_purchases')
      .upsert(purchase, { onConflict: 'id' })
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Stock purchase saved",
      description: `Purchase order ${purchase.purchase_order} has been saved successfully`,
    });
    
    return data;
  } catch (error) {
    handleError(error, "Failed to save stock purchase");
    return null;
  }
};

export const deleteStockPurchase = async (id: string) => {
  try {
    const { error } = await supabase
      .from('stock_purchases')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast({
      title: "Stock purchase deleted",
      description: "Stock purchase has been deleted successfully",
    });
    
    return true;
  } catch (error) {
    handleError(error, "Failed to delete stock purchase");
    return false;
  }
};

// Stock Status operations
export const fetchStockStatus = async (date: string) => {
  try {
    const { data, error } = await supabase
      .from('stock_status')
      .select('*')
      .eq('date', date)
      .order('name');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleError(error, "Failed to fetch stock status");
    return [];
  }
};

export const saveStockStatus = async (stockData: any[]) => {
  try {
    const { data, error } = await supabase
      .from('stock_status')
      .upsert(stockData, { onConflict: 'date,name' });
      
    if (error) throw error;
    
    toast({
      title: "Stock status saved",
      description: "Stock status has been updated successfully",
    });
    
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
    return data || [];
  } catch (error) {
    handleError(error, "Failed to fetch staff");
    return [];
  }
};

export const saveStaff = async (staff: any) => {
  try {
    const { data, error } = await supabase
      .from('staff')
      .upsert(staff, { onConflict: 'id' })
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Staff saved",
      description: `${staff.name} has been saved successfully`,
    });
    
    return data;
  } catch (error) {
    handleError(error, "Failed to save staff");
    return null;
  }
};

export const deleteStaff = async (id: string) => {
  try {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast({
      title: "Staff deleted",
      description: "Staff has been deleted successfully",
    });
    
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
    return data || [];
  } catch (error) {
    handleError(error, "Failed to fetch tasks");
    return [];
  }
};

export const saveTask = async (task: any) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .upsert(task, { onConflict: 'id' })
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Task saved",
      description: `Task ${task.task_id} has been saved successfully`,
    });
    
    return data;
  } catch (error) {
    handleError(error, "Failed to save task");
    return null;
  }
};

export const deleteTask = async (id: string) => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast({
      title: "Task deleted",
      description: "Task has been deleted successfully",
    });
    
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
    const { data, error } = await supabase
      .from('production_status')
      .upsert(productionData, { onConflict: 'date,process_stage,process,month,name' });
      
    if (error) throw error;
    
    toast({
      title: "Production status saved",
      description: "Production status has been updated successfully",
    });
    
    return true;
  } catch (error) {
    handleError(error, "Failed to save production status");
    return false;
  }
};
