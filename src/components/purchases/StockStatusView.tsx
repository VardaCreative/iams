
import React, { useState } from 'react';
import StockStatusStats from './StockStatusStats';
import StockStatusTable from './StockStatusTable';
import { useStockManager } from './useStockManager';
import { StockItem } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowRightLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  
  const { filteredItems, searchTerm, stats, handleSearch } = useStockManager(initialStockItems);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusDate(e.target.value);
    // In a real app, would fetch data for the selected date
  };

  const handleUpdateStatus = () => {
    // In a real app, would refresh data for the selected date
    console.log("Updating stock status for:", statusDate);
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
            
            <Button variant="outline" className="w-full sm:w-auto" onClick={handleUpdateStatus}>
              <ArrowRightLeft size={16} className="mr-2" />
              Update Status
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Stock status table with all required columns */}
      <Card>
        <CardHeader>
          <CardTitle>Raw Material Stock Status</CardTitle>
        </CardHeader>
        <CardContent>
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
                    <TableCell className="text-right">{item.adjPlus}</TableCell>
                    <TableCell className="text-right">{item.closingBal}</TableCell>
                    <TableCell className="text-right">{item.minLevel}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.status === 'Normal' ? 'outline' : 'secondary'}
                        className={`${item.status === 'Low Stock' ? 'bg-amber-100 text-amber-800' : ''}`}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
