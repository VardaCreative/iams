
import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ChartProps {
  data: any[];
  type: 'line' | 'bar' | 'pie';
  dataKey: string;
  height?: number;
  colors?: string[];
  showGrid?: boolean;
  showAxis?: boolean;
}

const defaultColors = ['#0ea5e9', '#22c55e', '#eab308', '#ef4444', '#8b5cf6'];

const Chart = ({
  data,
  type,
  dataKey,
  height = 300,
  colors = defaultColors,
  showGrid = true,
  showAxis = true,
}: ChartProps) => {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />}
            {showAxis && <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={10} fontSize={12} />}
            {showAxis && <YAxis axisLine={false} tickLine={false} tickMargin={10} fontSize={12} />}
            <Tooltip 
              contentStyle={{ 
                border: 'none', 
                borderRadius: '8px', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', 
                padding: '10px' 
              }}
              cursor={{ stroke: '#f0f0f0', strokeWidth: 1 }}
            />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={colors[0]} 
              strokeWidth={2.5}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        );
        
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />}
            {showAxis && <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={10} fontSize={12} />}
            {showAxis && <YAxis axisLine={false} tickLine={false} tickMargin={10} fontSize={12} />}
            <Tooltip 
              contentStyle={{ 
                border: 'none', 
                borderRadius: '8px', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', 
                padding: '10px' 
              }}
            />
            <Bar 
              dataKey={dataKey} 
              fill={colors[0]} 
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          </BarChart>
        );
        
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              paddingAngle={3}
              dataKey={dataKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                border: 'none', 
                borderRadius: '8px', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', 
                padding: '10px' 
              }}
            />
          </PieChart>
        );
        
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      {renderChart()}
    </ResponsiveContainer>
  );
};

export default Chart;
