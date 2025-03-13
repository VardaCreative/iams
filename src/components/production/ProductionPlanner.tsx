
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProductionPlan {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  rmQuantities: {
    [key: string]: number;
  };
}

const rawMaterials = [
  'Trk', 'Cumin', 'Corl', 'Clvs', 'Pppr', 'Mstrd', 'Fnnl', 'Chll', 'Ppl', 'DhN', 'BlkSl', 'Gngr'
];

const ProductionPlanner = () => {
  const [plans, setPlans] = useState<ProductionPlan[]>([
    {
      id: '1',
      sku: 'SKU001',
      name: 'Red Chilli Powder',
      quantity: 50,
      rmQuantities: {
        'Trk': 0,
        'Cumin': 0,
        'Corl': 0,
        'Clvs': 0,
        'Pppr': 0,
        'Mstrd': 0,
        'Fnnl': 0,
        'Chll': 10,
        'Ppl': 0,
        'DhN': 0,
        'BlkSl': 0,
        'Gngr': 0
      }
    },
    {
      id: '2',
      sku: 'SKU002',
      name: 'Turmeric Powder',
      quantity: 30,
      rmQuantities: {
        'Trk': 8.4,
        'Cumin': 0,
        'Corl': 0,
        'Clvs': 0,
        'Pppr': 0,
        'Mstrd': 0,
        'Fnnl': 0,
        'Chll': 0,
        'Ppl': 0,
        'DhN': 0,
        'BlkSl': 0,
        'Gngr': 0
      }
    },
    {
      id: '3',
      sku: 'SKU003',
      name: 'Garam Masala',
      quantity: 25,
      rmQuantities: {
        'Trk': 0,
        'Cumin': 5,
        'Corl': 2.5,
        'Clvs': 1.2,
        'Pppr': 3.0,
        'Mstrd': 0,
        'Fnnl': 0,
        'Chll': 0,
        'Ppl': 0,
        'DhN': 0,
        'BlkSl': 0,
        'Gngr': 1.0
      }
    }
  ]);

  const [newSKU, setNewSKU] = useState('');
  const [newUnits, setNewUnits] = useState('');

  // Calculate totals for each column
  const calculateTotals = () => {
    const totals: { [key: string]: number } = {};
    rawMaterials.forEach(rm => {
      totals[rm] = plans.reduce((sum, plan) => sum + (plan.rmQuantities[rm] || 0), 0);
    });
    
    const totalQuantity = plans.reduce((sum, plan) => sum + plan.quantity, 0);
    
    return { ...totals, quantity: totalQuantity };
  };

  const totals = calculateTotals();

  const handleAddNewRow = () => {
    if (!newSKU) {
      toast({
        title: "Input required",
        description: "Please enter an SKU before adding a new row.",
        variant: "destructive"
      });
      return;
    }

    const newPlan: ProductionPlan = {
      id: Date.now().toString(),
      sku: newSKU,
      name: `Product ${plans.length + 1}`,
      quantity: parseInt(newUnits) || 0,
      rmQuantities: Object.fromEntries(rawMaterials.map(rm => [rm, 0]))
    };

    setPlans([...plans, newPlan]);
    setNewSKU('');
    setNewUnits('');
    
    toast({
      title: "Row added",
      description: `Added ${newSKU} to the production planner.`
    });
  };

  const handleSavePlan = () => {
    toast({
      title: "Plan saved",
      description: "Production plan has been saved successfully."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Production Planning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="grid w-full md:w-auto gap-2">
              <Label htmlFor="newSKU">SKU</Label>
              <Input
                id="newSKU"
                value={newSKU}
                onChange={(e) => setNewSKU(e.target.value)}
                placeholder="Enter SKU"
              />
            </div>
            
            <div className="grid w-full md:w-auto gap-2">
              <Label htmlFor="newUnits">Quantity</Label>
              <Input
                id="newUnits"
                type="number"
                value={newUnits}
                onChange={(e) => setNewUnits(e.target.value)}
                placeholder="Enter quantity"
              />
            </div>
            
            <div className="flex items-end">
              <Button onClick={handleAddNewRow}>
                <Plus size={16} className="mr-2" />
                Add Item
              </Button>
            </div>
            
            <div className="flex items-end ml-auto">
              <Button onClick={handleSavePlan} variant="default">
                <Save size={16} className="mr-2" />
                Save Plan
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">SKU</TableHead>
                  <TableHead className="w-48">Name</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  {rawMaterials.map(rm => (
                    <TableHead key={rm} className="text-center">
                      {rm}
                    </TableHead>
                  ))}
                  <TableHead className="text-center">Total RM</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>{plan.sku}</TableCell>
                    <TableCell>{plan.name}</TableCell>
                    <TableCell className="text-center">{plan.quantity}</TableCell>
                    {rawMaterials.map(rm => (
                      <TableCell key={rm} className="text-center">
                        {plan.rmQuantities[rm] || 0}
                      </TableCell>
                    ))}
                    <TableCell className="text-center">
                      {Object.values(plan.rmQuantities).reduce((sum, qty) => sum + qty, 0)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-medium">
                  <TableCell colSpan={2} className="text-right">Total</TableCell>
                  <TableCell className="text-center">{totals.quantity}</TableCell>
                  {rawMaterials.map(rm => (
                    <TableCell key={rm} className="text-center">
                      {totals[rm]}
                    </TableCell>
                  ))}
                  <TableCell className="text-center">
                    {Object.entries(totals)
                      .filter(([key]) => key !== 'quantity')
                      .reduce((sum, [_, value]) => sum + value, 0)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Formula Page</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Yellow highlighted columns can be manually entered by users. Other values are auto-populated.
          </p>
          
          <div className="border rounded-md overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Trk</TableHead>
                  <TableHead>Cumin</TableHead>
                  <TableHead>Corl</TableHead>
                  <TableHead>Clvs</TableHead>
                  <TableHead>Pppr</TableHead>
                  <TableHead>Mstrd</TableHead>
                  <TableHead>Fnnl</TableHead>
                  <TableHead>Chll</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>{plan.sku}</TableCell>
                    <TableCell>{plan.name}</TableCell>
                    <TableCell className="bg-yellow-100">{plan.rmQuantities['Trk']}</TableCell>
                    <TableCell className="bg-yellow-100">{plan.rmQuantities['Cumin']}</TableCell>
                    <TableCell className="bg-yellow-100">{plan.rmQuantities['Corl']}</TableCell>
                    <TableCell className="bg-yellow-100">{plan.rmQuantities['Clvs']}</TableCell>
                    <TableCell className="bg-yellow-100">{plan.rmQuantities['Pppr']}</TableCell>
                    <TableCell className="bg-yellow-100">{plan.rmQuantities['Mstrd']}</TableCell>
                    <TableCell className="bg-yellow-100">{plan.rmQuantities['Fnnl']}</TableCell>
                    <TableCell className="bg-yellow-100">{plan.rmQuantities['Chll']}</TableCell>
                    <TableCell>
                      {Object.values(plan.rmQuantities).reduce((sum, qty) => sum + qty, 0)}
                    </TableCell>
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

export default ProductionPlanner;
