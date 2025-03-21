
import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import ProductionStatus from './ProductionStatus';
import { fetchProcesses } from '@/lib/database';
import { Skeleton } from '@/components/ui/skeleton';

interface Process {
  id: string;
  name: string;
  sort_order: number;
}

const ProductionProcesses = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pre-process stages: Cleaning, C & D, Roasting, RFP, Samples
  const preProcesses = ['Cleaning', 'C & D', 'Roasting', 'RFP', 'Samples'];
  
  // Prod Process stages: Grinding & Packing
  const prodProcesses = ['Grinding & Packing'];

  const [preProcess, setPreProcess] = useState(preProcesses[0]);
  const [prodProcess, setProdProcess] = useState(prodProcesses[0]);
  const [month, setMonth] = useState(getCurrentMonth());
  const [date, setDate] = useState(getCurrentDate());

  useEffect(() => {
    loadProcesses();
  }, []);

  const loadProcesses = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProcesses();
      if (data && data.length > 0) {
        setProcesses(data);
      }
    } catch (error) {
      console.error('Error loading processes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  function getCurrentMonth() {
    const today = new Date();
    return today.toLocaleString('default', { month: 'long' }); // e.g., "August"
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="pre-process">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="pre-process">Pre Process</TabsTrigger>
          <TabsTrigger value="prod-process">Prod Process</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pre-process" className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {isLoading ? (
              <div className="grid grid-cols-3 gap-2 w-full">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              preProcesses.map(process => (
                <button
                  key={process}
                  onClick={() => setPreProcess(process)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    preProcess === process
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {process}
                </button>
              ))
            )}
          </div>
          
          <ProductionStatus
            stage="Pre-Process"
            process={preProcess}
            date={date}
            onDateChange={setDate}
            month={month}
            onMonthChange={setMonth}
          />
        </TabsContent>
        
        <TabsContent value="prod-process" className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {isLoading ? (
              <Skeleton className="h-10 w-32" />
            ) : (
              prodProcesses.map(process => (
                <button
                  key={process}
                  onClick={() => setProdProcess(process)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    prodProcess === process
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {process}
                </button>
              ))
            )}
          </div>
          
          <ProductionStatus
            stage="Prod-Process"
            process={prodProcess}
            date={date}
            onDateChange={setDate}
            month={month}
            onMonthChange={setMonth}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductionProcesses;
