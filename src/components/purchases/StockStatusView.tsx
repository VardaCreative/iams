
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format, parse, startOfMonth, endOfMonth } from 'date-fns';
import StockStatusTable from './StockStatusTable';
import StockStatusStats from './StockStatusStats';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { fetchStockStatus, saveStockStatus, fetchRawMaterials } from '@/lib/database';
import { StockStatusItem } from './types';

// Define a supplementary type for tasks with optional custom fields
interface TaskWithCustomFields {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_to: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  rm_assigned?: string;
  qty_assigned?: number;
  process_assigned?: string;
  date_assigned?: string;
}

const StockStatusView = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [stockItems, setStockItems] = useState<StockStatusItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const loadStockStatus = async () => {
      setIsLoading(true);
      try {
        // Fetch stock status for the selected date
        const data = await fetchStockStatus(selectedDate);
        console.log('Fetched stock status for date:', selectedDate, data);
        
        if (data && data.length > 0) {
          // Map database structure to frontend structure
          const mappedData = data.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            opening_bal: item.opening_bal,
            purchases: item.purchases,
            utilised: item.utilised,
            adj_plus: item.adj_plus,
            closing_bal: item.closing_bal,
            min_level: item.min_level,
            status: item.status as 'Normal' | 'Low Stock' | 'Out of Stock'
          }));
          setStockItems(mappedData);
        } else {
          // If no data for the selected date, initialize with raw materials
          const materials = await fetchRawMaterials();
          console.log('No stock data found, initializing with raw materials:', materials);

          // For a new month, also get the previous month's closing balances to use as opening balances
          const previousMonthDate = getPreviousMonthLastDay(selectedDate);
          const prevMonthData = await fetchStockStatus(previousMonthDate);
          
          const initialItems = materials.map(material => {
            // Find this material in previous month data if available
            const prevMonthItem = prevMonthData?.find(item => item.name === material.name);
            
            return {
              id: '', // New items will get IDs from the database
              name: material.name,
              category: material.category,
              // Use previous month's closing balance as opening balance if available
              opening_bal: prevMonthItem ? prevMonthItem.closing_bal : 0,
              purchases: 0,
              utilised: 0,
              adj_plus: 0,
              // Initial closing balance equals opening balance
              closing_bal: prevMonthItem ? prevMonthItem.closing_bal : 0,
              min_level: material.min_stock_level,
              status: determineStatus(prevMonthItem ? prevMonthItem.closing_bal : 0, material.min_stock_level)
            };
          });
          setStockItems(initialItems);
        }

        // After loading initial data, fetch the cumulative purchases and utilization for the current month
        if (selectedDate) {
          await fetchMonthlyPurchasesAndUtilization(selectedDate);
        }
      } catch (error) {
        console.error('Error loading stock status:', error);
        toast({
          title: "Failed to load stock status",
          description: "There was an error loading the stock status data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStockStatus();
  }, [selectedDate, refreshTrigger]);

  // Helper function to determine status based on quantity and min level
  const determineStatus = (quantity: number, minLevel: number): 'Normal' | 'Low Stock' | 'Out of Stock' => {
    if (quantity <= 0) return 'Out of Stock';
    if (quantity < minLevel) return 'Low Stock';
    return 'Normal';
  };

  // Helper function to get the last day of the previous month
  const getPreviousMonthLastDay = (dateString: string) => {
    const date = parse(dateString, 'yyyy-MM-dd', new Date());
    const firstDayOfMonth = startOfMonth(date);
    const lastDayOfPrevMonth = new Date(firstDayOfMonth);
    lastDayOfPrevMonth.setDate(lastDayOfPrevMonth.getDate() - 1);
    return format(lastDayOfPrevMonth, 'yyyy-MM-dd');
  };

  // Function to fetch monthly purchases and utilization data
  const fetchMonthlyPurchasesAndUtilization = async (dateString: string) => {
    try {
      const date = parse(dateString, 'yyyy-MM-dd', new Date());
      const monthStart = format(startOfMonth(date), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(date), 'yyyy-MM-dd');
      
      // Fetch all stock purchases for the month
      const { data: purchases, error: purchasesError } = await supabase
        .from('stock_purchases')
        .select('material_name, quantity')
        .gte('purchase_date', monthStart)
        .lte('purchase_date', monthEnd)
        .eq('status', 'received');
        
      if (purchasesError) {
        console.error('Error fetching monthly purchases:', purchasesError);
        return;
      }
      
      // Initialize purchases by material
      const purchasesByMaterial: Record<string, number> = {};
      if (purchases) {
        purchases.forEach(purchase => {
          if (!purchasesByMaterial[purchase.material_name]) {
            purchasesByMaterial[purchase.material_name] = 0;
          }
          purchasesByMaterial[purchase.material_name] += Number(purchase.quantity);
        });
      }
      
      // Initialize utilization by material
      const utilizationByMaterial: Record<string, number> = {};
      
      // Check if the tasks table has the necessary columns
      try {
        // Get a sample task to check structure
        const { data: sampleTaskData } = await supabase
          .from('tasks')
          .select('*')
          .limit(1);
          
        // Check if the sample has custom fields we need
        if (sampleTaskData && sampleTaskData.length > 0) {
          const sampleTask = sampleTaskData[0] as TaskWithCustomFields;
          
          // Check if the necessary custom fields exist
          if ('rm_assigned' in sampleTask && 'qty_assigned' in sampleTask && 'process_assigned' in sampleTask) {
            console.log('Required task columns exist, fetching utilization data');
            
            // Fetch tasks for the month
            const { data: tasksData } = await supabase
              .from('tasks')
              .select('*')
              .gte('created_at', monthStart)
              .lte('created_at', monthEnd)
              .eq('status', 'completed');
              
            if (tasksData && tasksData.length > 0) {
              // Process each task, treating all fields as optional
              tasksData.forEach(taskData => {
                const task = taskData as TaskWithCustomFields;
                
                // Only process tasks that have the required fields and are cleaning tasks
                if (task.rm_assigned && 
                    task.qty_assigned !== undefined && 
                    task.process_assigned === 'Cleaning') {
                  
                  if (!utilizationByMaterial[task.rm_assigned]) {
                    utilizationByMaterial[task.rm_assigned] = 0;
                  }
                  
                  utilizationByMaterial[task.rm_assigned] += Number(task.qty_assigned);
                }
              });
            }
          } else {
            console.log('Tasks table missing required custom fields. Skipping utilization data.');
          }
        } else {
          console.log('No tasks found in the database. Skipping utilization data.');
        }
      } catch (error) {
        console.error('Error fetching task data:', error);
        console.log('Skipping utilization data due to error.');
      }
      
      // Update the stock items with the fetched data
      setStockItems(prevItems => 
        prevItems.map(item => {
          const purchases = purchasesByMaterial[item.name] || 0;
          const utilised = utilizationByMaterial[item.name] || 0;
          const closing_bal = item.opening_bal + purchases - utilised + item.adj_plus;
          
          return {
            ...item,
            purchases,
            utilised,
            closing_bal,
            status: determineStatus(closing_bal, item.min_level)
          };
        })
      );
      
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Calculate closing balance and update status for each item
      const updatedItems = stockItems.map(item => {
        // Formula: Closing Balance = Opening Balance + Purchases - Utilised + Adj+/-
        const closing_bal = item.opening_bal + item.purchases - item.utilised + item.adj_plus;
        
        // Determine status based on closing balance and minimum level
        let status: 'Normal' | 'Low Stock' | 'Out of Stock';
        if (closing_bal <= 0) {
          status = 'Out of Stock';
        } else if (closing_bal < item.min_level) {
          status = 'Low Stock';
        } else {
          status = 'Normal';
        }
        
        return {
          ...item,
          closing_bal,
          status
        };
      });
      
      // Update the state with calculated values
      setStockItems(updatedItems);
      console.log('Saving calculated stock status:', updatedItems);
      
      // Save the updated stock status to the database
      const success = await saveStockStatus(updatedItems.map(item => ({
        id: item.id,
        date: selectedDate,
        name: item.name,
        category: item.category,
        opening_bal: item.opening_bal,
        purchases: item.purchases,
        utilised: item.utilised,
        adj_plus: item.adj_plus,
        closing_bal: item.closing_bal,
        min_level: item.min_level,
        status: item.status
      })));
      
      if (success) {
        toast({
          title: "Stock status saved",
          description: "Stock status has been updated successfully",
        });
        setIsEditing(false);
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error saving stock status:', error);
      toast({
        title: "Failed to save stock status",
        description: "There was an error saving the stock status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpeningBalChange = (id: string, value: number) => {
    setStockItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id || (!item.id && item.name === id)) {
          // Calculate new closing balance with the updated opening balance
          const closing_bal = value + item.purchases - item.utilised + item.adj_plus;
          // Determine status based on new closing balance
          let status = determineStatus(closing_bal, item.min_level);
          
          return { 
            ...item, 
            opening_bal: value,
            closing_bal,
            status
          };
        }
        return item;
      })
    );
  };

  const handleAdjustmentChange = (id: string, value: number) => {
    setStockItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id || (!item.id && item.name === id)) {
          // Calculate new closing balance with the updated adjustment
          const closing_bal = item.opening_bal + item.purchases - item.utilised + value;
          // Determine status based on new closing balance
          let status = determineStatus(closing_bal, item.min_level);
          
          return { 
            ...item, 
            adj_plus: value,
            closing_bal,
            status
          };
        }
        return item;
      })
    );
  };

  const handleMinLevelChange = (id: string, value: number) => {
    setStockItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id || (!item.id && item.name === id)) {
          // Recalculate status based on the new min level
          let status = determineStatus(item.closing_bal, value);
          
          return { 
            ...item, 
            min_level: value,
            status
          };
        }
        return item;
      })
    );
  };

  // Count items by status
  const totalItems = stockItems.length;
  const normalItems = stockItems.filter(item => item.status === 'Normal').length;
  const lowStockItems = stockItems.filter(item => item.status === 'Low Stock').length;
  const outOfStockItems = stockItems.filter(item => item.status === 'Out of Stock').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="date">Date</Label>
            <Input
              type="date"
              id="date"
              value={selectedDate}
              onChange={handleDateChange}
              disabled={isLoading || isEditing}
              className="w-52"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={isLoading || isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading || isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit} disabled={isLoading}>
              Edit
            </Button>
          )}
        </div>
      </div>

      <StockStatusStats
        totalItems={totalItems}
        normalItems={normalItems}
        lowStockItems={lowStockItems}
        outOfStockItems={outOfStockItems}
      />
      
      <StockStatusTable
        items={stockItems}
        isLoading={isLoading}
        isEditing={isEditing}
        onOpeningBalChange={handleOpeningBalChange}
        onAdjustmentChange={handleAdjustmentChange}
        onMinLevelChange={handleMinLevelChange}
      />
    </div>
  );
};

export default StockStatusView;
