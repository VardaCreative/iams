
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Search } from 'lucide-react';

interface StockItem {
  id: string;
  code: string;
  name: string;
  category: string;
  currentStock: number;
  minStockLevel: number;
  unit: string;
  lastPurchaseDate: Date | null;
  status: 'normal' | 'low' | 'critical';
}

const StockStatusView = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>([
    {
      id: '1',
      code: 'RM001',
      name: 'Red Chilli',
      category: 'Spices',
      currentStock: 250,
      minStockLevel: 50,
      unit: 'kg',
      lastPurchaseDate: new Date('2023-05-10'),
      status: 'normal'
    },
    {
      id: '2',
      code: 'RM002',
      name: 'Turmeric',
      category: 'Spices',
      currentStock: 20,
      minStockLevel: 30,
      unit: 'kg',
      lastPurchaseDate: new Date('2023-05-15'),
      status: 'low'
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
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<StockItem[]>(stockItems);
  
  // Stats
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    criticalStock: 0
  });
  
  useEffect(() => {
    // Filter items based on search term
    const filtered = stockItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredItems(filtered);
    
    // Update stats
    setStats({
      totalItems: stockItems.length,
      lowStock: stockItems.filter(item => item.status === 'low').length,
      criticalStock: stockItems.filter(item => item.status === 'critical').length
    });
  }, [stockItems, searchTerm]);
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Raw Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{stats.lowStock}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.criticalStock}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Current Stock Status</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search raw materials..."
                onChange={handleSearch}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min. Level</TableHead>
                  <TableHead>Last Purchase</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        {item.currentStock} {item.unit.toUpperCase()}
                      </TableCell>
                      <TableCell>
                        {item.minStockLevel} {item.unit.toUpperCase()}
                      </TableCell>
                      <TableCell>{formatDate(item.lastPurchaseDate)}</TableCell>
                      <TableCell>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
                          item.status === 'normal' 
                            ? 'bg-green-100 text-green-800' 
                            : item.status === 'low'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800 flex items-center'
                        }`}>
                          {item.status === 'critical' && (
                            <AlertTriangle size={12} className="mr-1" />
                          )}
                          {item.status === 'normal' ? 'Normal' : item.status === 'low' ? 'Low Stock' : 'Critical'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockStatusView;
