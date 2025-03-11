
import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import DashboardCard from '@/components/dashboard/DashboardCard';
import MetricCard from '@/components/dashboard/MetricCard';
import Chart from '@/components/dashboard/Chart';
import { ShoppingCart, Clipboard, Factory, TrendingUp, AlertTriangle, ArrowRightFromLine } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Sample data for charts
const salesData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 7000 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 8000 },
];

const inventoryData = [
  { name: 'Red Chili', value: 35 },
  { name: 'Cardamom', value: 45 },
  { name: 'Cinnamon', value: 20 },
  { name: 'Cumin', value: 30 },
  { name: 'Turmeric', value: 60 },
];

const productionData = [
  { name: 'Week 1', value: 200 },
  { name: 'Week 2', value: 300 },
  { name: 'Week 3', value: 280 },
  { name: 'Week 4', value: 320 },
];

const stockDistribution = [
  { name: 'Raw Materials', value: 40 },
  { name: 'In Process', value: 25 },
  { name: 'Finished Goods', value: 35 },
];

const notifications = [
  { id: 1, title: 'Low Stock Alert', description: 'Cardamom stock is running low', type: 'warning' },
  { id: 2, title: 'Order Completed', description: 'Production order #1234 is complete', type: 'success' },
  { id: 3, title: 'Task Due', description: 'Cleaning process assignment due today', type: 'info' },
];

const Dashboard = () => {
  return (
    <PageContainer
      title="Dashboard"
      description="Overview of your spice manufacturing business"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Purchases"
          value="₹245,000"
          trend={{ value: 12, isPositive: true }}
          icon={ShoppingCart}
        />
        <MetricCard
          title="Active Tasks"
          value="24"
          trend={{ value: 5, isPositive: true }}
          icon={Clipboard}
          variant="secondary"
        />
        <MetricCard
          title="Production Rate"
          value="280 kg/day"
          trend={{ value: 8, isPositive: true }}
          icon={Factory}
          variant="primary"
        />
        <MetricCard
          title="Total Sales"
          value="₹482,500"
          trend={{ value: 4, isPositive: false }}
          icon={TrendingUp}
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <DashboardCard title="Sales Trend" className="lg:col-span-2">
          <Chart
            type="line"
            data={salesData}
            dataKey="value"
            height={300}
          />
        </DashboardCard>
        
        <DashboardCard title="Stock Distribution">
          <Chart
            type="pie"
            data={stockDistribution}
            dataKey="value"
            height={300}
          />
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <DashboardCard title="Inventory Levels">
          <Chart
            type="bar"
            data={inventoryData}
            dataKey="value"
            height={250}
          />
        </DashboardCard>
        
        <DashboardCard title="Production Output">
          <Chart
            type="bar"
            data={productionData}
            dataKey="value"
            height={250}
          />
        </DashboardCard>
      </div>

      <div className="mt-6">
        <DashboardCard title="Recent Notifications">
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-background transition-colors duration-250"
              >
                <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                  notification.type === 'warning' ? 'bg-amber-100 text-amber-700' : 
                  notification.type === 'success' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-sky-100 text-sky-700'
                }`}>
                  {notification.type === 'warning' ? <AlertTriangle size={18} /> :
                   notification.type === 'success' ? <Factory size={18} /> :
                   <Clipboard size={18} />}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{notification.title}</h4>
                  <p className="text-xs text-muted-foreground">{notification.description}</p>
                </div>
                <Button size="sm" variant="ghost" className="h-8 text-xs">
                  <span>View</span>
                  <ArrowRightFromLine size={12} className="ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
