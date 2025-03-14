import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { fetchProductionStatus, saveProductionStatus } from '@/lib/database';

const months = ["Jan-24", "Feb-24", "Mar-24", "Apr-24"];
const processStages = ["Pre-Prod", "Production"];
const processes = ["Cleaning", "Grinding", "Packing"];

interface ProductionItem {
  id: string;
  name: string;
  category: string;
  opening: number;
  assigned: number;
  completed: number;
  wastage: number;
  pending: number;
  adjustments: number;
  closing: number;
  minLevel: number;
  status: string;
}

const initialPreProductionData: ProductionItem[] = [
  { 
    id: "RM1", 
    name: "Red Chilli", 
    category: "Spices",
    opening: 10.00, 
    assigned: 0.00, 
    completed: 10.00, 
    wastage: 0.00, 
    pending: 0.00, 
    adjustments: 0.00, 
    closing: 10.00,
    minLevel: 5.00,
    status: 'Normal'
  },
  { 
    id: "RM2", 
    name: "Turmeric", 
    category: "Spices",
    opening: 15.00, 
    assigned: 5.00, 
    completed: 10.00, 
    wastage: 0.10, 
    pending: 0.00, 
    adjustments: 0.00, 
    closing: 24.90, 
    minLevel: 7.50,
    status: 'Normal'
  },
  { 
    id: "RM3", 
    name: "Black Pepper", 
    category: "Spices",
    opening: 8.00, 
    assigned: 2.00, 
    completed: 6.00, 
    wastage: 0.20, 
    pending: 0.00, 
    adjustments: 0.00, 
    closing: 13.80, 
    minLevel: 4.00,
    status: 'Normal'
  },
];

const ProductionStatus = () => {
  const [selectedMonth, setSelectedMonth] = useState("Feb-24");
  const [selectedProcessStage, setSelectedProcessStage] = useState("Pre-Prod");
  const [selectedProcess, setSelectedProcess] = useState("Cleaning");
  const [statusDate, setStatusDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [tableData, setTableData] = useState<ProductionItem[]>(initialPreProductionData);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    fetchProductionData();
  }, [selectedMonth, selectedProcessStage, selectedProcess, statusDate]);
  
  const fetchProductionData = async () => {
    setIsLoading(true);
    
    try {
      const data = await fetchProductionStatus({
        date: statusDate,
        stage: selectedProcessStage,
        process: selectedProcess,
        month: selectedMonth
      });
      
      if (data && data.length > 0) {
        const formattedData: ProductionItem[] = data.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          opening: item.opening,
          assigned: item.assigned,
          completed: item.completed,
          wastage: item.wastage,
          pending: item.pending,
          adjustments: item.adjustments || 0,
          closing: item.closing,
          minLevel: item.min_level,
          status: item.status
        }));
        
        setTableData(processData(formattedData));
      } else {
        const sampleData = getDataByProcessType();
        setTableData(processData(sampleData));
      }
    } catch (error) {
      console.error('Error fetching production data:', error);
      toast({
        title: "Failed to load production data",
        description: "Please try again later",
        variant: "destructive"
      });
      
      const sampleData = getDataByProcessType();
      setTableData(processData(sampleData));
    } finally {
      setIsLoading(false);
    }
  };
  
  const getDataByProcessType = (): ProductionItem[] => {
    if (selectedProcessStage === "Pre-Prod") {
      return initialPreProductionData;
    } else if (selectedProcess === "Grinding") {
      return [
        { 
          id: "SKU1", 
          name: "Red Chilli Powder", 
          category: "Spices",
          opening: 20.00, 
          assigned: 5.00, 
          completed: 15.00, 
          wastage: 0.50, 
          pending: 0.00, 
          adjustments: 0.00, 
          closing: 0.00, 
          minLevel: 10.00,
          status: 'Normal'
        },
        { 
          id: "SKU2", 
          name: "Turmeric Powder", 
          category: "Spices",
          opening: 15.00, 
          assigned: 7.00, 
          completed: 8.00, 
          wastage: 0.30, 
          pending: 0.00, 
          adjustments: 0.00, 
          closing: 0.00, 
          minLevel: 5.00,
          status: 'Normal'
        },
      ];
    } else if (selectedProcess === "Packing") {
      return [
        { 
          id: "PKSKU1", 
          name: "Red Chilli Powder 100g", 
          category: "Packaged",
          opening: 40, 
          assigned: 20, 
          completed: 20, 
          wastage: 2, 
          pending: 0, 
          adjustments: 0, 
          closing: 0, 
          minLevel: 20,
          status: 'Normal'
        },
        { 
          id: "PKSKU2", 
          name: "Turmeric Powder 50g", 
          category: "Packaged",
          opening: 30, 
          assigned: 15, 
          completed: 15, 
          wastage: 0, 
          pending: 0, 
          adjustments: 0, 
          closing: 0, 
          minLevel: 15,
          status: 'Normal'
        },
      ];
    }
    return initialPreProductionData;
  };
  
  const processData = (data: ProductionItem[]): ProductionItem[] => {
    return data.map(item => {
      const closingBalance = item.opening + item.completed - item.wastage + (item.adjustments || 0);
      
      let status = 'Normal';
      if (closingBalance <= item.minLevel * 0.3) {
        status = 'Critical';
      } else if (closingBalance <= item.minLevel) {
        status = 'Low Stock';
      }
      
      return {
        ...item,
        closing: parseFloat(closingBalance.toFixed(2)),
        status
      };
    });
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusDate(e.target.value);
  };
  
  const handleUpdateStatus = () => {
    fetchProductionData();
    toast({
      title: "Status Updated",
      description: `Production status data refreshed for ${new Date(statusDate).toLocaleDateString()}`,
    });
  };
  
  const saveAdjustments = async () => {
    setIsLoading(true);
    
    try {
      const updates = tableData.map(item => ({
        date: statusDate,
        process_stage: selectedProcessStage,
        process: selectedProcess,
        month: selectedMonth,
        name: item.name,
        category: item.category,
        opening: item.opening,
        assigned: item.assigned,
        completed: item.completed,
        wastage: item.wastage,
        pending: item.pending,
        adjustments: item.adjustments,
        closing: item.closing,
        min_level: item.minLevel,
        status: item.status
      }));
      
      const result = await saveProductionStatus(updates);
      
      if (result) {
        toast({
          title: "Adjustments Saved",
          description: "Production status adjustments have been saved successfully.",
        });
      } else {
        throw new Error("Failed to save adjustments");
      }
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
  };
  
  const handleAdjustmentChange = (id: string, value: number) => {
    setTableData(prev => prev.map(item => {
      if (item.id === id) {
        const adjustments = isNaN(value) ? 0 : value;
        const closing = item.opening + item.completed - item.wastage + adjustments;
        
        let status = 'Normal';
        if (closing <= item.minLevel * 0.3) {
          status = 'Critical';
        } else if (closing <= item.minLevel) {
          status = 'Low Stock';
        }
        
        return { 
          ...item, 
          adjustments, 
          closing: parseFloat(closing.toFixed(2)),
          status 
        };
      }
      return item;
    }));
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Production Status Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="grid w-full md:w-auto gap-2">
              <Label htmlFor="statusDate">Status Date</Label>
              <Input
                id="statusDate"
                type="date"
                value={statusDate}
                onChange={handleDateChange}
                className="w-full md:w-[200px]"
              />
            </div>
            
            <div className="grid w-full md:w-auto gap-2">
              <Label htmlFor="processStage">Process Stage</Label>
              <Select value={selectedProcessStage} onValueChange={setSelectedProcessStage}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {processStages.map(stage => (
                    <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid w-full md:w-auto gap-2">
              <Label htmlFor="process">Process</Label>
              <Select value={selectedProcess} onValueChange={setSelectedProcess}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select process" />
                </SelectTrigger>
                <SelectContent>
                  {processes.map(process => (
                    <SelectItem key={process} value={process}>{process}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid w-full md:w-auto gap-2">
              <Label htmlFor="month">Month</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button variant="outline" className="w-full md:w-auto" onClick={handleUpdateStatus} disabled={isLoading}>
                <ArrowRightLeft size={16} className="mr-2" />
                Update Status
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              {selectedProcessStage === "Pre-Prod" ? "Pre-Production" : "Production"} - {selectedProcess}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Month: {selectedMonth} | Date: {new Date(statusDate).toLocaleDateString()}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-blue-500"></div>
            <span className="text-xs">Assigned</span>
            
            <div className="h-4 w-4 rounded-full bg-green-500 ml-2"></div>
            <span className="text-xs">Completed</span>
            
            <div className="h-4 w-4 rounded-full bg-red-500 ml-2"></div>
            <span className="text-xs">Wastage</span>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              <div className="border rounded-md overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Opening Bal</TableHead>
                      <TableHead className="text-right text-blue-500">Assigned</TableHead>
                      <TableHead className="text-right text-green-500">Completed</TableHead>
                      <TableHead className="text-right text-red-500">Wastage</TableHead>
                      <TableHead className="text-right">Pending</TableHead>
                      <TableHead className="text-right">Adj+/-</TableHead>
                      <TableHead className="text-right">Closing Bal</TableHead>
                      <TableHead className="text-right">Min Level</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">{item.opening.toFixed(2)}</TableCell>
                        <TableCell className="text-right text-blue-500">{item.assigned.toFixed(2)}</TableCell>
                        <TableCell className="text-right text-green-500">{item.completed.toFixed(2)}</TableCell>
                        <TableCell className="text-right text-red-500">{item.wastage.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{item.pending.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Input 
                            type="number" 
                            value={item.adjustments} 
                            onChange={(e) => handleAdjustmentChange(item.id, parseFloat(e.target.value))}
                            className="w-20 h-8 text-right"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">{item.closing.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{item.minLevel.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
                            item.status === 'Low Stock' 
                              ? 'bg-amber-100 text-amber-800' 
                              : item.status === 'Critical' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {item.status || 'Normal'}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={saveAdjustments} disabled={isLoading}>
                  Save Adjustments
                </Button>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground space-y-2">
                <h4 className="font-medium text-foreground">Formulas:</h4>
                <p>Opening Stock = Balance qty available on first day of the month</p>
                <p>Assigned = The quantity assigned in task management</p>
                <p>Completed = The quantity completed in the assigned tasks</p>
                <p>Wastage = The wastage reported in tasks</p>
                <p>Adj+/- = Any manual adjustments, which can be entered by the user (can be negative value also)</p>
                <p>Closing Stock = Opening Stock + Completed - Wastage + Adj(+/-)</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionStatus;
