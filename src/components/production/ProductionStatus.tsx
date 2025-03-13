
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';

const months = ["Jan-24", "Feb-24", "Mar-24", "Apr-24"];
const processStages = ["Pre-Prod", "Production"];
const processes = ["Cleaning", "Grinding", "Packing"];

// Sample data for the production status tables
const preProductionData = [
  { id: "RM1", name: "Red Chilli", opening: 10.00, assigned: 0.00, completed: 10.00, wastage: 0.00, pending: 0.00, adjustments: 0.00, closing: 10.00 },
  { id: "RM2", name: "Turmeric", opening: 15.00, assigned: 5.00, completed: 10.00, wastage: 0.10, pending: 0.00, adjustments: 0.00, closing: 9.90 },
  { id: "RM3", name: "Black Pepper", opening: 8.00, assigned: 2.00, completed: 6.00, wastage: 0.20, pending: 0.00, adjustments: 0.00, closing: 5.80 },
  { id: "RM4", name: "Cumin", opening: 12.00, assigned: 3.00, completed: 9.00, wastage: 0.15, pending: 0.00, adjustments: 0.00, closing: 8.85 },
];

const productionData = [
  { id: "SKU1", name: "Red Chilli Powder", opening: 20.00, assigned: 5.00, completed: 15.00, wastage: 0.50, pending: 0.00, adjustments: 0.00, closing: 14.50 },
  { id: "SKU2", name: "Turmeric Powder", opening: 15.00, assigned: 7.00, completed: 8.00, wastage: 0.30, pending: 0.00, adjustments: 0.00, closing: 7.70 },
  { id: "SKU3", name: "Black Pepper Powder", opening: 10.00, assigned: 3.00, completed: 7.00, wastage: 0.20, pending: 0.00, adjustments: 0.00, closing: 6.80 },
];

const packingData = [
  { id: "PKSKU1", name: "Red Chilli Powder 100g", opening: 40, assigned: 20, completed: 20, wastage: 2, pending: 0, adjustments: 0, closing: 18 },
  { id: "PKSKU2", name: "Turmeric Powder 50g", opening: 30, assigned: 15, completed: 15, wastage: 0, pending: 0, adjustments: 0, closing: 15 },
  { id: "PKSKU3", name: "Black Pepper Powder 25g", opening: 25, assigned: 10, completed: 15, wastage: 1, pending: 0, adjustments: 0, closing: 14 },
];

const ProductionStatus = () => {
  const [selectedMonth, setSelectedMonth] = useState("Feb-24");
  const [selectedProcessStage, setSelectedProcessStage] = useState("Pre-Prod");
  const [selectedProcess, setSelectedProcess] = useState("Cleaning");
  
  const getTableData = () => {
    if (selectedProcessStage === "Pre-Prod") {
      return preProductionData;
    } else if (selectedProcess === "Grinding") {
      return productionData;
    } else if (selectedProcess === "Packing") {
      return packingData;
    }
    return preProductionData;
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
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              {selectedProcessStage === "Pre-Prod" ? "Pre-Production" : "Production"} - {selectedProcess}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Month: {selectedMonth}</p>
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
          <div className="border rounded-md overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Opening Stock</TableHead>
                  <TableHead className="text-right text-blue-500">Assigned</TableHead>
                  <TableHead className="text-right text-green-500">Completed</TableHead>
                  <TableHead className="text-right text-red-500">Wastage</TableHead>
                  <TableHead className="text-right">Pending</TableHead>
                  <TableHead className="text-right">Adjustments</TableHead>
                  <TableHead className="text-right">Closing Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getTableData().map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">{item.opening.toFixed(2)}</TableCell>
                    <TableCell className="text-right text-blue-500">{item.assigned.toFixed(2)}</TableCell>
                    <TableCell className="text-right text-green-500">{item.completed.toFixed(2)}</TableCell>
                    <TableCell className="text-right text-red-500">{item.wastage.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.pending.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.adjustments.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">{item.closing.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionStatus;
