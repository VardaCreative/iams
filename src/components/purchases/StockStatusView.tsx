
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import StockStatusTable from './StockStatusTable';
import StockStatusStats from './StockStatusStats';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { fetchStockStatus, saveStockStatus, fetchRawMaterials } from '@/lib/database';

export interface StockItem {
  id: string;
  name: string;
  category: string;
  openingBal: number;
  purchases: number;
  utilised: number;
  adjPlus: number;
  closingBal: number;
  minLevel: number;
  status: 'Normal' | 'Low Stock' | 'Out of Stock';
}

const StockStatusView = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
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
        
        if (data.length > 0) {
          // Map database structure to frontend structure
          const mappedData = data.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            openingBal: item.opening_bal,
            purchases: item.purchases,
            utilised: item.utilised,
            adjPlus: item.adj_plus,
            closingBal: item.closing_bal,
            minLevel: item.min_level,
            status: item.status as 'Normal' | 'Low Stock' | 'Out of Stock'
          }));
          setStockItems(mappedData);
        } else {
          // If no data for the selected date, initialize with raw materials
          const materials = await fetchRawMaterials();
          const initialItems = materials.map(material => ({
            id: '', // New items will get IDs from the database
            name: material.name,
            category: material.category,
            openingBal: 0,
            purchases: 0,
            utilised: 0,
            adjPlus: 0,
            closingBal: 0,
            minLevel: material.minStockLevel,
            status: 'Normal' as 'Normal' | 'Low Stock' | 'Out of Stock'
          }));
          setStockItems(initialItems);
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Refresh to revert any unsaved changes
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Calculate closing balance and update status for each item
      const updatedItems = stockItems.map(item => {
        // Formula: Closing Balance = Opening Balance + Purchases - Utilised + Adj+/-
        const closingBal = item.openingBal + item.purchases - item.utilised + item.adjPlus;
        
        // Determine status based on closing balance and minimum level
        let status: 'Normal' | 'Low Stock' | 'Out of Stock';
        if (closingBal <= 0) {
          status = 'Out of Stock';
        } else if (closingBal < item.minLevel) {
          status = 'Low Stock';
        } else {
          status = 'Normal';
        }
        
        return {
          ...item,
          closingBal,
          status
        };
      });
      
      // Update the state with calculated values
      setStockItems(updatedItems);
      
      // Map frontend structure to database structure
      const dbItems = updatedItems.map(item => ({
        id: item.id,
        date: selectedDate,
        name: item.name,
        category: item.category,
        opening_bal: item.openingBal,
        purchases: item.purchases,
        utilised: item.utilised,
        adj_plus: item.adjPlus,
        closing_bal: item.closingBal,
        min_level: item.minLevel,
        status: item.status
      }));
      
      const success = await saveStockStatus(dbItems);
      
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

  const handleAdjustmentChange = (id: string, value: number) => {
    setStockItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, adjPlus: value } : item
      )
    );
  };

  const handleMinLevelChange = (id: string, value: number) => {
    setStockItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, minLevel: value } : item
      )
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
        onAdjustmentChange={handleAdjustmentChange}
        onMinLevelChange={handleMinLevelChange}
      />
    </div>
  );
};

export default StockStatusView;
