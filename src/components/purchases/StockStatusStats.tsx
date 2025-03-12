
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StockItem } from './types';

interface StockStatusStatsProps {
  stats: {
    totalItems: number;
    lowStock: number;
    criticalStock: number;
  };
}

const StockStatusStats: React.FC<StockStatusStatsProps> = ({ stats }) => {
  return (
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
  );
};

export default StockStatusStats;
