
import React, { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import StockStatusStats from './StockStatusStats';
import StockStatusTable from './StockStatusTable';
import { useStockManager } from './useStockManager';
import { StockItem } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowRightLeft, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const StockStatusView = () => {
  // Initial sample data
  const initialStockItems: StockItem[] = [
    {
      id: '1',
      code: 'RM001',
      name: 'Chilli',
      category: 'Spices',
      currentStock: 43,
      minStockLevel: 40,
      unit: 'kg',
      lastPurchaseDate: new Date('2023-05-10'),
      status: 'normal'
    },
    {
      id: '2',
      code: 'RM002',
      name: 'Coriander',
      category: 'Spices',
      currentStock: 46,
      minStockLevel: 30,
      unit: 'kg',
      lastPurchaseDate: new Date('2023-05-15'),
      status: 'normal'
    },
    {
      id: '3',
      code: 'RM003',
      name: 'Black Pepper',
      category: 'Spices',
      currentStock: 5,
      minStockLevel: 20,
      unit: 'kg',
      lastPurchaseDate: new Date('2023-04-20'),
      status: 'critical'
    }
  ];
  
  const [statusDate, setStatusDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [stockData, setStockData] = useState([
    { name: 'Chilli', category: 'Spices', openingBal: 10, purchases: 42, utilised: 8, adjPlus: -1, closingBal: 43, minLevel: 40, status: 'Normal' },
    { name: 'Coriander', category: 'Spices', openingBal: 10, purchases: 44, utilised: 8, adjPlus: 0, closingBal: 46, minLevel: 30, status: 'Low Stock' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { filteredItems, searchTerm, stats, handleSearch } = useStockManager(initialStockItems);

  // Load stock data whenever the date changes
  useEffect(() => {
    loadStockDataForDate(statusDate);
  }, [statusDate]);

  // Function to load stock data for a specific date
  const loadStockDataForDate = async (date: string) => {
    setIsLoading(true);
    
    // In a real app, this would fetch data from the API
    // Simulate a data load with sample calculations
    setTimeout(() => {
      // Sample calculations to demonstrate formula implementation
      const updatedStockData = initialStockItems.map(item => {
        const openingBal = Math.max(0, item.currentStock - 5); // Simulated opening balance
        const purchases = Math.floor(Math.random() * 10) + 5; // Random purchases between 5-15
        const utilised = Math.floor(Math.random() * 5); // Random usage between 0-5
        const adjPlus = Math.floor(Math.random() * 3) - 1; // Random adjustment between -1 and 1
        
        // Calculate closing balance using the formula: opening + purchases - utilised + adjustments
        const closingBal = openingBal + purchases - utilised + adjPlus;
        
        // Determine status based on closing balance vs minimum level
        let status = 'Normal';
        if (closingBal <= item.minStockLevel * 0.3) {
          status = 'Critical';
        } else if (closingBal <= item.minStockLevel) {
          status = 'Low Stock';
        }
        
        return {
          name: item.name,
          category: item.category,
          openingBal,
          purchases,
          utilised,
          adjPlus,
          closingBal,
          minLevel: item.minStockLevel,
          status
        };
      });
      
      setStockData(updatedStockData);
      setIsLoading(false);
      
      // In a real implementation, you would fetch from Supabase:
      /*
      try {
        const { data, error } = await supabase
          .from('stock_status')
          .select('*')
          .eq('date', date);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setStockData(data);
        } else {
          // If no data exists for the date, generate it
          const generatedData = initialStockItems.map(item => ({
            name: item.name,
            category: item.category,
            openingBal: item.currentStock,
            purchases: 0,
            utilised: 0,
            adjPlus: 0,
            closingBal: item.currentStock,
            minLevel: item.minStockLevel,
            status: item.status === 'normal' ? 'Normal' : item.status === 'low' ? 'Low Stock' : 'Critical'
          }));
          setStockData(generatedData);
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
        toast({
          title: "Failed to load stock data",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
      */
    }, 500);
  };

  // Handle manual adjustment changes
  const handleAdjustmentChange = (index: number, value: number) => {
    setStockData(prev => prev.map((item, idx) => {
      if (idx === index) {
        const newAdjPlus = isNaN(value) ? 0 : value;
        // Recalculate closing balance with formula: opening + purchases - utilised + adjustments
        const newClosingBal = item.openingBal + item.purchases - item.utilised + newAdjPlus;
        
        // Update status based on new closing balance
        let newStatus = 'Normal';
        if (newClosingBal <= item.minLevel * 0.3) {
          newStatus = 'Critical';
        } else if (newClosingBal <= item.minLevel) {
          newStatus = 'Low Stock';
        }
        
        return { 
          ...item, 
          adjPlus: newAdjPlus, 
          closingBal: newClosingBal,
          status: newStatus
        };
      }
      return item;
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusDate(e.target.value);
  };

  const handleUpdateStatus = () => {
    // Refresh data for the selected date
    loadStockDataForDate(statusDate);
    
    // Provide user feedback
    toast({
      title: "Stock status updated",
      description: `Stock data refreshed for ${new Date(statusDate).toLocaleDateString()}`,
    });
  };
  
  // Save adjustments to database
  const saveAdjustments = async () => {
    setIsLoading(true);
    
    setTimeout(() => {
      toast({
        title: "Adjustments saved",
        description: "Stock status adjustments have been saved successfully",
      });
      setIsLoading(false);
    }, 500);
    
    // In a real implementation:
    /*
    try {
      const updates = stockData.map(item => ({
        name: item.name,
        date: statusDate,
        adj_plus: item.adjPlus,
        closing_bal: item.closingBal,
        status: item.status
      }));
      
      const { error } = await supabase
        .from('stock_status')
        .upsert(updates, {
          onConflict: 'name,date'
        });
        
      if (error) throw error;
      
      toast({
        title: "Adjustments saved",
        description: "Stock status adjustments have been saved successfully",
      });
    } catch (error) {
      console.error('Error saving adjustments:', error);
      toast({
        title: "Failed to save adjustments",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
    */
  };

  return (
    <div className="space-y-6">
      <StockStatusStats stats={stats} />
      
      {/* Date control card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Stock Status as of {new Date(statusDate).toLocaleDateString()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="grid w-full sm:w-auto gap-2">
              <Label htmlFor="statusDate">Status Date</Label>
              <Input
                id="statusDate"
                type="date"
                value={statusDate}
                onChange={handleDateChange}
                className="w-full sm:w-auto"
              />
            </div>
            
            <Button variant="outline" className="w-full sm:w-auto" onClick={handleUpdateStatus} disabled={isLoading}>
              <ArrowRightLeft size={16} className="mr-2" />
              Update Status
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Stock status table with all required columns */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Raw Material Stock Status</CardTitle>
          <Button variant="outline" onClick={saveAdjustments} disabled={isLoading}>
            Save Adjustments
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="border rounded-md overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stock Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Opening Bal</TableHead>
                    <TableHead className="text-right">Purchases</TableHead>
                    <TableHead className="text-right">Utilised</TableHead>
                    <TableHead className="text-right">Adj+/-</TableHead>
                    <TableHead className="text-right">Closing Bal</TableHead>
                    <TableHead className="text-right">Min Level</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">{item.openingBal}</TableCell>
                      <TableCell className="text-right">{item.purchases}</TableCell>
                      <TableCell className="text-right">{item.utilised}</TableCell>
                      <TableCell className="text-right">
                        <Input 
                          type="number" 
                          value={item.adjPlus} 
                          onChange={(e) => handleAdjustmentChange(index, parseFloat(e.target.value))}
                          className="w-16 h-8 text-right" 
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell className="text-right">{item.closingBal}</TableCell>
                      <TableCell className="text-right">{item.minLevel}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={item.status === 'Normal' ? 'outline' : 'secondary'}
                          className={`${
                            item.status === 'Low Stock' 
                              ? 'bg-amber-100 text-amber-800' 
                              : item.status === 'Critical' 
                                ? 'bg-red-100 text-red-800' 
                                : ''
                          }`}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <StockStatusTable 
        items={filteredItems}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
      />
    </div>
  );
};

export default StockStatusView;
